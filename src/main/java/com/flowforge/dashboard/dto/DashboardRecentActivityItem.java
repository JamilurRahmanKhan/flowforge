package com.flowforge.dashboard.dto;

import java.time.Instant;
import java.util.UUID;

public class DashboardRecentActivityItem {

    private String type;
    private String title;
    private String description;
    private Instant createdAt;
    private UUID projectId;
    private String projectName;
    private UUID taskId;

    public DashboardRecentActivityItem() {
    }

    public DashboardRecentActivityItem(
            String type,
            String title,
            String description,
            Instant createdAt,
            UUID projectId,
            String projectName,
            UUID taskId
    ) {
        this.type = type;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.projectId = projectId;
        this.projectName = projectName;
        this.taskId = taskId;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public UUID getTaskId() {
        return taskId;
    }
}