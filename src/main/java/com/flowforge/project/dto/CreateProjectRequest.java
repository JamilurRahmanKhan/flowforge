package com.flowforge.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateProjectRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Size(min = 2, max = 10)
    private String key;

    private String description;

    @NotBlank
    private String visibility;

    @NotBlank
    private String defaultWorkflow;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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