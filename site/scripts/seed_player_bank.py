"""Writes SQL that fills the Player Bank and the League Seasons from the Fee Sheet.

Positions come from the Old Site database dump, matched by name.
The SQL has player data, so keep it out of git.

    uv run --with openpyxl site/scripts/seed_player_bank.py \
        ".orca/drops/Ice Pak Fee Tracker.xlsx" backups/old-site-2026-11-15.sql > backups/seed-player-bank.sql
"""

import re
import sys

import openpyxl

# The tabs in time order, so the newest League Season gets the highest id.
LEAGUE_SEASON_TABS = [
    ("MIC Summer 26", "MIC Summer '26", "MIC"),
    ("County Summer 2026", "County Summer '26", "County"),
    ("MIC Winter 26", "MIC Winter '26", "MIC"),
]
# The League Seasons with open balances on the SUMMARY tab. Their Rosters are the core Players.
CURRENT_TABS = {"County Summer 2026", "MIC Winter 26"}
ANSWERS = {"Full": "full-time", "Half": "part-time", "Goalie": "full-time"}
# The Old Site marks 10 of 49 players as goalies, and the Fee Sheet shows some of them as skaters.
# So the goalies come only from the Fee Sheet.
POSITIONS = {"F": "forward", "D": "defense"}
PLAYERS_FIRST_ROW = 4
LEAGUE_FIRST_ROW = 20


def quote(value):
    return "NULL" if value is None else "'" + str(value).replace("'", "''") + "'"


def split_name(name):
    words = name.split()
    return " ".join(words[:-1]), words[-1]


def is_player_name(value):
    return isinstance(value, str) and 2 <= len(value.split()) <= 3 and value.strip() != "TOTALS"


def old_site_positions(dump_path):
    dump = open(dump_path, encoding="utf-8").read()
    block = re.search(r"^COPY public\.players \((.*?)\) FROM stdin;\n(.*?)\n\\\.$", dump, re.S | re.M)
    columns = [column.strip().strip('"') for column in block.group(1).split(",")]
    positions = {}
    for line in block.group(2).split("\n"):
        row = dict(zip(columns, line.split("\t")))
        name = f"{row['firstName']} {row['lastName']}".strip().lower()
        if row["position"] in POSITIONS:
            positions[name] = POSITIONS[row["position"]]
    return positions


def main(fee_sheet_path, dump_path):
    workbook = openpyxl.load_workbook(fee_sheet_path, data_only=True)
    positions = old_site_positions(dump_path)

    names = []
    answers = []  # (League Season name, player name, Roster Answer, is goalie)
    goalies = set()
    core = set()
    league_seasons = []

    for row in workbook["PLAYERS"].iter_rows(min_row=PLAYERS_FIRST_ROW, max_col=1):
        if is_player_name(row[0].value):
            names.append(row[0].value.strip())

    for tab, league_season, league in LEAGUE_SEASON_TABS:
        sheet = workbook[tab]
        league_seasons.append((league_season, league, round(float(sheet["B5"].value or 0) * 100)))
        for row in sheet.iter_rows(min_row=LEAGUE_FIRST_ROW, max_col=2):
            name, status = row[0].value, row[1].value
            if not is_player_name(name):
                continue
            name = name.strip()
            if name not in names:
                names.append(name)
            if status in ANSWERS:
                answers.append((league_season, name, ANSWERS[status], int(status == "Goalie")))
                if tab in CURRENT_TABS:
                    core.add(name)
            if status == "Goalie":
                goalies.add(name)

    print("-- Made by site/scripts/seed_player_bank.py. Keep this file out of git.")
    for name in names:
        first, last = split_name(name)
        position = "goalie" if name in goalies else positions.get(name.lower())
        tier = "core" if name in core else None
        print(
            "INSERT OR IGNORE INTO players (first_name, last_name, position, priority_tier) "
            f"VALUES ({quote(first)}, {quote(last)}, {quote(position)}, {quote(tier)});"
        )
    for league_season, league, fee in league_seasons:
        print(
            "INSERT OR IGNORE INTO league_seasons (league_id, name, league_fee) "
            f"SELECT id, {quote(league_season)}, {fee} FROM leagues WHERE short_name = {quote(league)};"
        )
    for league_season, name, answer, is_goalie in answers:
        first, last = split_name(name)
        print(
            "INSERT OR IGNORE INTO roster_answers (league_season_id, player_id, answer, is_goalie) "
            f"SELECT league_seasons.id, players.id, {quote(answer)}, {is_goalie} FROM league_seasons, players "
            f"WHERE league_seasons.name = {quote(league_season)} "
            f"AND first_name = {quote(first)} AND last_name = {quote(last)};"
        )


if __name__ == "__main__":
    main(*sys.argv[1:3])
