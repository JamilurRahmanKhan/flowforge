package com.flowforge.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private UUID tenantId;
    private String name;
    private String email;
    private String role;
    private boolean active;
    private Instant createdAt;
}