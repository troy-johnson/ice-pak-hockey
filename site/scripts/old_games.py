"""Moves the old Games into the site database.

The sources are the Old Site dump, the BenchApp copy, and the HHG database. HHG is read-only.
The output has player data, so it goes to backups/, and git ignores it.

Step 1 writes the Player Matches for Troy's review:

    python3 site/scripts/old_games.py matches > backups/player-matches.csv

Troy corrects the "player" column. An empty "player" means that the person is not a Player.

Step 2 reads the reviewed file and writes the SQL:

    python3 site/scripts/old_games.py sql > backups/old-games.sql
    npx wrangler d1 execute ice-pak --local --file ../backups/old-games.sql

The SQL can run again: it replaces the Games that it loaded before.
"""

import csv
import json
import re
import sqlite3
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
DUMP = ROOT / "backups/old-site-2026-11-15.sql"
BENCHAPP = ROOT / "backups/benchapp/benchapp-2026-11-16.json"
BENCHAPP_EVENTS = ROOT / "backups/benchapp/benchapp-events-2026-11-16.json"
PLAYER_BANK = ROOT / "backups/seed-player-bank.sql"
MATCHES = ROOT / "backups/player-matches.csv"
HHG_DB = Path.home() / "hockey/hockey.db"
LOGOS = ROOT / "docs/design/img/opp"

UTAH = ZoneInfo("America/Denver")
# The day of the BenchApp copy. A later Game comes from the Calendar Feed.
COPY_DAY = "2026-11-16"
ICE_PAK_BENCHAPP_TEAM = 248068
# The Old Site player "Ice Pak" stands for a scorer that nobody knows.
OLD_SITE_NO_PLAYER = "6aca0d5e-2896-4ea7-b42c-9d683ff8adce"
# The Old Site gives jersey number 95 or 0 to a player with no number.
NO_NUMBER = {"0", "95", "100"}

# Troy confirmed the BenchApp seasons on 2026-11-16.
BENCHAPP_SEASONS = {
    376746: "County Winter '21-22",
    386384: "County Summer '22",
    397128: "County Winter '22-23",
    408350: "County Summer '23",
    418878: "County Winter '23-24",
    442978: "County Summer '24",
    452512: "County Winter '24-25",
    474913: "County Summer '25",
    492383: "County Winter '25-26",
    502529: "MIC Winter '26",
    506222: "County Summer '26",
    520964: "MIC Summer '26",
    522761: "County Winter '26-27",
}
# The events of "2026 Summer (Mammoth)" before this day are copies of the MIC Winter '26 Games.
MIC_SUMMER_26_FIRST_DAY = "2026-07-28"

GAME_TYPES = {
    "Regular Season": "regular", "Playoffs": "playoff", "Preseason": "preseason",
    "Regular": "regular", "Playoff": "playoff", "PreSeason": "preseason",
    # Troy: the "Tournament" Games of MIC Summer '26 were playoff Games.
    "Tournament": "playoff",
}
PERIODS = {"One": 1, "Two": 2, "Three": 3, "OT": 4}
PENALTY_MINUTES = {"Two": 2, "Four": 4, "Five": 5, "Ten": 10, "Game": 10}

OPPONENT_ALIASES = {
    "puckoff": "Puck Off",
    "puck off": "Puck Off",
    "puckheads": "The Puckheads",
    "skate n score": "Skate & Score",
    "yetis": "The Yetis",
}
FIRST_NAME_ALIASES = {"rob": "robert", "jonny": "johnny", "hank": "henry", "matt": "matthew"}


def quote(value):
    if value is None:
        return "NULL"
    if isinstance(value, (int, float)):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def split_name(name):
    words = name.split()
    return " ".join(words[:-1]), words[-1]


def warn(*parts):
    print(*parts, file=sys.stderr)


# --- Sources -------------------------------------------------------------------------------------


def unescape(value):
    if value == "\\N":
        return None
    return re.sub(r"\\(.)", lambda m: {"t": "\t", "n": "\n", "\\": "\\"}.get(m.group(1), m.group(1)), value)


def read_dump():
    dump = DUMP.read_text(encoding="utf-8")
    tables = {}
    for match in re.finditer(r"^COPY public\.(\w+) \((.*?)\) FROM stdin;\n(.*?)^\\\.$", dump, re.S | re.M):
        columns = [column.strip().strip('"') for column in match.group(2).split(",")]
        rows = [line.split("\t") for line in match.group(3).split("\n") if line]
        tables[match.group(1)] = [dict(zip(columns, map(unescape, row))) for row in rows]
    return tables


