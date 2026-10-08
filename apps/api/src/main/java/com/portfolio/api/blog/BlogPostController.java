package com.portfolio.api.blog;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blog-posts")
public class BlogPostController {

    private final BlogPostService blogPostService;

    public BlogPostController(BlogPostService blogPostService) {
        this.blogPostService = blogPostService;
    }

    @GetMapping
    public List<BlogPostSummaryResponse> getPosts() {
        return blogPostService.getPublishedPosts();
    }

    @GetMapping("/{slug}")
    public BlogPostResponse getPost(@PathVariable String slug) {
        return blogPostService.getPublishedPost(slug);
    }
}