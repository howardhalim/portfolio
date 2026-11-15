-- Real site content. Replaces the placeholder seed data from V2-V5, V7 and V8.
-- Every statement is scoped to the profile with slug 'default'.

UPDATE profiles
SET title = 'Back-End Software Engineer',
    tagline = 'Back-end engineer with a security background: Java, Spring Boot, PostgreSQL, and biometric authentication research.',
    bio = 'Back-end software engineer with an M.Sc. in System Security and Design (SUTD) and two peer-reviewed ESORICS papers on biometric authentication.',
    about = 'I am a back-end software engineer with an M.Sc. in System Security and Design from the Singapore University of Technology and Design (SUTD, 2024) and a first-class B.Sc. in Computer Science from Asia Pacific University.

Since October 2024 I have been a Senior Research Assistant at iTrust, SUTD, where I built an Android app for behavioral biometric authentication that runs the whole flow on the phone: it captures a user''s blow through the microphone and their face through the camera. I trained the blow-based model (a CNN with triplet loss), collected a dataset of around 100 participants, and implemented on-phone ultrasound and Doppler-shift analysis for liveness detection. This work led to two papers at ESORICS: BlowPrint (2025) and BlowLive (2026).

Before that I was a Technology Analyst at Deloitte Consulting Indonesia, where I developed Java Spring Boot microservices for an internal resource management system and explored GenAI applications with the LangChain framework.

I enjoy problem solving and competitive programming, and this portfolio is a learning project: a Spring Boot and Next.js application built end to end with the architecture, testing and tooling a professional team would use.',
    updated_at = now()
WHERE slug = 'default';

DELETE FROM projects WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'default');

INSERT INTO projects (profile_id, slug, title, summary, description, repo_url, live_url, display_order)
SELECT p.id, v.slug, v.title, v.summary, v.description, v.repo_url, v.live_url, v.display_order
FROM profiles p,
     (VALUES
         ('portfolio-platform',
          'Portfolio Platform',
          'Full-stack portfolio built end to end with a Spring Boot REST API, PostgreSQL and a Next.js frontend.',
          'A Spring Boot 3 (Java 21) REST API with a layered design (controller, service, repository) on PostgreSQL, with Flyway migrations and RFC 7807 error responses. JWT admin authentication with Spring Security using a default-deny policy, JUnit and security-rule tests, GitHub Actions CI, and Docker Compose for local PostgreSQL. The frontend is built with Next.js and Tailwind CSS.',
          'https://github.com/howardhalim/portfolio',
          NULL,
          1),
         ('blowprint',
          'BlowPrint',
          'Behavioral biometric authentication on a smartphone that identifies users by the sound of their blow (ESORICS 2025).',
          'An Android app that runs the full authentication flow on the phone. It captures the user''s blow through the microphone and their face through the camera. The blow-based biometric is a CNN trained with triplet loss, and FaceNet is used as the face second factor. Evaluated on a real dataset collected from about 100 participants. Published at ESORICS 2025, a top European security conference.',
          NULL,
          'https://link.springer.com/chapter/10.1007/978-3-032-07901-5_9',
          2),
         ('blowlive',
          'BlowLive',
          'Liveness detection for blow-based authentication, using on-phone ultrasound and Doppler-shift analysis (ESORICS 2026).',
          'Adds liveness detection to blow-based biometric authentication. The phone captures ultrasound and analyzes the Doppler shift on the device itself. The real dataset of about 100 participants was used to evaluate both BlowPrint and BlowLive. Published at ESORICS 2026.',
          NULL,
          'https://link.springer.com/chapter/10.1007/978-3-032-38695-3_29',
          3),
         ('mfaz',
          'Multi-Factor Authorization (MFAz)',
          'A second authorization factor that blocks session hijacking, built from a user''s past granted accesses.',
          'MFAz blocks session hijacking with a second authorization factor built from the user''s past granted accesses, on top of access rules. Built in C++ with a Bloom filter and Ethereum smart contracts (Ganache). Verification takes 0.9 to 4.1 ms on a gateway, a laptop and a Raspberry Pi 4, and it blocked all tested hijacking attempts.',
          NULL,
          NULL,
          4),
         ('ssl-tls-grader',
          'SSL/TLS Grader',
          'Python tool that grades a server''s TLS setup from A+ to F.',
          'A Python tool that grades a server''s TLS setup from A+ to F, checking certificates, revocation, protocols, key size and ciphers. It graded 327 education-sector sites in four countries; about 80% scored C+ and 7% scored A or A+.',
          NULL,
          NULL,
          5)
     ) AS v (slug, title, summary, description, repo_url, live_url, display_order)
WHERE p.slug = 'default';

INSERT INTO project_tech_stack (project_id, tech)
SELECT pr.id, t.tech
FROM projects pr
JOIN (VALUES
         ('portfolio-platform', 'Java 21'),
         ('portfolio-platform', 'Spring Boot'),
         ('portfolio-platform', 'Spring Security'),
         ('portfolio-platform', 'PostgreSQL'),
         ('portfolio-platform', 'Flyway'),
         ('portfolio-platform', 'Next.js'),
         ('portfolio-platform', 'TypeScript'),
         ('portfolio-platform', 'Docker'),
         ('portfolio-platform', 'GitHub Actions'),
         ('blowprint', 'Android'),
         ('blowprint', 'Python'),
         ('blowprint', 'CNN'),
         ('blowprint', 'Triplet loss'),
         ('blowprint', 'FaceNet'),
         ('blowlive', 'Android'),
         ('blowlive', 'Ultrasound'),
         ('blowlive', 'Doppler analysis'),
         ('mfaz', 'C++'),
         ('mfaz', 'MIRACL'),
         ('mfaz', 'Ethereum'),
         ('mfaz', 'Bloom filter'),
         ('ssl-tls-grader', 'Python'),
         ('ssl-tls-grader', 'pyOpenSSL'),
         ('ssl-tls-grader', 'TLS')
     ) AS t (slug, tech) ON t.slug = pr.slug
WHERE pr.profile_id = (SELECT id FROM profiles WHERE slug = 'default');

DELETE FROM skills WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'default');

INSERT INTO skills (profile_id, name, display_order)
SELECT p.id, s.name, s.display_order
FROM profiles p,
     (VALUES
         ('Java', 1),
         ('Spring Boot', 2),
         ('Spring Security', 3),
         ('PostgreSQL', 4),
         ('Flyway', 5),
         ('REST API design', 6),
         ('JUnit', 7),
         ('Docker', 8),
         ('GitHub Actions', 9),
         ('Python', 10),
         ('C/C++', 11),
         ('SQL', 12),
         ('TypeScript', 13),
         ('React / Next.js', 14),
         ('Android', 15),
         ('LangChain', 16),
         ('Flask', 17),
         ('R', 18)
     ) AS s (name, display_order)
WHERE p.slug = 'default';

DELETE FROM profile_links WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'default');

INSERT INTO profile_links (profile_id, label, url, display_order)
SELECT p.id, l.label, l.url, l.display_order
FROM profiles p,
     (VALUES
         ('LinkedIn', 'https://www.linkedin.com/in/howardhalim', 1),
         ('Codeforces', 'https://codeforces.com/profile/infernal', 2),
         ('LeetCode', 'https://leetcode.com/u/howardhalim/', 3)
     ) AS l (label, url, display_order)
WHERE p.slug = 'default';

UPDATE blog_posts
SET published_at = NULL,
    updated_at = now()
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'default');
