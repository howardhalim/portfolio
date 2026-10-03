package com.portfolio.api.profile;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.profile")
public record ProfileProperties(String slug) {}