package com.portfolio.api.blog;

import java.time.Instant;

public record BlogPostSummaryResponse(
        String slug, String title, String summary, Instant publishedAt) {

    static BlogPostSummaryResponse from(BlogPost post) {
        return new BlogPostSummaryResponse(
                post.getSlug(), post.getTitle(), post.getSummary(), post.getPublishedAt());
    }
}