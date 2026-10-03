package com.portfolio.api.project;

import com.portfolio.api.profile.ProfileProperties;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProfileProperties profileProperties;

    public ProjectService(
            ProjectRepository projectRepository, ProfileProperties profileProperties) {
        this.projectRepository = projectRepository;
        this.profileProperties = profileProperties;
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findByProfileSlug(profileProperties.slug()).stream()
                .map(ProjectResponse::from)
                .toList();
    }

    public ProjectResponse getProjectBySlug(String slug) {
        return projectRepository
                .findBySlugAndProfileSlug(slug, profileProperties.slug())
                .map(ProjectResponse::from)
                .orElseThrow(() -> new ProjectNotFoundException(slug));
    }
}