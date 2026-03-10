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
    private UUID createdBy;
    private Instant createdAt;

    public ProjectResponse(UUID id, UUID tenantId, String name, String key, String description,
                           String status, UUID createdBy, Instant createdAt) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.key = key;
        this.description = description;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
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

    public UUID getCreatedBy() {
        return createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}