def opponent_name(raw):
    name = re.sub(r"\s*\(.*\)\s*$", "", raw or "").strip()
    return OPPONENT_ALIASES.get(name.lower(), name)


def rink_name(location):
    text = (location or "").lower()
    if "mammoth" in text or text in ("north rink", "south rink"):
        return "Mammoth Ice Center"
    if "sports complex" in text:
        return "SLC Sports Complex"
    if "acord" in text:
        return "West Valley Acord Ice Center"
    if "county ice center" in text:
        return "County Ice Center"
    return None


def old_league_season(season):
    league = season["leagueName"]
    words = season["name"].split()
    years = words[-1].split("-")
    short = "'" + "-".join(year[2:] for year in years)
    return f"{league} {words[0]} {short}"


def benchapp_games():
    """Each BenchApp Game up to the day of the copy, with its League Season."""
    seasons = json.loads(BENCHAPP.read_text())
    details = json.loads(BENCHAPP_EVENTS.read_text())
    games = []
    for season in seasons:
        league_season = BENCHAPP_SEASONS[season["season"]["id"]]
        for event in season["events"]:
            when = event["dateAndTime"]["full"][:16]
            if event["type"] != "Game" or when[:10] > COPY_DAY:
                continue
            if league_season == "MIC Summer '26" and when[:10] < MIC_SUMMER_26_FIRST_DAY:
                continue
            ice_pak_home = event["homeOrAway"] == "Home"
            other = event["awayTeam"] if ice_pak_home else event["homeTeam"]
            stats = event["stats"] or {}
            home_score, away_score = stats.get("homeTeamScore") or 0, stats.get("awayTeamScore") or 0
            detail = details.get(str(event["id"]), {})
            games.append({
                "id": event["id"],
                "league_season": league_season,
                "starts_at": when.replace("T", " "),
                "type": GAME_TYPES[event["subtype"]],
                "side": "home" if ice_pak_home else "away",
                "opponent": opponent_name((other or {}).get("name")) or None,
                "rink": rink_name((event["location"] or {}).get("name")),
                # BenchApp shows 0-0 when nobody entered the score.
                "score": None if home_score == away_score == 0 else
                (home_score, away_score) if ice_pak_home else (away_score, home_score),
                "players": detail.get("players", []),
                "points": detail.get("points", {}).get("points", []),
                "penalties": detail.get("points", {}).get("penalties", []),
                "rostered": season["roster"],
            })
    return games


def hhg_people():
    """The HHG people who played for Ice Pak."""
    db = sqlite3.connect(f"file:{HHG_DB}?mode=ro", uri=True)
    rows = db.execute(
        """SELECT DISTINCT people.id, people.first_name, people.last_name FROM people
           WHERE people.id IN (SELECT person_id FROM game_players WHERE team_id = 'icepak'
                               UNION SELECT person_id FROM roster_entries WHERE team_id = 'icepak')"""
    ).fetchall()
    db.close()
    return [(person_id, f"{first} {last}".strip()) for person_id, first, last in rows]


def hhg_opponent_colors():
    db = sqlite3.connect(f"file:{HHG_DB}?mode=ro", uri=True)
    rows = db.execute("SELECT name, colors FROM teams WHERE own_team = 0").fetchall()
    db.close()
    colors = {}
    for name, value in rows:
        data = json.loads(value or "{}")
        if data.get("primary"):
            colors[opponent_name(name)] = (data["primary"], data.get("secondary", ""))
    return colors


def player_bank_names():
    pattern = re.compile(r"VALUES \('((?:[^']|'')*)', '((?:[^']|'')*)'")
    names = []
    for line in PLAYER_BANK.read_text().splitlines():
        match = pattern.search(line) if line.startswith("INSERT OR IGNORE INTO players") else None
        if match:
            names.append(f"{match.group(1)} {match.group(2)}".replace("''", "'"))
    return names


# --- Player Matches ------------------------------------------------------------------------------


def clean_name(name):
    return " ".join((name or "").replace("\u2019", "'").split())


def name_key(name):
    words = clean_name(name).lower().replace(".", "").split()
    if not words:
        return ""
    words[0] = FIRST_NAME_ALIASES.get(words[0], words[0])
    return " ".join(words)


