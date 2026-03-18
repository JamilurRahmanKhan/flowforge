package com.flowforge.projectmember.dto;

import java.time.Instant;
import java.util.UUID;

public class ProjectMemberResponse {

    private UUID assignmentId;
    private UUID userId;
    private String name;
    private String email;
    private String role;
    private boolean active;
    private Instant joinedAt;

    public ProjectMemberResponse() {
    }

    public ProjectMemberResponse(
            UUID assignmentId,
            UUID userId,
            String name,
            String email,
            String role,
            boolean active,
            Instant joinedAt
    ) {
        this.assignmentId = assignmentId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.active = active;
        this.joinedAt = joinedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public UUID getAssignmentId() {
        return assignmentId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public static class Builder {
        private UUID assignmentId;
        private UUID userId;
        private String name;
        private String email;
        private String role;
        private boolean active;
        private Instant joinedAt;

        public Builder assignmentId(UUID assignmentId) {
            this.assignmentId = assignmentId;
            return this;
        }

        public Builder userId(UUID userId) {
            this.userId = userId;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder active(boolean active) {
            this.active = active;
            return this;
        }

        public Builder joinedAt(Instant joinedAt) {
            this.joinedAt = joinedAt;
            return this;
        }

        public ProjectMemberResponse build() {
            return new ProjectMemberResponse(
                    assignmentId,
                    userId,
                    name,
                    email,
                    role,
                    active,
                    joinedAt
            );
        }
    }
}