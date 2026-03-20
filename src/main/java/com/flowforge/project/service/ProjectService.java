package com.flowforge.project.service;

import com.flowforge.common.exception.BadRequestException;
import com.flowforge.project.dto.CreateProjectRequest;
import com.flowforge.project.dto.ProjectPermissionsResponse;
import com.flowforge.project.dto.ProjectResponse;
import com.flowforge.project.dto.UpdateProjectRequest;
import com.flowforge.project.entity.Project;
import com.flowforge.project.repository.ProjectRepository;
import com.flowforge.projectmember.entity.ProjectMember;
import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.security.WorkspaceAccessService;
import com.flowforge.task.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final WorkspaceAccessService workspaceAccessService;

    public ProjectService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            TaskRepository taskRepository,
            WorkspaceAccessService workspaceAccessService
    ) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.taskRepository = taskRepository;
        this.workspaceAccessService = workspaceAccessService;
    }

    public ProjectPermissionsResponse getProjectPermissions(CustomUserPrincipal principal) {
        return new ProjectPermissionsResponse(
                workspaceAccessService.canCreateProject(principal)
        );
    }

    public ProjectResponse createProject(CreateProjectRequest request, CustomUserPrincipal principal) {
        if (!workspaceAccessService.canCreateProject(principal)) {
            throw new BadRequestException("You do not have permission to create projects");
        }

        String normalizedKey = request.getKey().trim().toUpperCase(Locale.ROOT);
        Instant now = Instant.now();

        if (projectRepository.existsByTenantIdAndKey(principal.getTenantId(), normalizedKey)) {
            throw new BadRequestException("Project key already exists in this workspace");
        }

        Project project = Project.builder()
                .tenantId(principal.getTenantId())
                .name(request.getName().trim())
                .key(normalizedKey)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .status("ACTIVE")
                .visibility(request.getVisibility().trim().toUpperCase(Locale.ROOT))
                .defaultWorkflow(request.getDefaultWorkflow().trim())
                .createdBy(principal.getUserId())
                .createdAt(now)
                .build();

        project = projectRepository.save(project);

        boolean creatorAlreadyAssigned = projectMemberRepository.existsByTenantIdAndProjectIdAndUserId(
                principal.getTenantId(),
                project.getId(),
                principal.getUserId()
        );

        if (!creatorAlreadyAssigned) {
            ProjectMember creatorMembership = ProjectMember.builder()
                    .tenantId(project.getTenantId())
                    .projectId(project.getId())
                    .userId(principal.getUserId())
                    .addedBy(principal.getUserId())
                    .createdAt(now)
                    .build();

            projectMemberRepository.save(creatorMembership);
        }

        return toResponse(project, principal);
    }

    public List<ProjectResponse> getProjects(CustomUserPrincipal principal) {
        List<Project> projects;

        if (workspaceAccessService.isWorkspaceAdmin(principal)) {
            projects = projectRepository.findByTenantIdOrderByCreatedAtDesc(principal.getTenantId());
        } else {
            List<ProjectMember> assignments = projectMemberRepository
                    .findByTenantIdAndUserIdOrderByCreatedAtAsc(
                            principal.getTenantId(),
                            principal.getUserId()
                    );

            Set<UUID> allowedProjectIds = assignments.stream()
                    .map(ProjectMember::getProjectId)
                    .collect(Collectors.toSet());

            projects = projectRepository.findByTenantIdOrderByCreatedAtDesc(principal.getTenantId())
                    .stream()
                    .filter(project -> allowedProjectIds.contains(project.getId()))
                    .toList();
        }

        return projects.stream()
                .map(project -> toResponse(project, principal))
                .toList();
    }

    public ProjectResponse getProjectById(UUID projectId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        workspaceAccessService.requireProjectView(project, principal);

        return toResponse(project, principal);
    }

    public ProjectResponse updateProject(UUID projectId, UpdateProjectRequest request, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        workspaceAccessService.requireProjectManage(project, principal);

        project.setName(request.getName().trim());
        project.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            project.setStatus(request.getStatus().trim().toUpperCase(Locale.ROOT));
        }

        if (request.getVisibility() != null && !request.getVisibility().isBlank()) {
            project.setVisibility(request.getVisibility().trim().toUpperCase(Locale.ROOT));
        }

        if (request.getDefaultWorkflow() != null && !request.getDefaultWorkflow().isBlank()) {
            project.setDefaultWorkflow(request.getDefaultWorkflow().trim());
        }

        project = projectRepository.save(project);
        return toResponse(project, principal);
    }

    public ProjectResponse archiveProject(UUID projectId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        workspaceAccessService.requireProjectManage(project, principal);

        project.setStatus("ARCHIVED");
        project = projectRepository.save(project);

        return toResponse(project, principal);
    }

    public ProjectResponse unarchiveProject(UUID projectId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        workspaceAccessService.requireProjectManage(project, principal);

        project.setStatus("ACTIVE");
        project = projectRepository.save(project);

        return toResponse(project, principal);
    }

    public void deleteProject(UUID projectId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        workspaceAccessService.requireProjectManage(project, principal);

        projectRepository.delete(project);
    }

    private ProjectResponse toResponse(Project project, CustomUserPrincipal principal) {
        long totalTasks = taskRepository.countByTenantIdAndProjectId(project.getTenantId(), project.getId());

        long todoTasks = taskRepository.countByTenantIdAndProjectIdAndStatus(
                project.getTenantId(),
                project.getId(),
                "TODO"
        );

        long inProgressTasks = taskRepository.countByTenantIdAndProjectIdAndStatus(
                project.getTenantId(),
                project.getId(),
                "IN_PROGRESS"
        );

        long doneTasks = taskRepository.countByTenantIdAndProjectIdAndStatus(
                project.getTenantId(),
                project.getId(),
                "DONE"
        );

        long openTaskCount = todoTasks + inProgressTasks;

        long memberCount = projectMemberRepository.countByTenantIdAndProjectId(
                project.getTenantId(),
                project.getId()
        );

        int progress = totalTasks == 0
                ? 0
                : (int) Math.round((doneTasks * 100.0) / totalTasks);

        Instant updatedAt = project.getCreatedAt();

        return new ProjectResponse(
                project.getId(),
                project.getTenantId(),
                project.getName(),
                project.getKey(),
                project.getDescription(),
                project.getStatus(),
                project.getVisibility(),
                project.getDefaultWorkflow(),
                project.getCreatedBy(),
                project.getCreatedAt(),
                updatedAt,
                memberCount,
                openTaskCount,
                progress,
                workspaceAccessService.canManageProject(project, principal),
                workspaceAccessService.canCreateTask(project, principal),
                workspaceAccessService.canManageProjectMembers(project, principal)
        );
    }
}