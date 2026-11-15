-- Corrects details of the two research projects and the About text so they match the papers.

UPDATE profiles
SET about = 'I am a back-end software engineer with an M.Sc. in System Security and Design from the Singapore University of Technology and Design (SUTD, 2024) and a first-class B.Sc. in Computer Science from Asia Pacific University.

Since October 2024 I have been a Senior Research Assistant at iTrust, SUTD, where I work on blow-based multi-factor biometric authentication for smartphones: a user''s blow is captured through the microphone and combined with their face from the front camera. I built the Android app that captures the blow and face data, and I collected two datasets of 50 participants each, 100 participants in total: the first for BlowPrint, and a second one with ultrasound recordings for BlowLive. For BlowLive I also trained a CNN with triplet loss for the blow biometric and implemented ultrasound and Doppler-shift analysis for liveness detection. The work led to two papers at ESORICS: BlowPrint (2025) and BlowLive (2026).

Before that I was a Technology Analyst at Deloitte Consulting Indonesia, where I developed Java Spring Boot microservices for an internal resource management system and explored GenAI applications with the LangChain framework.

I enjoy problem solving and competitive programming, and this portfolio is a learning project: a Spring Boot and Next.js application built end to end with the architecture, testing and tooling a professional team would use.',
    updated_at = now()
WHERE slug = 'default';

UPDATE projects
SET summary = 'Blow-based multi-factor biometric authentication for smartphones, combining blow acoustics with face recognition (ESORICS 2025). 99.82% accuracy for the combined factors.',
    description = 'An Android app that records a short blow through the microphone and a face image through the front camera. The blow audio is reduced to a smoothed intensity signal and compared using dynamic time warping (DTW), while faces are compared using embeddings from a pre-trained FaceNet model. The two similarity scores are normalized and combined by a weighted sum, and a k-nearest-neighbour rule makes the decision. No neural network was trained for this paper. Data was collected from 50 participants, each giving 10 sessions (5 sitting and 5 standing). Reported accuracy: 99.35% for blow acoustics alone, 99.96% for the face alone, and 99.82% for the combined approach. Paper: "BlowPrint: Blow-Based Multi-factor Biometrics for Smartphone User Authentication" (ESORICS 2025).',
    updated_at = now()
WHERE slug = 'blowprint'
  AND profile_id = (SELECT id FROM profiles WHERE slug = 'default');

UPDATE projects
SET summary = 'Blow-based multi-factor biometrics with liveness detection and revocability (ESORICS 2026). 99.46% liveness-detection accuracy on live versus replayed blows.',
    description = 'Extends the blow-and-face approach with liveness detection and revocability. A 1D CNN trained with triplet loss turns gammatone-based audio features of the blow into a 128-dimensional embedding, and a fine-tuned FaceNet model provides the face embedding. A fuzzy extractor with error-correcting codes derives a stable cryptographic key from the noisy biometric, so the key can be revoked by issuing new helper data. For liveness, the Android app plays a near-inaudible 20 kHz tone while the user blows and records the reflection; the Doppler shift caused by the airflow is used to tell a live blow from a replayed one. Data was collected from a new group of 50 participants, separate from the BlowPrint group, including the ultrasound recordings used for liveness. Reported results: 99.56% authentication accuracy for blow acoustics, 100% for the face and for fusion, and 99.46% liveness-detection accuracy. Paper: "BlowLive: Blow-Based Multi-Factor Biometrics with Liveness Detection and Revocability" (ESORICS 2026).',
    updated_at = now()
WHERE slug = 'blowlive'
  AND profile_id = (SELECT id FROM profiles WHERE slug = 'default');

DELETE FROM project_tech_stack
WHERE project_id IN (
    SELECT id FROM projects
    WHERE slug IN ('blowprint', 'blowlive')
      AND profile_id = (SELECT id FROM profiles WHERE slug = 'default'));

INSERT INTO project_tech_stack (project_id, tech)
SELECT pr.id, t.tech
FROM projects pr
JOIN (VALUES
         ('blowprint', 'Android'),
         ('blowprint', 'DTW'),
         ('blowprint', 'FaceNet'),
         ('blowprint', 'kNN'),
         ('blowprint', 'Python'),
         ('blowprint', 'R'),
         ('blowlive', 'Android'),
         ('blowlive', 'PyTorch'),
         ('blowlive', 'CNN'),
         ('blowlive', 'Triplet loss'),
         ('blowlive', 'FaceNet'),
         ('blowlive', 'Fuzzy extractor'),
         ('blowlive', 'Doppler analysis'),
         ('blowlive', 'Ultrasound')
     ) AS t (slug, tech) ON t.slug = pr.slug
WHERE pr.profile_id = (SELECT id FROM profiles WHERE slug = 'default');
