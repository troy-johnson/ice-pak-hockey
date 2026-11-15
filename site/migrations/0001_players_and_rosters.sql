-- Money is in whole cents.

CREATE TABLE leagues (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  short_name TEXT NOT NULL UNIQUE
);

INSERT INTO leagues (name, short_name) VALUES ('Mammoth Ice Center', 'MIC'), ('County', 'County');

CREATE TABLE league_seasons (
  id INTEGER PRIMARY KEY,
  league_id INTEGER NOT NULL REFERENCES leagues (id),
  name TEXT NOT NULL UNIQUE,
  starts_on TEXT,
  league_fee INTEGER NOT NULL DEFAULT 0,
  target_forwards INTEGER NOT NULL DEFAULT 0,
  target_defense INTEGER NOT NULL DEFAULT 0,
  target_goalies INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE players (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT CHECK (position IN ('forward', 'defense', 'goalie')),
  priority_tier TEXT CHECK (priority_tier IN ('core', 'regular-sub', 'occasional-sub')),
  priority_order INTEGER NOT NULL DEFAULT 0,
  note TEXT NOT NULL DEFAULT '',
  UNIQUE (first_name, last_name)
);

-- A Player with no row for a League Season has given no answer.
CREATE TABLE roster_answers (
  league_season_id INTEGER NOT NULL REFERENCES league_seasons (id),
  player_id INTEGER NOT NULL REFERENCES players (id),
  answer TEXT NOT NULL CHECK (answer IN ('full-time', 'part-time', 'sub-only', 'out')),
  -- A Player can be a goalie in one League Season and a skater in another.
  is_goalie INTEGER NOT NULL DEFAULT 0 CHECK (is_goalie IN (0, 1)),
  PRIMARY KEY (league_season_id, player_id)
) WITHOUT ROWID;
