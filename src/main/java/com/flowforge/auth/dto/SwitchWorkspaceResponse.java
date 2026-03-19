package com.flowforge.auth.dto;

import java.util.UUID;

public class SwitchWorkspaceResponse {

    private String accessToken;
    private String tokenType;
    private UUID userId;
    private UUID tenantId;
    private String email;
    private String role;
    private String workspaceSlug;
    private String workspaceName;

    public SwitchWorkspaceResponse() {
    }

    public SwitchWorkspaceResponse(
            String accessToken,
            String tokenType,
            UUID userId,
            UUID tenantId,
            String email,
            String role,
            String workspaceSlug,
            String workspaceName
    ) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.userId = userId;
        this.tenantId = tenantId;
        this.email = email;
        this.role = role;
        this.workspaceSlug = workspaceSlug;
        this.workspaceName = workspaceName;
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

    public String getWorkspaceSlug() {
        return workspaceSlug;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setWorkspaceSlug(String workspaceSlug) {
        this.workspaceSlug = workspaceSlug;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }
}