package com.flowforge.comment.dto;

import java.time.Instant;
import java.util.UUID;

public class CommentResponse {

    private UUID id;
    private UUID tenantId;
    private UUID taskId;
    private UUID authorId;
    private String content;
    private Instant createdAt;

    public CommentResponse(UUID id, UUID tenantId, UUID taskId, UUID authorId, String content, Instant createdAt) {
        this.id = id;
        this.tenantId = tenantId;
        this.taskId = taskId;
        this.authorId = authorId;
        this.content = content;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public UUID getAuthorId() {
        return authorId;
    }

    public String getContent() {
        return content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}