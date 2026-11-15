ALTER TABLE projects ADD COLUMN display_order INT NOT NULL DEFAULT 0;

UPDATE projects SET display_order = id;
