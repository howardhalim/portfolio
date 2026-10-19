package com.portfolio.api.profile;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileLinkRepository profileLinkRepository;
    private final ProfileProperties profileProperties;

    public ProfileService(
            ProfileRepository profileRepository,
            ProfileLinkRepository profileLinkRepository,
            ProfileProperties profileProperties) {
        this.profileRepository = profileRepository;
        this.profileLinkRepository = profileLinkRepository;
        this.profileProperties = profileProperties;
    }

    public ProfileResponse getActiveProfile() {
        String slug = profileProperties.slug();
        Profile profile =
                profileRepository.findBySlug(slug).orElseThrow(() -> new ProfileNotFoundException(slug));
        List<ProfileLink> links = profileLinkRepository.findByProfileSlugOrderByDisplayOrderAsc(slug);
        return ProfileResponse.from(profile, links);
    }
}