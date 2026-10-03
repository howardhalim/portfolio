package com.portfolio.api.profile;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileProperties profileProperties;

    public ProfileService(
            ProfileRepository profileRepository, ProfileProperties profileProperties) {
        this.profileRepository = profileRepository;
        this.profileProperties = profileProperties;
    }

    public ProfileResponse getActiveProfile() {
        String slug = profileProperties.slug();
        return profileRepository
                .findBySlug(slug)
                .map(ProfileResponse::from)
                .orElseThrow(() -> new ProfileNotFoundException(slug));
    }
}