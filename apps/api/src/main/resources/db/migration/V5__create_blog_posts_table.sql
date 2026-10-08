CREATE TABLE blog_posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id BIGINT NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (profile_id, slug)
);

INSERT INTO blog_posts (profile_id, slug, title, summary, content, published_at)
SELECT id,
       'hello-world',
       'Hello, world',
       'Why I built this portfolio and what I plan to write about here.',
       'This site is a learning project. I am building it the way a professional team would, with a layered API, database migrations, and automated checks.

I will use this blog to write down what I learn along the way, including the mistakes.',
       now()
FROM profiles
WHERE slug = 'default';

INSERT INTO blog_posts (profile_id, slug, title, summary, content, published_at)
SELECT id,
       'draft-post',
       'A draft that should stay hidden',
       'This post has no publish date, so the API must not return it.',
       'If you can read this on the website, the draft filtering is broken.',
       NULL
FROM profiles
WHERE slug = 'default';