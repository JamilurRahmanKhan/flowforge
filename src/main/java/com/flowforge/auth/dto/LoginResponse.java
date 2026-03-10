package com.flowforge.auth.dto;

import java.util.UUID;

public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private UUID userId;
    private UUID tenantId;
    private String email;
    private String role;

    public LoginResponse(String accessToken, String tokenType, UUID userId, UUID tenantId, String email, String role) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.userId = userId;
        this.tenantId = tenantId;
        this.email = email;
        this.role = role;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}