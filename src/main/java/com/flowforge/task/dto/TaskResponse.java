package com.flowforge.task.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class TaskResponse {

    private UUID id;
    private UUID tenantId;
    private UUID projectId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private UUID createdBy;
    private Instant createdAt;
    private UUID assigneeId;

    public TaskResponse(UUID id, UUID tenantId, UUID projectId, String title, String description,
                        String status, String priority, LocalDate dueDate, UUID createdBy,
                        Instant createdAt, UUID assigneeId) {
        this.id = id;
        this.tenantId = tenantId;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.assigneeId = assigneeId;
    }

    public UUID getId() {
        return id;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public String getPriority() {
        return priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }
}