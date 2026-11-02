package com.portfolio.api.blog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record BlogPostAdminRequest(
        @NotBlank(message = "Slug is required")
        @Size(max = 255, message = "Slug must be at most 255 characters")
        @Pattern(
                regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                message = "Slug may only contain lowercase letters, digits and single hyphens")
                String slug,
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must be at most 255 characters")
                String title,
        @NotBlank(message = "Summary is required")
        @Size(max = 1000, message = "Summary must be at most 1000 characters")
                String summary,
        @NotBlank(message = "Content is required")
        @Size(max = 50000, message = "Content must be at most 50000 characters")
                String content,
        boolean published) {}