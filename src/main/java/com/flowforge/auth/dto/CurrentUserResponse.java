package com.flowforge.auth.dto;


import java.util.UUID;


public class CurrentUserResponse {


    private UUID userId;
    private UUID tenantId;
    private String email;
    private String role;


    public CurrentUserResponse(UUID userId, UUID tenantId, String email, String role) {
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

