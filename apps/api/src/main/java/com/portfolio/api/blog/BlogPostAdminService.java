package com.portfolio.api.blog;

import com.portfolio.api.profile.Profile;
import com.portfolio.api.profile.ProfileNotFoundException;
import com.portfolio.api.profile.ProfileProperties;
import com.portfolio.api.profile.ProfileRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BlogPostAdminService {

    private final BlogPostRepository blogPostRepository;
    private final ProfileRepository profileRepository;
    private final ProfileProperties profileProperties;

    public BlogPostAdminService(
            BlogPostRepository blogPostRepository,
            ProfileRepository profileRepository,
            ProfileProperties profileProperties) {
        this.blogPostRepository = blogPostRepository;
        this.profileRepository = profileRepository;
        this.profileProperties = profileProperties;
    }

    @Transactional(readOnly = true)
    public List<BlogPostAdminResponse> list() {
        return blogPostRepository.findByProfileSlugOrderByCreatedAtDesc(profileProperties.slug())
                .stream()
                .map(BlogPostAdminResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BlogPostAdminResponse get(Long id) {
        return BlogPostAdminResponse.from(find(id));
    }

    @Transactional
    public BlogPostAdminResponse create(BlogPostAdminRequest request) {
        String profileSlug = profileProperties.slug();

        if (blogPostRepository.existsByProfileSlugAndSlug(profileSlug, request.slug())) {
            throw new SlugAlreadyExistsException(request.slug());
        }

        Profile profile =
                profileRepository
                        .findBySlug(profileSlug)
                        .orElseThrow(() -> new ProfileNotFoundException(profileSlug));

        BlogPost post =
                new BlogPost(
                        profile,
                        request.slug(),
                        request.title().strip(),
                        request.summary().strip(),
                        request.content().strip());
        applyPublication(post, request.published());

        return BlogPostAdminResponse.from(blogPostRepository.save(post));
    }

    @Transactional
    public BlogPostAdminResponse update(Long id, BlogPostAdminRequest request) {
        BlogPost post = find(id);

        if (blogPostRepository.existsByProfileSlugAndSlugAndIdNot(
                profileProperties.slug(), request.slug(), id)) {
            throw new SlugAlreadyExistsException(request.slug());
        }

        post.update(
                request.slug(),
                request.title().strip(),
                request.summary().strip(),
                request.content().strip());
        applyPublication(post, request.published());

        return BlogPostAdminResponse.from(blogPostRepository.saveAndFlush(post));
    }

    @Transactional
    public void delete(Long id) {
        blogPostRepository.delete(find(id));
    }

    private BlogPost find(Long id) {
        return blogPostRepository
                .findByIdAndProfileSlug(id, profileProperties.slug())
                .orElseThrow(() -> new BlogPostNotFoundException(id));
    }

    private void applyPublication(BlogPost post, boolean published) {
        if (published) {
            post.publish(Instant.now());
        } else {
            post.unpublish();
        }
    }
}