package com.flowforge.user.dto;

import java.time.Instant;
import java.util.UUID;

public record WorkspaceUserResponse(
        UUID id,
        UUID tenantId,
        String name,
        String email,
        String role,
        boolean active,
        Instant createdAt
) {
}