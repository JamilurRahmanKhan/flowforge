package com.flowforge.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class SwitchWorkspaceRequest {

    @NotBlank
    private String workspaceSlug;

    public SwitchWorkspaceRequest() {
    }

    public String getWorkspaceSlug() {
        return workspaceSlug;
    }

    public void setWorkspaceSlug(String workspaceSlug) {
        this.workspaceSlug = workspaceSlug;
    }
}