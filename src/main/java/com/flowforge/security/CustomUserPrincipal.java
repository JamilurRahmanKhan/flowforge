package com.flowforge.security;

import java.util.UUID;

public class CustomUserPrincipal {

    private final UUID userId;
    private final UUID tenantId;
    private final String email;
    private final String role;

    public CustomUserPrincipal(UUID userId, UUID tenantId, String email, String role) {
        this.userId = userId;
        this.tenantId = tenantId;
        this.email = email;
        this.role = role;
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