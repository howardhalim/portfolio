package com.portfolio.api.blog;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/blog-posts")
public class BlogPostAdminController {

    private final BlogPostAdminService blogPostAdminService;

    public BlogPostAdminController(BlogPostAdminService blogPostAdminService) {
        this.blogPostAdminService = blogPostAdminService;
    }

    @GetMapping
    public List<BlogPostAdminResponse> list() {
        return blogPostAdminService.list();
    }

    @GetMapping("/{id}")
    public BlogPostAdminResponse get(@PathVariable Long id) {
        return blogPostAdminService.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlogPostAdminResponse create(@Valid @RequestBody BlogPostAdminRequest request) {
        return blogPostAdminService.create(request);
    }

    @PutMapping("/{id}")
    public BlogPostAdminResponse update(
            @PathVariable Long id, @Valid @RequestBody BlogPostAdminRequest request) {
        return blogPostAdminService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        blogPostAdminService.delete(id);
    }
}