package com.flowforge.projectmember.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class ProjectMemberResponse {
    private UUID id;
    private UUID userId;
    private String name;
    private String email;
    private String role;
    private boolean active;
    private Instant joinedAt;
}