def propose_matches():
    dump = read_dump()
    people = []  # (source, source id, source name, position, number)
    nicknames = {}
    for row in dump["players"]:
        name = clean_name(f"{row['firstName'] or ''} {row['lastName'] or ''}")
        if row["nickname"]:
            nicknames[row["nickname"].lower()] = name
        number = row["jerseyNumber"] or row["number"]
        position = {"F": "forward", "D": "defense", "G": "goalie"}.get(row["position"])
        people.append(("old-site", row["id"], name, position, None if number in NO_NUMBER else number))

    benchapp = {}
    for game in sorted(benchapp_games(), key=lambda game: game["starts_at"]):
        rostered = [node for nodes in game["rostered"].values() for node in nodes]
        for node in game["players"] + rostered:
            person_id = node.get("playerId") or (node.get("player") or {}).get("id")
            name = node.get("playerName") or (node.get("player") or {}).get("name")
            position = {"Forward": "forward", "Defence": "defense", "Goalie": "goalie"}.get(node["position"])
            entry = benchapp.setdefault(person_id, {"name": name, "positions": Counter(), "number": None})
            if position:
                entry["positions"][position] += 1
            if node.get("playerNumber") is not None:
                entry["number"] = node["playerNumber"]
    for person_id, entry in benchapp.items():
        position = entry["positions"].most_common(1)[0][0] if entry["positions"] else None
        people.append(("benchapp", str(person_id), clean_name(entry["name"]), position, entry["number"]))

    for person_id, name in hhg_people():
        people.append(("hhg", person_id, name, None, None))

    players = {name_key(name): name for name in player_bank_names() if name != "Player Name"}
    bank = set(players)
    rows = []
    # Old Site names first: they set the name of a past Player that is not in the Player Bank.
    for source, source_id, name, position, number in people:
        key = name_key(name)
        if name.lower() in nicknames:
            key = name_key(nicknames[name.lower()])
            method = "nickname, check" if key in players else ""
        else:
            method = "exact" if key in players and players[key] == name else "alias" if key in players else ""
        if not method:
            last = key.split()[-1] if key else ""
            same_last = [player for player_key, player in players.items() if player_key.split()[-1] == last]
            initial = [player for player in same_last if player[0].lower() == key[:1]]
            if len(initial) == 1:
                method, key = "last name, check", name_key(initial[0])
        if source_id == OLD_SITE_NO_PLAYER or not name:
            player, method = "", "not a player"
        elif method:
            player = players[key]
        else:
            player, method = name, "new"
            players[key] = name
        if method == "new" and len(name.split()) < 2:
            method = "new, check the name"
        in_bank = "yes" if name_key(player) in bank else ""
        rows.append((player, source, source_id, name, method, in_bank, position or "", number or ""))

    writer = csv.writer(sys.stdout)
    writer.writerow(["player", "source", "source_id", "source_name", "method", "in_player_bank", "position", "number"])
    for row in sorted(rows, key=lambda row: (row[0] == "", row[0].split()[-1:] , row[0], row[1])):
        writer.writerow(row)


def read_matches():
    matches = {}
    details = {}
    for row in csv.DictReader(MATCHES.open()):
        player = row["player"].strip()
        if not player:
            continue
        matches[(row["source"], row["source_id"])] = player
        detail = details.setdefault(player, {"position": Counter(), "number": None})
        if row["position"]:
            detail["position"][row["position"]] += 1
        if row["number"] and row["source"] in ("benchapp", "old-site") and not detail["number"]:
            detail["number"] = int(row["number"])
    return matches, details


# --- SQL -----------------------------------------------------------------------------------------


def player_ref(name):
    first, last = split_name(name)
    return f"(SELECT id FROM players WHERE first_name = {quote(first)} AND last_name = {quote(last)})"


def to_utah(utc_text):
    when = datetime.fromisoformat(utc_text.replace("+00", "+00:00"))
    return when.astimezone(UTAH).strftime("%Y-%m-%d %H:%M")


def clock(value):
    value = (value or "").strip()
    return re.sub(r"^0(\d:)", r"\1", value)


def match_benchapp(old_games, benchapp, opponents_by_id):
    """Links each old Game to its BenchApp Game. The Old Site time is UTC, or Utah time for some Games."""
    by_day = defaultdict(list)
    for game in benchapp:
        by_day[game["starts_at"][:10]].append(game)
    links = {}
    for old in old_games:
        candidates = [to_utah(old["date"]), old["date"][:16]]
        opponent = opponent_name(opponents_by_id.get(old["opponentId"]))
        for when in candidates:
            same_day = [game for game in by_day[when[:10]] if game["id"] not in links.values()]
            exact = [game for game in same_day if game["starts_at"] == when]
            named = [game for game in same_day if game["opponent"] == opponent]
            found = exact or named
            if found:
                links[old["id"]] = found[0]["id"]
                break
    return links


