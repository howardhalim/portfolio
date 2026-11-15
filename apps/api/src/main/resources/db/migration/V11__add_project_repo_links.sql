UPDATE projects
SET repo_url = 'https://github.com/howardhalim/MFAz',
    live_url = 'https://arxiv.org/abs/2507.16060',
    description = description || ' Paper: "MFAz: Historical Access Based Multi-Factor Authorization" (arXiv, 2025).',
    updated_at = now()
WHERE slug = 'mfaz'
  AND profile_id = (SELECT id FROM profiles WHERE slug = 'default');

UPDATE projects
SET repo_url = 'https://github.com/howardhalim/SSL_Grading',
    updated_at = now()
WHERE slug = 'ssl-tls-grader'
  AND profile_id = (SELECT id FROM profiles WHERE slug = 'default');

UPDATE projects
SET description = description || ' Paper: "BlowPrint: Blow-Based Multi-factor Biometrics for Smartphone User Authentication" (ESORICS 2025).',
    updated_at = now()
WHERE slug = 'blowprint'
  AND profile_id = (SELECT id FROM profiles WHERE slug = 'default');

UPDATE projects
SET description = description || ' Paper: "BlowLive: Blow-Based Multi-Factor Biometrics with Liveness Detection and Revocability" (ESORICS 2026).',
    updated_at = now()
WHERE slug = 'blowlive'
  AND profile_id = (SELECT id FROM profiles WHERE slug = 'default');
