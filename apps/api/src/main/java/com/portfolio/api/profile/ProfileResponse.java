package com.portfolio.api.profile;

import java.util.List;

public record ProfileResponse(
        String name,
        String title,
        String tagline,
        String bio,
        String about,
        String githubUrl,
        List<ProfileLinkResponse> links) {

    static ProfileResponse from(Profile profile, List<ProfileLink> links) {
        return new ProfileResponse(
                profile.getName(),
                profile.getTitle(),
                profile.getTagline(),
                profile.getBio(),
                profile.getAbout(),
                profile.getGithubUrl(),
                links.stream().map(ProfileLinkResponse::from).toList());
    }
}