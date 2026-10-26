package com.portfolio.api.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private final AdminProperties properties;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AdminAuthService(
            AdminProperties properties, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.properties = properties;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public LoginResponse login(LoginRequest request) {
        boolean usernameMatches =
                MessageDigest.isEqual(
                        request.username().getBytes(StandardCharsets.UTF_8),
                        properties.username().getBytes(StandardCharsets.UTF_8));
        boolean passwordMatches =
                passwordEncoder.matches(request.password(), properties.passwordHash());

        if (!usernameMatches || !passwordMatches) {
            throw new InvalidCredentialsException();
        }

        return tokenService.issueToken(properties.username());
    }
}