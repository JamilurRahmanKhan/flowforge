package com.flowforge.user.dto;

import java.time.Instant;
import java.util.UUID;

public class UserResponse {

    private UUID id;
    private UUID tenantId;
    private String name;
    private String email;
    private String role;
    private boolean active;
    private Instant createdAt;

    public UserResponse() {
    }

    public UserResponse(
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

    public static Builder builder() {
        return new Builder();
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

    public static class Builder {
        private UUID id;
        private UUID tenantId;
        private String name;
        private String email;
        private String role;
        private boolean active;
        private Instant createdAt;

        public Builder id(UUID id) {
            this.id = id;
            return this;
        }

        public Builder tenantId(UUID tenantId) {
            this.tenantId = tenantId;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder active(boolean active) {
            this.active = active;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserResponse build() {
            return new UserResponse(id, tenantId, name, email, role, active, createdAt);
        }
    }
}