def write_sql():
    dump = read_dump()
    matches, details = read_matches()
    benchapp = benchapp_games()
    benchapp_by_id = {game["id"]: game for game in benchapp}
    colors = hhg_opponent_colors()
    seasons = {row["id"]: row for row in dump["seasons"]}
    opponents_by_id = {row["id"]: row["teamName"] for row in dump["teams"]}
    rinks_by_id = {row["id"]: row["name"] for row in dump["locations"]}
    old_games = sorted(dump["games"], key=lambda row: row["date"])
    links = match_benchapp(old_games, benchapp, opponents_by_id)
    old_goals = defaultdict(list)
    for row in dump["goals"]:
        old_goals[row["gameId"]].append(row)
    old_penalties = defaultdict(list)
    for row in dump["penalties"]:
        old_penalties[row["gameId"]].append(row)

    def matched(source, source_id):
        return matches.get((source, str(source_id)))

    out = ["-- Made by site/scripts/old_games.py. It has player data, so keep this file out of git."]

    # Players that are not in the Player Bank yet. A Player that exists keeps the Manager's values.
    for player in sorted(set(matches.values())):
        first, last = split_name(player)
        detail = details[player]
        position = detail["position"].most_common(1)[0][0] if detail["position"] else None
        out.append(
            "INSERT OR IGNORE INTO players (first_name, last_name, position, number) "
            f"VALUES ({quote(first)}, {quote(last)}, {quote(position)}, {quote(detail['number'])});"
        )
        out.append(f"UPDATE players SET number = {quote(detail['number'])} "
                   f"WHERE number IS NULL AND id = {player_ref(player)};")
    for (source, source_id), player in sorted(matches.items()):
        source_name = next(row["source_name"] for row in csv.DictReader(MATCHES.open())
                           if row["source"] == source and row["source_id"] == source_id)
        out.append(
            "INSERT INTO player_matches (source, source_id, source_name, player_id) "
            f"VALUES ({quote(source)}, {quote(source_id)}, {quote(source_name)}, {player_ref(player)}) "
            "ON CONFLICT (source, source_id) DO UPDATE SET source_name = excluded.source_name, "
            "player_id = excluded.player_id;"
        )

    games = []  # one dict for each Game to load
    for old in old_games:
        link = benchapp_by_id.get(links.get(old["id"]))
        season = seasons[old["seasonId"]]
        games.append({"old": old, "benchapp": link,
                      "league_season": old_league_season(season),
                      "league": season["leagueName"]})
    linked = set(links.values())
    for game in benchapp:
        if game["id"] in linked:
            continue
        if not game["opponent"] or (not game["players"] and game["score"] is None):
            warn("Skipped BenchApp Game with no opponent or no players:", game["starts_at"], game["opponent"])
            continue
        games.append({"old": None, "benchapp": game, "league_season": game["league_season"],
                      "league": game["league_season"].split()[0]})

    league_season_start = {}
    for game in games:
        when = game["benchapp"]["starts_at"] if game["benchapp"] else to_utah(game["old"]["date"])
        game["starts_at"] = when
        name = game["league_season"]
        league_season_start[name] = min(league_season_start.get(name, when), when)
    for name, start in sorted(league_season_start.items(), key=lambda item: item[1]):
        league = name.split()[0]
        out.append(
            "INSERT OR IGNORE INTO league_seasons (league_id, name) "
            f"SELECT id, {quote(name)} FROM leagues WHERE short_name = {quote(league)};"
        )
        out.append(f"UPDATE league_seasons SET starts_on = {quote(start[:10])} "
                   f"WHERE name = {quote(name)} AND starts_on IS NULL;")

    opponents = set()
    for game in games:
        name = opponent_name(opponents_by_id[game["old"]["opponentId"]]) if game["old"] else game["benchapp"]["opponent"]
        game["opponent"] = None if name == "Unknown" else name
        if game["opponent"]:
            opponents.add(game["opponent"])
    for name in sorted(opponents):
        slug = re.sub(r"[^a-z0-9]", "", name.lower())
        logo = next((f"{candidate}.png" for candidate in (slug, re.sub(r"^the", "", slug), re.sub(r"\d+$", "", slug))
                     if (LOGOS / f"{candidate}.png").exists()), "")
        color, color_2 = colors.get(name, ("", ""))
        out.append(
            "INSERT INTO opponents (name, logo, color, color_2) "
            f"VALUES ({quote(name)}, {quote(logo)}, {quote(color)}, {quote(color_2)}) "
            "ON CONFLICT (name) DO UPDATE SET logo = excluded.logo, color = excluded.color, color_2 = excluded.color_2;"
        )

    # A second run replaces what the first run loaded. A Game from an HHG Import keeps its Box Score.
    loaded = "SELECT id FROM games WHERE hhg_game_id IS NULL AND (old_site_id IS NOT NULL OR benchapp_event_id IS NOT NULL)"
    for table in ("goals", "penalties", "game_players"):
        out.append(f"DELETE FROM {table} WHERE game_id IN ({loaded});")

    report = Counter()
    for game in games:
        old, link = game["old"], game["benchapp"]
        key = f"old_site_id = {quote(old['id'])}" if old else f"benchapp_event_id = {link['id']}"
        game_ref = f"(SELECT id FROM games WHERE {key})"
        goals, penalties = [], []
        shootout = 0

        if old and old_goals[old["id"]]:
            report["goals from the Old Site"] += 1
            for row in old_goals[old["id"]]:
                ice_pak = row["team"] == "Ice Pak"
                assists = [matched("old-site", player_id) for player_id in json.loads(row["assists"] or "[]")]
                goals.append({
                    "team": "ice-pak" if ice_pak else "opponent", "period": int(row["period"]),
                    "clock": clock(row["time"]),
                    "scorer": matched("old-site", row["playerId"]) if ice_pak else None,
                    "assists": assists, "video": row["ytLink"] or "",
                })
            for row in old_penalties[old["id"]]:
                ice_pak = row["team"] == "Ice Pak"
                penalties.append({
                    "team": "ice-pak" if ice_pak else "opponent", "period": int(row["period"] or 0),
                    "clock": clock(row["time"]), "infraction": row["penaltyType"] or "",
                    "player": matched("old-site", row["playerId"]) if ice_pak else None,
                    "minutes": float(row["minutes"]), "video": row["ytLink"] or "",
                })
        elif link and link["points"]:
            report["goals from BenchApp"] += 1
            for point in link["points"]:
                ice_pak = point["team"]["id"] == ICE_PAK_BENCHAPP_TEAM
                if point["period"] == "SO":
                    shootout = 1
                    continue
                person = lambda field: matched("benchapp", (point[field] or {}).get("id")) if ice_pak else None
                goals.append({
                    "team": "ice-pak" if ice_pak else "opponent", "period": PERIODS[point["period"]],
                    "clock": clock(point["time"]), "scorer": person("goalPlayer"),
                    "assists": [person("assistOnePlayer"), person("assistTwoPlayer")], "video": "",
                })
            for penalty in link["penalties"]:
                ice_pak = penalty["team"]["id"] == ICE_PAK_BENCHAPP_TEAM
                penalties.append({
                    "team": "ice-pak" if ice_pak else "opponent", "period": PERIODS[penalty["period"]],
                    "clock": clock(penalty["time"]),
                    "infraction": (penalty["kind"] or "").replace("-", " ").title(),
                    "player": matched("benchapp", (penalty["player"] or {}).get("id")) if ice_pak else None,
                    "minutes": PENALTY_MINUTES[penalty["duration"]], "video": "",
                })

        # The final score comes from BenchApp when it has one, because some Box Scores miss goals.
        if goals:
            score = [sum(goal["team"] == team for goal in goals) for team in ("ice-pak", "opponent")]
            if link and link["score"] and tuple(score) != link["score"]:
                warn("Goals differ from the BenchApp score:", game["starts_at"], game["opponent"], score, link["score"])
                report["goals differ from the BenchApp score"] += 1
                score = list(link["score"])
            elif shootout:
                warn("Shootout with no final score:", game["starts_at"])
        elif link and link["score"]:
            score = list(link["score"])
            report["final score only, from BenchApp"] += 1
        else:
            score = [None, None]
            report["No Box Score"] += 1

        game_type = link["type"] if link else GAME_TYPES[seasons[old["seasonId"]]["type"]]
        rink = (link and link["rink"]) or (old and rinks_by_id.get(old["locationId"]))
        recap = (old and (old["video"] or old["embedLink"])) or ""
        out.append(
            "INSERT INTO games (league_season_id, game_type, starts_at, opponent_id, rink_id, ice_pak_side, "
            "ice_pak_score, opponent_score, shootout, recap_url, players_complete, old_site_id, benchapp_event_id) VALUES ("
            f"(SELECT id FROM league_seasons WHERE name = {quote(game['league_season'])}), {quote(game_type)}, "
            f"{quote(game['starts_at'])}, "
            f"(SELECT id FROM opponents WHERE name = {quote(game['opponent'])}), "
            f"(SELECT id FROM rinks WHERE name = {quote(rink)}), {quote(link and link['side'])}, "
            f"{quote(score[0])}, {quote(score[1])}, {shootout}, {quote(recap)}, 0, "
            f"{quote(old and old['id'])}, {quote(link and link['id'])}) "
            f"ON CONFLICT ({'old_site_id' if old else 'benchapp_event_id'}) DO UPDATE SET "
            "league_season_id = excluded.league_season_id, game_type = excluded.game_type, "
            "starts_at = excluded.starts_at, opponent_id = excluded.opponent_id, rink_id = excluded.rink_id, "
            "ice_pak_side = excluded.ice_pak_side, ice_pak_score = excluded.ice_pak_score, "
            "opponent_score = excluded.opponent_score, shootout = excluded.shootout, "
            "recap_url = excluded.recap_url, benchapp_event_id = excluded.benchapp_event_id "
            "WHERE games.hhg_game_id IS NULL;"
        )
        for goal in goals:
            assists = (goal["assists"] + [None, None])[:2]
            out.append(
                "INSERT INTO goals (game_id, team, period, clock, scorer_id, assist_1_id, assist_2_id, video_url) VALUES ("
                f"{game_ref}, {quote(goal['team'])}, {goal['period']}, {quote(goal['clock'])}, "
                + ", ".join(player_ref(name) if name else "NULL" for name in [goal["scorer"]] + assists)
                + f", {quote(goal['video'])});"
            )
        for penalty in penalties:
            out.append(
                "INSERT INTO penalties (game_id, team, period, clock, player_id, infraction, minutes, video_url) VALUES ("
                f"{game_ref}, {quote(penalty['team'])}, {penalty['period']}, {quote(penalty['clock'])}, "
                f"{player_ref(penalty['player']) if penalty['player'] else 'NULL'}, {quote(penalty['infraction'])}, "
                f"{penalty['minutes']:g}, {quote(penalty['video'])});"
            )

        # The Game Players: the Old Site list, or else the Players with "In" in BenchApp.
        goalies = {matched("benchapp", node["playerId"]) for node in (link["players"] if link else [])
                   if node["position"] == "Goalie"}
        roster = [player_id for player_id in json.loads(old["roster"] or "[]")] if old else []
        if roster:
            names = {matched("old-site", player_id) for player_id in roster}
            report["Game Players from the Old Site"] += 1
        elif link and link["players"]:
            names = {matched("benchapp", node["playerId"]) for node in link["players"]}
            report["Game Players from BenchApp"] += 1
        else:
            names = set()
            report["no Game Players"] += 1
        names.discard(None)
        for name in sorted(names):
            out.append(
                "INSERT OR IGNORE INTO game_players (game_id, player_id, is_goalie) "
                f"VALUES ({game_ref}, {player_ref(name)}, {int(name in goalies)});"
            )
        if names:
            out.append(f"UPDATE games SET players_complete = 1 WHERE {key};")

    # The Rosters of the past League Seasons, from BenchApp. An existing Roster Answer stays.
    seen = set()
    for game in benchapp:
        if game["league_season"] in seen:
            continue
        seen.add(game["league_season"])
        for category, answer in (("RegularPlayers", "full-time"), ("Goalies", "full-time"), ("Spares", "sub-only")):
            for node in game["rostered"].get(category, []):
                name = matched("benchapp", node["player"]["id"])
                if not name:
                    continue
                out.append(
                    "INSERT OR IGNORE INTO roster_answers (league_season_id, player_id, answer, is_goalie) VALUES ("
                    f"(SELECT id FROM league_seasons WHERE name = {quote(game['league_season'])}), "
                    f"{player_ref(name)}, {quote(answer)}, {int(category == 'Goalies')});"
                )

    print("\n".join(out))
    warn("Games:", len(games), dict(report))
    warn("Old Games linked to BenchApp:", len(links), "of", len(old_games))


if __name__ == "__main__":
    {"matches": propose_matches, "sql": write_sql}[sys.argv[1]]()
