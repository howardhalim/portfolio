package com.portfolio.api.blog;

import java.time.Instant;

public record BlogPostAdminResponse(
        Long id,
        String slug,
        String title,
        String summary,
        String content,
        boolean published,
        Instant publishedAt,
        Instant createdAt,
        Instant updatedAt) {

    static BlogPostAdminResponse from(BlogPost post) {
        return new BlogPostAdminResponse(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getSummary(),
                post.getContent(),
                post.isPublished(),
                post.getPublishedAt(),
                post.getCreatedAt(),
                post.getUpdatedAt());
    }
}