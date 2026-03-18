package com.flowforge.user.dto;

import java.time.Instant;
import java.util.UUID;

public class CurrentUserResponse {

    private UUID id;
    private UUID tenantId;
    private String name;
    private String email;
    private String role;
    private boolean active;
    private Instant createdAt;

    public CurrentUserResponse() {
    }

    public CurrentUserResponse(
            UUID id,
            UUID tenantId,
            String name,
            String email,
            String role,
            boolean active,
            Instant createdAt
    ) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}