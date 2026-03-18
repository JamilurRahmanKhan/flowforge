package com.flowforge.user.dto;

import java.util.UUID;

public record CurrentUserResponse(
        UUID id,
        UUID tenantId,
        String name,
        String email,
        String role,
        boolean active
) {
}