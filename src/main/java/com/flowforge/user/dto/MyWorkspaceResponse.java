package com.flowforge.user.dto;

import java.time.Instant;
import java.util.UUID;

public class MyWorkspaceResponse {

    private UUID tenantId;
    private String workspaceName;
    private String workspaceSlug;
    private String role;
    private Instant joinedAt;

    public MyWorkspaceResponse() {
    }

    public MyWorkspaceResponse(
            UUID tenantId,
            String workspaceName,
            String workspaceSlug,
            String role,
            Instant joinedAt
    ) {
        this.tenantId = tenantId;
        this.workspaceName = workspaceName;
        this.workspaceSlug = workspaceSlug;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public String getWorkspaceSlug() {
        return workspaceSlug;
    }

    public String getRole() {
        return role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public void setWorkspaceSlug(String workspaceSlug) {
        this.workspaceSlug = workspaceSlug;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }
}