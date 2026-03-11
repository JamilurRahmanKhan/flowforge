package com.flowforge.task.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class AssignTaskRequest {

    @NotNull
    private UUID assigneeId;

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }
}