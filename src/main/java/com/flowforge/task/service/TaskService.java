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
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class TaskService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("TODO", "IN_PROGRESS", "DONE");

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public TaskResponse createTask(CreateTaskRequest request, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(request.getProjectId(), principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        Task task = Task.builder()
                .tenantId(principal.getTenantId())
                .projectId(project.getId())
                .title(request.getTitle().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .status("TODO")
                .priority(request.getPriority().trim().toUpperCase(Locale.ROOT))
                .dueDate(request.getDueDate())
                .createdBy(principal.getUserId())
                .createdAt(Instant.now())
                .build();

        task = taskRepository.save(task);
        return toResponse(task);
    }

    public List<TaskResponse> getTasksByProject(UUID projectId, CustomUserPrincipal principal) {
        projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        return taskRepository.findByTenantIdAndProjectIdOrderByCreatedAtDesc(principal.getTenantId(), projectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse getTaskById(UUID taskId, CustomUserPrincipal principal) {
        Task task = taskRepository.findByIdAndTenantId(taskId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found in this workspace"));

        return toResponse(task);
    }

    public TaskResponse updateTask(UUID taskId, UpdateTaskRequest request, CustomUserPrincipal principal) {
        Task task = taskRepository.findByIdAndTenantId(taskId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found in this workspace"));

        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        task.setPriority(request.getPriority().trim().toUpperCase(Locale.ROOT));
        task.setDueDate(request.getDueDate());

        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updateTaskStatus(UUID taskId, UpdateTaskStatusRequest request, CustomUserPrincipal principal) {
        Task task = taskRepository.findByIdAndTenantId(taskId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found in this workspace"));

        String normalizedStatus = request.getStatus().trim().toUpperCase(Locale.ROOT);

        if (!ALLOWED_STATUSES.contains(normalizedStatus)) {
            throw new BadRequestException("Invalid task status. Allowed values: TODO, IN_PROGRESS, DONE");
        }

        task.setStatus(normalizedStatus);
        task = taskRepository.save(task);

        return toResponse(task);
    }

    public TaskResponse assignTask(UUID taskId, UUID assigneeId, CustomUserPrincipal principal) {
        Task task = taskRepository.findByIdAndTenantId(taskId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found in this workspace"));

        task.setAssigneeId(assigneeId);

        task = taskRepository.save(task);

        return toResponse(task);
    }

    public List<TaskResponse> getMyTasks(CustomUserPrincipal principal) {
        return taskRepository
                .findByTenantIdAndAssigneeIdOrderByCreatedAtDesc(
                        principal.getTenantId(),
                        principal.getUserId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTenantId(),
                task.getProjectId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.getCreatedBy(),
                task.getCreatedAt(),
                task.getAssigneeId()
        );
    }
}