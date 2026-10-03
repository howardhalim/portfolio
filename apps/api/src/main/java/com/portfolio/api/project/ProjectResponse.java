package com.portfolio.api.project;

import java.time.Instant;
import java.util.List;

public record ProjectResponse(
        Long id,
        String slug,
        String title,
        String summary,
        String description,
        List<String> techStack,
        String repoUrl,
        String liveUrl,
        String imageUrl,
        Instant createdAt,
        Instant updatedAt) {

    static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getSlug(),
                project.getTitle(),
                project.getSummary(),
                project.getDescription(),
                project.getTechStack(),
                project.getRepoUrl(),
                project.getLiveUrl(),
                project.getImageUrl(),
                project.getCreatedAt(),
                project.getUpdatedAt());
    }
}
