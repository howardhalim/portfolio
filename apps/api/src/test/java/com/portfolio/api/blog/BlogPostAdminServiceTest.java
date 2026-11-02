package com.portfolio.api.blog;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.portfolio.api.profile.Profile;
import com.portfolio.api.profile.ProfileProperties;
import com.portfolio.api.profile.ProfileRepository;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BlogPostAdminServiceTest {

    @Mock private BlogPostRepository blogPostRepository;
    @Mock private ProfileRepository profileRepository;

    private BlogPostAdminService service;

    @BeforeEach
    void setUp() {
        service =
                new BlogPostAdminService(
                        blogPostRepository, profileRepository, new ProfileProperties("default"));
    }

    @Test
    void createsADraftWithoutAPublishDate() {
        when(blogPostRepository.existsByProfileSlugAndSlug("default", "my-post")).thenReturn(false);
        when(profileRepository.findBySlug("default")).thenReturn(Optional.of(mock(Profile.class)));
        when(blogPostRepository.save(any(BlogPost.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        BlogPostAdminResponse response = service.create(request("my-post", false));

        assertThat(response.published()).isFalse();
        assertThat(response.publishedAt()).isNull();
    }

    @Test
    void createsAPublishedPostWithAPublishDate() {
        when(blogPostRepository.existsByProfileSlugAndSlug("default", "my-post")).thenReturn(false);
        when(profileRepository.findBySlug("default")).thenReturn(Optional.of(mock(Profile.class)));
        when(blogPostRepository.save(any(BlogPost.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        BlogPostAdminResponse response = service.create(request("my-post", true));

        assertThat(response.published()).isTrue();
        assertThat(response.publishedAt()).isNotNull();
    }

    @Test
    void refusesToCreateAPostWithATakenSlug() {
        when(blogPostRepository.existsByProfileSlugAndSlug("default", "taken")).thenReturn(true);

        assertThatThrownBy(() -> service.create(request("taken", false)))
                .isInstanceOf(SlugAlreadyExistsException.class);

        verify(blogPostRepository, never()).save(any(BlogPost.class));
    }

    @Test
    void updatingAPublishedPostKeepsItsOriginalPublishDate() {
        Instant firstPublished = Instant.parse("2026-01-01T00:00:00Z");
        BlogPost post = existingPost();
        post.publish(firstPublished);
        when(blogPostRepository.findByIdAndProfileSlug(1L, "default")).thenReturn(Optional.of(post));
        when(blogPostRepository.existsByProfileSlugAndSlugAndIdNot("default", "my-post", 1L))
                .thenReturn(false);
        when(blogPostRepository.saveAndFlush(post)).thenReturn(post);

        BlogPostAdminResponse response = service.update(1L, request("my-post", true));

        assertThat(response.publishedAt()).isEqualTo(firstPublished);
    }

    @Test
    void unpublishingClearsThePublishDate() {
        BlogPost post = existingPost();
        post.publish(Instant.parse("2026-01-01T00:00:00Z"));
        when(blogPostRepository.findByIdAndProfileSlug(1L, "default")).thenReturn(Optional.of(post));
        when(blogPostRepository.existsByProfileSlugAndSlugAndIdNot("default", "my-post", 1L))
                .thenReturn(false);
        when(blogPostRepository.saveAndFlush(post)).thenReturn(post);

        BlogPostAdminResponse response = service.update(1L, request("my-post", false));

        assertThat(response.published()).isFalse();
        assertThat(response.publishedAt()).isNull();
    }

    @Test
    void refusesToRenameAPostToASlugUsedByAnotherPost() {
        BlogPost post = existingPost();
        when(blogPostRepository.findByIdAndProfileSlug(1L, "default")).thenReturn(Optional.of(post));
        when(blogPostRepository.existsByProfileSlugAndSlugAndIdNot("default", "other-post", 1L))
                .thenReturn(true);

        assertThatThrownBy(() -> service.update(1L, request("other-post", false)))
                .isInstanceOf(SlugAlreadyExistsException.class);

        verify(blogPostRepository, never()).saveAndFlush(any(BlogPost.class));
    }

    @Test
    void updatingAMissingPostIsNotFound() {
        when(blogPostRepository.findByIdAndProfileSlug(99L, "default")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(99L, request("my-post", false)))
                .isInstanceOf(BlogPostNotFoundException.class);
    }

    @Test
    void deletesAnExistingPost() {
        BlogPost post = existingPost();
        when(blogPostRepository.findByIdAndProfileSlug(1L, "default")).thenReturn(Optional.of(post));

        service.delete(1L);

        verify(blogPostRepository).delete(post);
    }

    private static BlogPost existingPost() {
        return new BlogPost(mock(Profile.class), "my-post", "A title", "A summary", "Some content");
    }

    private static BlogPostAdminRequest request(String slug, boolean published) {
        return new BlogPostAdminRequest(slug, "A title", "A summary", "Some content", published);
    }
}