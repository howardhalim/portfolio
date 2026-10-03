CREATE TABLE profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline TEXT NOT NULL,
    bio TEXT NOT NULL,
    github_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO profiles (slug, name, title, tagline, bio, github_url)
VALUES (
    'default',
    'Howard Halim',
    'Software Engineer',
    'I build full-stack applications end to end, from data model to deployed UI, with a focus on clean architecture and production-grade practices.',
    'Placeholder bio. Replace this with a couple of sentences about your background and what you are currently building.',
    'https://github.com/howardhalim'
);

ALTER TABLE projects ADD COLUMN profile_id BIGINT REFERENCES profiles (id) ON DELETE CASCADE;

UPDATE projects SET profile_id = (SELECT id FROM profiles WHERE slug = 'default');

ALTER TABLE projects ALTER COLUMN profile_id SET NOT NULL;

CREATE INDEX idx_projects_profile_id ON projects (profile_id);