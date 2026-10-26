package com.portfolio.api.security;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import com.portfolio.api.project.ProjectController;
import com.portfolio.api.project.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@WebMvcTest(controllers = {AdminAuthController.class, ProjectController.class})
@Import({SecurityConfig.class, AdminAuthService.class, TokenService.class})
@EnableConfigurationProperties(AdminProperties.class)
@TestPropertySource(
        properties = {
            "app.admin.username=admin",
            "app.admin.jwt-secret=test-secret-test-secret-test-secret-123456",
            "app.profile.slug=default"
        })
class SecurityRulesTest {

    private static final String PASSWORD = "test-password";

    @DynamicPropertySource
    static void adminPasswordHash(DynamicPropertyRegistry registry) {
        registry.add("app.admin.password-hash", () -> new BCryptPasswordEncoder().encode(PASSWORD));
    }

    @Autowired private MockMvc mockMvc;

    @MockBean private ProjectService projectService;

    @Test
    void publicEndpointsStayOpen() throws Exception {
        mockMvc.perform(get("/api/projects")).andExpect(status().isOk());
    }

    @Test
    void endpointsThatWereNeverOpenedAreDenied() throws Exception {
        mockMvc.perform(get("/api/not-listed")).andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpointsRequireAToken() throws Exception {
        mockMvc.perform(get("/api/admin/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void aGarbageTokenIsRejected() throws Exception {
        mockMvc.perform(get("/api/admin/me").header("Authorization", "Bearer abc.def.ghi"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginWithTheCorrectPasswordReturnsAToken() throws Exception {
        mockMvc.perform(loginRequest("admin", PASSWORD))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void loginWithTheWrongPasswordIsRejected() throws Exception {
        mockMvc.perform(loginRequest("admin", "wrong-password"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginWithTheWrongUsernameGivesTheSameAnswer() throws Exception {
        mockMvc.perform(loginRequest("nobody", PASSWORD)).andExpect(status().isUnauthorized());
    }

    @Test
    void aTokenFromLoginOpensAdminEndpoints() throws Exception {
        String body =
                mockMvc.perform(loginRequest("admin", PASSWORD))
                        .andReturn()
                        .getResponse()
                        .getContentAsString();
        String token = JsonPath.read(body, "$.token");

        mockMvc.perform(get("/api/admin/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"));
    }

    @Test
    void aLoggedInUserWithoutTheAdminRoleIsForbidden() throws Exception {
        mockMvc.perform(
                        get("/api/admin/me")
                                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isForbidden());
    }

    private static org.springframework.test.web.servlet.RequestBuilder loginRequest(
            String username, String password) {
        String json = "{\"username\":\"%s\",\"password\":\"%s\"}".formatted(username, password);
        return post("/api/admin/login").contentType(MediaType.APPLICATION_JSON).content(json);
    }
}