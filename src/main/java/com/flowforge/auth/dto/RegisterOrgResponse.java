package com.flowforge.auth.dto;

import java.util.UUID;

public class RegisterOrgResponse {

    private UUID organizationId;
    private String organizationName;
    private String slug;
    private UUID ownerUserId;
    private String ownerEmail;
    private String message;

    public RegisterOrgResponse(UUID organizationId, String organizationName, String slug,
                               UUID ownerUserId, String ownerEmail, String message) {
        this.organizationId = organizationId;
        this.organizationName = organizationName;
        this.slug = slug;
        this.ownerUserId = ownerUserId;
        this.ownerEmail = ownerEmail;
        this.message = message;
    }

    public UUID getOrganizationId() {
        return organizationId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public String getSlug() {
        return slug;
    }

    public UUID getOwnerUserId() {
        return ownerUserId;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public String getMessage() {
        return message;
    }
}