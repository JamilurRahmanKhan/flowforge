package com.flowforge.project.dto;

import java.time.Instant;
import java.util.UUID;

public class ProjectResponse {

    private UUID id;
    private UUID tenantId;
    private String name;
    private String key;
    private String description;
    private String status;
    private String visibility;
    private String defaultWorkflow;
    private UUID createdBy;
    private Instant createdAt;
    private Instant updatedAt;
    private long memberCount;
    private long openTaskCount;
    private int progress;
    private boolean canManageProject;
    private boolean canCreateTask;
    private boolean canManageMembers;

    public ProjectResponse(
            UUID id,
            UUID tenantId,
            String name,
            String key,
            String description,
            String status,
            String visibility,
            String defaultWorkflow,
            UUID createdBy,
            Instant createdAt,
            Instant updatedAt,
            long memberCount,
            long openTaskCount,
            int progress,
            boolean canManageProject,
            boolean canCreateTask,
            boolean canManageMembers
    ) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.key = key;
        this.description = description;
        this.status = status;
        this.visibility = visibility;
        this.defaultWorkflow = defaultWorkflow;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.memberCount = memberCount;
        this.openTaskCount = openTaskCount;
        this.progress = progress;
        this.canManageProject = canManageProject;
        this.canCreateTask = canCreateTask;
        this.canManageMembers = canManageMembers;
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

    public String getKey() {
        return key;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public String getVisibility() {
        return visibility;
    }

    public String getDefaultWorkflow() {
        return defaultWorkflow;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public long getMemberCount() {
        return memberCount;
    }

    public long getOpenTaskCount() {
        return openTaskCount;
    }

    public int getProgress() {
        return progress;
    }

    public boolean isCanManageProject() {
        return canManageProject;
    }

    public boolean isCanCreateTask() {
        return canCreateTask;
    }

    public boolean isCanManageMembers() {
        return canManageMembers;
    }
}