package com.portfolio.api.security;

import com.portfolio.api.common.ConditionalOnAdminEnabled;
import java.time.Instant;
import java.util.List;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@ConditionalOnAdminEnabled
@Service
public class TokenService {

    private final JwtEncoder jwtEncoder;
    private final AdminProperties properties;

    public TokenService(JwtEncoder jwtEncoder, AdminProperties properties) {
        this.jwtEncoder = jwtEncoder;
        this.properties = properties;
    }

    public LoginResponse issueToken(String username) {
        Instant now = Instant.now();

        JwtClaimsSet claims =
                JwtClaimsSet.builder()
                        .issuer("portfolio-api")
                        .subject(username)
                        .issuedAt(now)
                        .expiresAt(now.plus(properties.tokenTtl()))
                        .claim("roles", List.of("ADMIN"))
                        .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();

        return new LoginResponse(token, properties.tokenTtl().toSeconds());
    }
}