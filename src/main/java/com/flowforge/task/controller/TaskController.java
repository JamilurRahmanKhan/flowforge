package com.flowforge.task.controller;

import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.task.dto.AssignTaskRequest;
import com.flowforge.task.dto.CreateTaskRequest;
import com.flowforge.task.dto.TaskResponse;
import com.flowforge.task.dto.UpdateTaskRequest;
import com.flowforge.task.dto.UpdateTaskStatusRequest;
import com.flowforge.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(@Valid @RequestBody CreateTaskRequest request,
                                   Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return taskService.createTask(request, principal);
    }

    @GetMapping
    public List<TaskResponse> getTasksByProject(@RequestParam UUID projectId,
                                                Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return taskService.getTasksByProject(projectId, principal);
    }

    @GetMapping("/my")
    public List<TaskResponse> getMyTasks(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return taskService.getMyTasks(principal);
    }

    @GetMapping("/{id}")
    public TaskResponse getTaskById(@PathVariable UUID id,
                                    Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return taskService.getTaskById(id, principal);
    }

    @PutMapping("/{id}")
    public TaskResponse updateTask(@PathVariable UUID id,
                                   @Valid @RequestBody UpdateTaskRequest request,
                                   Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return taskService.updateTask(id, request, principal);
    }

    @PatchMapping("/{id}/status")
    public TaskResponse updateTaskStatus(@PathVariable UUID id,
                                         @Valid @RequestBody UpdateTaskStatusRequest request,
                                         Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return taskService.updateTaskStatus(id, request, principal);
    }

    @PatchMapping("/{id}/assign")
    public TaskResponse assignTask(@PathVariable UUID id,
                                   @Valid @RequestBody AssignTaskRequest request,
                                   Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return taskService.assignTask(id, request.getAssigneeId(), principal);
    }

    @PatchMapping("/{id}/status")
    public TaskResponse updateTaskStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskStatusRequest request,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return taskService.updateTaskStatus(id, request, principal);
    }
}