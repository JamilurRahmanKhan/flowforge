package com.flowforge.project.dto;

public class ProjectPermissionsResponse {

    private boolean canCreateProject;

    public ProjectPermissionsResponse(boolean canCreateProject) {
        this.canCreateProject = canCreateProject;
    }

    public boolean isCanCreateProject() {
        return canCreateProject;
    }
}