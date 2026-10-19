package com.portfolio.api.profile;

public record ProfileLinkResponse(String label, String url) {

    static ProfileLinkResponse from(ProfileLink link) {
        return new ProfileLinkResponse(link.getLabel(), link.getUrl());
    }
}