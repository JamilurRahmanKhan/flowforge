package com.flowforge.task.service;

import com.flowforge.common.exception.BadRequestException;
import com.flowforge.project.entity.Project;
import com.flowforge.project.repository.ProjectRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.task.dto.CreateTaskRequest;
import com.flowforge.task.dto.TaskResponse;
import com.flowforge.task.dto.UpdateTaskRequest;
import com.flowforge.task.dto.UpdateTaskStatusRequest;
import com.flowforge.task.entity.Task;
import com.flowforge.task.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public TaskResponse createTask(CreateTaskRequest request, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(
                        request.getProjectId(),
                        currentUser.getTenantId()
                )
                .orElseThrow(() -> new BadRequestException("Project not found"));

        Task task = Task.builder()
                .tenantId(currentUser.getTenantId())
                .projectId(project.getId())
                .title(request.getTitle().trim())
                .description(
                        request.getDescription() != null ? request.getDescription().trim() : null
                )
                .status("TODO")
                .priority(request.getPriority().trim().toUpperCase())
                .dueDate(request.getDueDate())
                .createdBy(currentUser.getUserId())
                .createdAt(Instant.now())
                .assigneeId(request.getAssigneeId())
                .build();

        task = taskRepository.save(task);
        return toResponse(task);
    }

    public List<TaskResponse> getTasksByProject(UUID projectId, CustomUserPrincipal currentUser) {
        projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        return taskRepository.findByTenantIdAndProjectIdOrderByCreatedAtDesc(
                        currentUser.getTenantId(),
                        projectId
                )
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getMyTasks(CustomUserPrincipal currentUser) {
        return taskRepository.findByTenantIdAndAssigneeIdOrderByCreatedAtDesc(
                        currentUser.getTenantId(),
                        currentUser.getUserId()
                )
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(UUID taskId, CustomUserPrincipal currentUser) {
        Task task = taskRepository.findByIdAndTenantId(taskId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found"));

        return toResponse(task);
    }

    public TaskResponse updateTask(UUID taskId, UpdateTaskRequest request, CustomUserPrincipal currentUser) {
        Task task = taskRepository.findByIdAndTenantId(taskId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found"));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            task.setTitle(request.getTitle().trim());
        }

        task.setDescription(
                request.getDescription() != null ? request.getDescription().trim() : null
        );

        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            task.setPriority(request.getPriority().trim().toUpperCase());
        }

        task.setDueDate(request.getDueDate());
        task.setAssigneeId(request.getAssigneeId());

        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updateTaskStatus(UUID taskId, UpdateTaskStatusRequest request, CustomUserPrincipal currentUser) {
        Task task = taskRepository.findByIdAndTenantId(taskId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found"));

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            throw new BadRequestException("Task status is required");
        }

        task.setStatus(request.getStatus().trim().toUpperCase());
        task = taskRepository.save(task);

        return toResponse(task);
    }

    public TaskResponse assignTask(UUID taskId, UUID assigneeId, CustomUserPrincipal currentUser) {
        Task task = taskRepository.findByIdAndTenantId(taskId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found"));

        task.setAssigneeId(assigneeId);
        task = taskRepository.save(task);

        return toResponse(task);
    }

    public void deleteTask(UUID taskId, CustomUserPrincipal currentUser) {
        Task task = taskRepository.findByIdAndTenantId(taskId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found"));

        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .tenantId(task.getTenantId())
                .projectId(task.getProjectId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdBy(task.getCreatedBy())
                .createdAt(task.getCreatedAt())
                .assigneeId(task.getAssigneeId())
                .build();
    }
}