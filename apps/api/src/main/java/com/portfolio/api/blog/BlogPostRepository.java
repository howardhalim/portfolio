package com.portfolio.api.blog;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    @Query("""
            select p from BlogPost p
            where p.profile.slug = :profileSlug
              and p.publishedAt is not null
              and p.publishedAt <= :now
            order by p.publishedAt desc
            """)
    List<BlogPost> findPublished(
            @Param("profileSlug") String profileSlug, @Param("now") Instant now);

    @Query("""
            select p from BlogPost p
            where p.slug = :slug
              and p.profile.slug = :profileSlug
              and p.publishedAt is not null
              and p.publishedAt <= :now
            """)
    Optional<BlogPost> findPublishedBySlug(
            @Param("slug") String slug,
            @Param("profileSlug") String profileSlug,
            @Param("now") Instant now);

    List<BlogPost> findByProfileSlugOrderByCreatedAtDesc(String profileSlug);

    Optional<BlogPost> findByIdAndProfileSlug(Long id, String profileSlug);

    boolean existsByProfileSlugAndSlug(String profileSlug, String slug);

    boolean existsByProfileSlugAndSlugAndIdNot(String profileSlug, String slug, Long id);
}