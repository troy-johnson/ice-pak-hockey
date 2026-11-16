-- Games, their Box Scores, and the Player Matches.
-- A time of day is local time in Utah (America/Denver), written 'YYYY-MM-DD HH:MM'.

UPDATE leagues SET name = 'Salt Lake County' WHERE short_name = 'County';
INSERT INTO leagues (name, short_name) VALUES ('Utah Hockey League', 'UHL');

CREATE TABLE rinks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL DEFAULT '',
  -- The League that a new Game at this rink gets. A Manager can change the League of a Game.
  league_id INTEGER REFERENCES leagues (id)
);

INSERT INTO rinks (name, code, league_id) VALUES
  ('Mammoth Ice Center', 'MIC', (SELECT id FROM leagues WHERE short_name = 'MIC')),
  ('County Ice Center', 'CIC', (SELECT id FROM leagues WHERE short_name = 'County')),
  ('SLC Sports Complex', 'SLC', (SELECT id FROM leagues WHERE short_name = 'County')),
  ('West Valley Acord Ice Center', 'AIC', (SELECT id FROM leagues WHERE short_name = 'County')),
  ('Cottonwood Heights Recreation Center', 'CHR', (SELECT id FROM leagues WHERE short_name = 'UHL')),
  ('Maverik Center', 'MVK', (SELECT id FROM leagues WHERE short_name = 'UHL')),
  ('Weber County Ice Sheet', 'WCI', NULL);

CREATE TABLE opponents (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  -- A file name in /img/logos/. An empty value gives a disc with the two colours and the initials.
  logo TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '',
  color_2 TEXT NOT NULL DEFAULT ''
);

CREATE TABLE games (
  id INTEGER PRIMARY KEY,
  league_season_id INTEGER NOT NULL REFERENCES league_seasons (id),
  game_type TEXT NOT NULL DEFAULT 'regular' CHECK (game_type IN ('regular', 'playoff', 'preseason')),
  starts_at TEXT NOT NULL,
  -- Null for a Game from the Calendar Feed with no known opponent.
  opponent_id INTEGER REFERENCES opponents (id),
  rink_id INTEGER REFERENCES rinks (id),
  -- Null when nobody knows the side. The site then shows Ice Pak as the home team.
  ice_pak_side TEXT CHECK (ice_pak_side IN ('home', 'away')),
  -- The final score. Null for a Game with no Box Score.
  ice_pak_score INTEGER,
  opponent_score INTEGER,
  -- 1 when the Game ended in a shootout. The shootout winner gets one goal in the final score.
  shootout INTEGER NOT NULL DEFAULT 0 CHECK (shootout IN (0, 1)),
  headline TEXT NOT NULL DEFAULT '',
  recap_url TEXT NOT NULL DEFAULT '',
  recap_image TEXT NOT NULL DEFAULT '',
  -- 1 when the Game Players are the full list. Games played counts only such Games.
  players_complete INTEGER NOT NULL DEFAULT 0 CHECK (players_complete IN (0, 1)),
  -- The keys of the sources, so that a second load or Import changes the same Game.
  old_site_id TEXT UNIQUE,
  hhg_game_id TEXT UNIQUE,
  benchapp_event_id INTEGER UNIQUE,
  calendar_uid TEXT UNIQUE
);

CREATE INDEX games_by_league_season ON games (league_season_id, starts_at);
CREATE INDEX games_by_start ON games (starts_at);

CREATE TABLE goals (
  id INTEGER PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
  team TEXT NOT NULL CHECK (team IN ('ice-pak', 'opponent')),
  -- 1 to 3 for the periods, 4 for overtime.
  period INTEGER NOT NULL,
  -- The game clock as 'M:SS', or empty when the Scoresheet has no time.
  clock TEXT NOT NULL DEFAULT '',
  -- Null for an opponent goal, or for an Ice Pak goal with no known scorer.
  scorer_id INTEGER REFERENCES players (id),
  assist_1_id INTEGER REFERENCES players (id),
  assist_2_id INTEGER REFERENCES players (id),
  -- An HHG Short, or a goal video of the Old Site.
  video_url TEXT NOT NULL DEFAULT '',
  video_is_short INTEGER NOT NULL DEFAULT 0 CHECK (video_is_short IN (0, 1))
);

CREATE INDEX goals_by_game ON goals (game_id);
CREATE INDEX goals_by_scorer ON goals (scorer_id);

CREATE TABLE penalties (
  id INTEGER PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
  team TEXT NOT NULL CHECK (team IN ('ice-pak', 'opponent')),
  period INTEGER NOT NULL,
  clock TEXT NOT NULL DEFAULT '',
  -- Null for an opponent penalty.
  player_id INTEGER REFERENCES players (id),
  infraction TEXT NOT NULL DEFAULT '',
  -- The Old Site has penalties of 1.5 minutes.
  minutes REAL NOT NULL,
  video_url TEXT NOT NULL DEFAULT ''
);

CREATE INDEX penalties_by_game ON penalties (game_id);
CREATE INDEX penalties_by_player ON penalties (player_id);

CREATE TABLE game_players (
  game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
  player_id INTEGER NOT NULL REFERENCES players (id),
  -- A Player can play goalie in one Game and skate in another.
  is_goalie INTEGER NOT NULL DEFAULT 0 CHECK (is_goalie IN (0, 1)),
  PRIMARY KEY (game_id, player_id)
) WITHOUT ROWID;

CREATE INDEX game_players_by_player ON game_players (player_id);

-- A Player Match links a person in another source to one Player. Troy reviews each one.
CREATE TABLE player_matches (
  source TEXT NOT NULL CHECK (source IN ('old-site', 'hhg')),
  -- The id of the person in the source: a UUID of the Old Site, or an HHG person id.
  source_id TEXT NOT NULL,
  -- The name in the source, so that a review can compare it with the Player.
  source_name TEXT NOT NULL,
  player_id INTEGER NOT NULL REFERENCES players (id),
  PRIMARY KEY (source, source_id)
) WITHOUT ROWID;

CREATE INDEX player_matches_by_player ON player_matches (player_id);
