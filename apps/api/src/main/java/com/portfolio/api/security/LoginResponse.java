package com.portfolio.api.security;

public record LoginResponse(String token, long expiresInSeconds) {}