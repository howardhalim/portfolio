-- Title and copy become "Software Engineer" (no "back-end"). About is patched with replace()
-- so the rest of the text written in V12 stays exactly as it is.

UPDATE profiles
SET title = 'Software Engineer',
    tagline = 'Software engineer with a security background: Java, Spring Boot, PostgreSQL, and biometric authentication research.',
    bio = 'Software engineer with an M.Sc. in System Security and Design (SUTD) and two peer-reviewed ESORICS papers on biometric authentication.',
    about = replace(about, 'I am a back-end software engineer', 'I am a software engineer'),
    updated_at = now()
WHERE slug = 'default';
