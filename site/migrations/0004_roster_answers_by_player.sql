-- The Player Bank finds the newest Roster of each Player. Without this index, each Player scans all Roster Answers.
CREATE INDEX roster_answers_by_player ON roster_answers (player_id);
