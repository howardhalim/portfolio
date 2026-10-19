package com.portfolio.api.profile;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileLinkRepository extends JpaRepository<ProfileLink, Long> {

    List<ProfileLink> findByProfileSlugOrderByDisplayOrderAsc(String profileSlug);
}