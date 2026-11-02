package com.portfolio.api.blog;

public class SlugAlreadyExistsException extends RuntimeException {

    public SlugAlreadyExistsException(String slug) {
        super("A blog post with the slug '" + slug + "' already exists");
    }
}