package com.portfolio.api.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app.admin")
public record AdminProperties(
        @NotBlank String username,
        @NotBlank String passwordHash,
        @NotBlank @Size(min = 32, message = "must be at least 32 characters") String jwtSecret,
        @DefaultValue("1h") Duration tokenTtl) {}