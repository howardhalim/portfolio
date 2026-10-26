package com.portfolio.api.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock private ProfileRepository profileRepository;
    @Mock private ProfileLinkRepository profileLinkRepository;

    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        profileService =
                new ProfileService(
                        profileRepository, profileLinkRepository, new ProfileProperties("default"));
    }

    @Test
    void returnsTheActiveProfileWithItsLinks() {
        Profile profile = mock(Profile.class);
        when(profile.getName()).thenReturn("Ada Lovelace");
        when(profile.getTitle()).thenReturn("Engineer");
        when(profile.getTagline()).thenReturn("A tagline");
        when(profile.getBio()).thenReturn("A bio");
        when(profile.getAbout()).thenReturn("About text");

        ProfileLink link = mock(ProfileLink.class);
        when(link.getLabel()).thenReturn("LeetCode");
        when(link.getUrl()).thenReturn("https://leetcode.com/u/example/");

        when(profileRepository.findBySlug("default")).thenReturn(Optional.of(profile));
        when(profileLinkRepository.findByProfileSlugOrderByDisplayOrderAsc("default"))
                .thenReturn(List.of(link));

        ProfileResponse response = profileService.getActiveProfile();

        assertThat(response.name()).isEqualTo("Ada Lovelace");
        assertThat(response.links())
                .containsExactly(
                        new ProfileLinkResponse("LeetCode", "https://leetcode.com/u/example/"));
    }

    @Test
    void throwsWhenTheConfiguredProfileDoesNotExist() {
        when(profileRepository.findBySlug("default")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.getActiveProfile())
                .isInstanceOf(ProfileNotFoundException.class)
                .hasMessageContaining("default");
    }
}