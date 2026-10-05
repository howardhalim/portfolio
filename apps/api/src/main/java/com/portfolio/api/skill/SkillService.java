package com.portfolio.api.skill;

import com.portfolio.api.profile.ProfileProperties;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SkillService {

    private final SkillRepository skillRepository;
    private final ProfileProperties profileProperties;

    public SkillService(SkillRepository skillRepository, ProfileProperties profileProperties) {
        this.skillRepository = skillRepository;
        this.profileProperties = profileProperties;
    }

    public List<SkillResponse> getSkills() {
        return skillRepository.findByProfileSlugOrderByDisplayOrderAsc(profileProperties.slug())
                .stream()
                .map(SkillResponse::from)
                .toList();
    }
}