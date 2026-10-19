CREATE TABLE profile_links (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    UNIQUE (profile_id, label)
);

INSERT INTO profile_links (profile_id, label, url, display_order)
SELECT p.id, l.label, l.url, l.display_order
FROM profiles p,
     (VALUES
         ('Codeforces', 'https://codeforces.com/profile/infernal', 1),
         ('LeetCode', 'https://leetcode.com/u/howardhalim/', 2)
     ) AS l (label, url, display_order)
WHERE p.slug = 'default';