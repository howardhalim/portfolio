package com.portfolio.api.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.portfolio.api.blog.BlogPostAdminController;
import com.portfolio.api.project.ProjectController;
import com.portfolio.api.project.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = {
            AdminAuthController.class,
            BlogPostAdminController.class,
            ProjectController.class
        })
@Import(SecurityConfig.class)
@TestPropertySource(properties = {"app.profile.slug=default"})
class AdminDisabledTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private ProjectService projectService;

    @Test
    void publicEndpointsStillWorkWithoutAnyAdminConfiguration() throws Exception {
        mockMvc.perform(get("/api/projects")).andExpect(status().isOk());
    }

    @Test
    void loginDoesNotExistWhenAdminIsDisabled() throws Exception {
        mockMvc.perform(
                        post("/api/admin/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"username\":\"admin\",\"password\":\"anything\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpointsAreDeniedWhenAdminIsDisabled() throws Exception {
        mockMvc.perform(get("/api/admin/blog-posts")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/admin/me")).andExpect(status().isUnauthorized());
    }
}
