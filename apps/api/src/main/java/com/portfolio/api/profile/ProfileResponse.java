package com.portfolio.api.profile;

public record ProfileResponse(
        String name, String title, String tagline, String bio, String githubUrl) {

    static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getName(),
                profile.getTitle(),
                profile.getTagline(),
                profile.getBio(),
                profile.getGithubUrl());
    }
}