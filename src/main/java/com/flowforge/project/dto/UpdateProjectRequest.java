package com.flowforge.project.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateProjectRequest {

    @NotBlank
    private String name;

    private String description;

    private String status;

    private String visibility;

    private String defaultWorkflow;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public String getDefaultWorkflow() {
        return defaultWorkflow;
    }

    public void setDefaultWorkflow(String defaultWorkflow) {
        this.defaultWorkflow = defaultWorkflow;
    }
}