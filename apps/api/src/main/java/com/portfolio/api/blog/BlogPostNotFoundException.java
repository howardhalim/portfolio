package com.portfolio.api.blog;

public class BlogPostNotFoundException extends RuntimeException {

    public BlogPostNotFoundException(String slug) {
        super("Blog post not found: " + slug);
    }

    public BlogPostNotFoundException(Long id) {
        super("Blog post not found: " + id);
    }
}