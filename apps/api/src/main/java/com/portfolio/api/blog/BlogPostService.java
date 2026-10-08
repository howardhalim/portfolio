package com.portfolio.api.blog;

import com.portfolio.api.profile.ProfileProperties;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final ProfileProperties profileProperties;

    public BlogPostService(
            BlogPostRepository blogPostRepository, ProfileProperties profileProperties) {
        this.blogPostRepository = blogPostRepository;
        this.profileProperties = profileProperties;
    }

    public List<BlogPostSummaryResponse> getPublishedPosts() {
        return blogPostRepository.findPublished(profileProperties.slug(), Instant.now()).stream()
                .map(BlogPostSummaryResponse::from)
                .toList();
    }

    public BlogPostResponse getPublishedPost(String slug) {
        return blogPostRepository
                .findPublishedBySlug(slug, profileProperties.slug(), Instant.now())
                .map(BlogPostResponse::from)
                .orElseThrow(() -> new BlogPostNotFoundException(slug));
    }
}