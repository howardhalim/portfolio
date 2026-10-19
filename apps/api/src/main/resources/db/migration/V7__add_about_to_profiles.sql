ALTER TABLE profiles ADD COLUMN about TEXT NOT NULL DEFAULT '';

UPDATE profiles
SET about = 'I graduated from the Singapore University of Technology and Design (SUTD) in 2024.

My work spans software and application development, and building experimental evaluation pipelines. That covers the whole flow, from data collection and cleaning through processing to the final results.

I use machine learning frameworks and large language models (LLMs) to build proof-of-concept (PoC) implementations for research papers. My security-focused work includes Android and biometrics, especially blow-based biometric authentication systems.

I also enjoy problem-solving challenges in competitive programming.

This portfolio is a learning project in itself: I built it end to end to practice the architecture, testing and tooling that professional teams use.'
WHERE slug = 'default';