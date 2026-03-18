package com.flowforge.user.dto;

import java.time.Instant;
import java.util.UUID;

public class WorkspaceUserResponse {

    private UUID id;
    private UUID tenantId;
    private String name;
    private String email;
    private String role;
    private boolean active;
    private Instant createdAt;
    private long assignedProjectsCount;
    private long assignedTasksCount;

    public WorkspaceUserResponse() {
    }

    public WorkspaceUserResponse(
            UUID id,
            UUID tenantId,
            String name,
            String email,
            String role,
            boolean active,
            Instant createdAt,
            long assignedProjectsCount,
            long assignedTasksCount
    ) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
        this.assignedProjectsCount = assignedProjectsCount;
        this.assignedTasksCount = assignedTasksCount;
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

    public long getAssignedProjectsCount() {
        return assignedProjectsCount;
    }

    public long getAssignedTasksCount() {
        return assignedTasksCount;
    }
}