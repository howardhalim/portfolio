CREATE TABLE skills (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    UNIQUE (profile_id, name)
);

INSERT INTO skills (profile_id, name, display_order)
SELECT p.id, s.name, s.display_order
FROM profiles p,
     (VALUES
         ('TypeScript', 1),
         ('Next.js', 2),
         ('React', 3),
         ('Tailwind CSS', 4),
         ('Java', 5),
         ('Spring Boot', 6),
         ('PostgreSQL', 7),
         ('Docker', 8),
         ('GitHub Actions', 9),
         ('Turborepo', 10)
     ) AS s (name, display_order)
WHERE p.slug = 'default';