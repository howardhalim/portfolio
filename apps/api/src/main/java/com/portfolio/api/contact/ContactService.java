package com.portfolio.api.contact;

import com.portfolio.api.profile.Profile;
import com.portfolio.api.profile.ProfileNotFoundException;
import com.portfolio.api.profile.ProfileProperties;
import com.portfolio.api.profile.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final ProfileRepository profileRepository;
    private final ProfileProperties profileProperties;

    public ContactService(
            ContactMessageRepository contactMessageRepository,
            ProfileRepository profileRepository,
            ProfileProperties profileProperties) {
        this.contactMessageRepository = contactMessageRepository;
        this.profileRepository = profileRepository;
        this.profileProperties = profileProperties;
    }

    @Transactional
    public void submit(ContactRequest request) {
        String slug = profileProperties.slug();
        Profile profile =
                profileRepository.findBySlug(slug).orElseThrow(() -> new ProfileNotFoundException(slug));

        contactMessageRepository.save(
                new ContactMessage(
                        profile,
                        request.name().strip(),
                        request.email().strip(),
                        request.message().strip()));
    }
}