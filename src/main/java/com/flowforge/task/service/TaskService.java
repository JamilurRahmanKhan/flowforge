package com.flowforge.task.service;

import com.flowforge.common.exception.BadRequestException;
import com.flowforge.project.entity.Project;
import com.flowforge.project.repository.ProjectRepository;
import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.security.WorkspaceAccessService;
import com.flowforge.task.dto.CreateTaskRequest;
import com.flowforge.task.dto.TaskResponse;
import com.flowforge.task.dto.UpdateTaskRequest;
import com.flowforge.task.dto.UpdateTaskStatusRequest;
import com.flowforge.task.entity.Task;
import com.flowforge.task.repository.TaskRepository;
import com.flowforge.workspace.repository.WorkspaceMemberRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final WorkspaceAccessService workspaceAccessService;

    public TaskService(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            WorkspaceMemberRepository workspaceMemberRepository,
            WorkspaceAccessService workspaceAccessService
    ) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
        this.workspaceAccessService = workspaceAccessService;
    }

    public TaskResponse createTask(CreateTaskRequest request, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(
                        request.getProjectId(),
                        currentUser.getTenantId()
                )
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireTaskCreate(project, currentUser);

        if (request.getAssigneeId() != null) {
            validateAssignee(project.getId(), currentUser.getTenantId(), request.getAssigneeId());
        }

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
        Project project = projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireProjectView(project, currentUser);

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

        Project project = projectRepository.findByIdAndTenantId(task.getProjectId(), currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireProjectView(project, currentUser);

        return toResponse(task);
    }

    public TaskResponse updateTask(UUID taskId, UpdateTaskRequest request, CustomUserPrincipal currentUser) {
        Task task = taskRepository.findByIdAndTenantId(taskId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found"));

        Project project = projectRepository.findByIdAndTenantId(task.getProjectId(), currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireTaskEdit(task, project, currentUser);

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

        if (request.getAssigneeId() != null) {
            validateAssignee(project.getId(), currentUser.getTenantId(), request.getAssigneeId());
        }

        task.setAssigneeId(request.getAssigneeId());

        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updateTaskStatus(UUID taskId, UpdateTaskStatusRequest request, CustomUserPrincipal currentUser) {
        Task task = taskRepository.findByIdAndTenantId(taskId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found"));

        Project project = projectRepository.findByIdAndTenantId(task.getProjectId(), currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireTaskStatusChange(task, project, currentUser);

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

        Project project = projectRepository.findByIdAndTenantId(task.getProjectId(), currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireTaskEdit(task, project, currentUser);

        validateAssignee(project.getId(), currentUser.getTenantId(), assigneeId);

        task.setAssigneeId(assigneeId);
        task = taskRepository.save(task);

        return toResponse(task);
    }

    public void deleteTask(UUID taskId, CustomUserPrincipal currentUser) {
        Task task = taskRepository.findByIdAndTenantId(taskId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found"));

        Project project = projectRepository.findByIdAndTenantId(task.getProjectId(), currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireTaskDelete(task, project, currentUser);

        taskRepository.delete(task);
    }

    private void validateAssignee(UUID projectId, UUID tenantId, UUID assigneeId) {
        workspaceMemberRepository.findByTenantIdAndUserId(tenantId, assigneeId)
                .orElseThrow(() -> new BadRequestException("Assignee is not a member of this workspace"));

        boolean assignedToProject = projectMemberRepository.existsByTenantIdAndProjectIdAndUserId(
                tenantId,
                projectId,
                assigneeId
        );

        if (!assignedToProject) {
            throw new BadRequestException("Assignee must be a member of this project");
        }
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