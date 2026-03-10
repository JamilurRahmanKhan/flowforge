package com.flowforge.task.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class UpdateTaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String priority;

    private LocalDate dueDate;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}