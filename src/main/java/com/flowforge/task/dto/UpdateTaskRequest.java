package com.flowforge.task.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTaskRequest {
    private String title;
    private String description;
    private String priority;
    private String dueDate;
}