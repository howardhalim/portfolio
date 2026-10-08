package com.portfolio.api.blog;

import java.time.Instant;

public record BlogPostResponse(
        String slug, String title, String summary, String content, Instant publishedAt) {

    static BlogPostResponse from(BlogPost post) {
        return new BlogPostResponse(
                post.getSlug(),
                post.getTitle(),
                post.getSummary(),
                post.getContent(),
                post.getPublishedAt());
    }
}