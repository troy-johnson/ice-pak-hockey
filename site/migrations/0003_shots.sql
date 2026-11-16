-- Shots on goal of each team, from the Scoresheet. Null when the Scoresheet has no shots.
ALTER TABLE games ADD COLUMN ice_pak_shots INTEGER;
ALTER TABLE games ADD COLUMN opponent_shots INTEGER;
