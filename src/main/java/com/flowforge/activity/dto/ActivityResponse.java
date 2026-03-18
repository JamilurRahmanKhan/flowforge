package com.flowforge.activity.dto;

import java.time.Instant;
import java.util.UUID;

public class ActivityResponse {

    private String type;
    private String title;
    private String description;
    private Instant createdAt;

    private UUID projectId;
    private String projectName;

    private UUID taskId;
    private String taskTitle;

    private UUID userId;
    private String userName;

    public ActivityResponse() {
    }

    public ActivityResponse(
            String type,
            String title,
            String description,
            Instant createdAt,
            UUID projectId,
            String projectName,
            UUID taskId,
            String taskTitle,
            UUID userId,
            String userName
    ) {
        this.type = type;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.projectId = projectId;
        this.projectName = projectName;
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.userId = userId;
        this.userName = userName;
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

    public String getTaskTitle() {
        return taskTitle;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }
}