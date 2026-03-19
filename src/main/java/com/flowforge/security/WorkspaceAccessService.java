package com.flowforge.security;

import com.flowforge.common.exception.BadRequestException;
import com.flowforge.project.entity.Project;
import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.task.entity.Task;
import com.flowforge.workspace.entity.WorkspaceMember;
import com.flowforge.workspace.repository.WorkspaceMemberRepository;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class WorkspaceAccessService {

    private static final Set<String> WORKSPACE_ADMIN_ROLES = Set.of(
            "ORG_OWNER",
            "WORKSPACE_ADMIN"
    );

    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public WorkspaceAccessService(
            WorkspaceMemberRepository workspaceMemberRepository,
            ProjectMemberRepository projectMemberRepository
    ) {
        this.workspaceMemberRepository = workspaceMemberRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    public WorkspaceMember requireWorkspaceMembership(CustomUserPrincipal principal) {
        return workspaceMemberRepository
                .findByTenantIdAndUserId(principal.getTenantId(), principal.getUserId())
                .orElseThrow(() -> new BadRequestException("You are not a member of this workspace"));
    }

    public boolean isWorkspaceAdmin(CustomUserPrincipal principal) {
        WorkspaceMember membership = requireWorkspaceMembership(principal);
        return WORKSPACE_ADMIN_ROLES.contains(normalizeRole(membership.getRole()));
    }

    public boolean canCreateProject(CustomUserPrincipal principal) {
        return isWorkspaceAdmin(principal);
    }

    public boolean canViewProject(Project project, CustomUserPrincipal principal) {
        validateProjectWorkspace(project, principal);

        if (isWorkspaceAdmin(principal)) {
            return true;
        }

        if (isProjectCreator(project, principal)) {
            return true;
        }

        return isProjectMember(project.getId(), principal);
    }

    public boolean canManageProject(Project project, CustomUserPrincipal principal) {
        validateProjectWorkspace(project, principal);

        if (isWorkspaceAdmin(principal)) {
            return true;
        }

        return isProjectCreator(project, principal);
    }

    public boolean canManageProjectMembers(Project project, CustomUserPrincipal principal) {
        validateProjectWorkspace(project, principal);

        if (isWorkspaceAdmin(principal)) {
            return true;
        }

        return isProjectCreator(project, principal);
    }

    public boolean canCreateTask(Project project, CustomUserPrincipal principal) {
        validateProjectWorkspace(project, principal);

        if (isWorkspaceAdmin(principal)) {
            return true;
        }

        if (isProjectCreator(project, principal)) {
            return true;
        }

        return isProjectMember(project.getId(), principal);
    }

    public boolean canEditTask(Task task, Project project, CustomUserPrincipal principal) {
        validateProjectWorkspace(project, principal);
        validateTaskWorkspace(task, principal);

        if (isWorkspaceAdmin(principal)) {
            return true;
        }

        if (isProjectCreator(project, principal)) {
            return true;
        }

        if (isTaskCreator(task, principal)) {
            return true;
        }

        return isTaskAssignee(task, principal);
    }

    public boolean canDeleteTask(Task task, Project project, CustomUserPrincipal principal) {
        return canEditTask(task, project, principal);
    }

    public boolean canChangeTaskStatus(Task task, Project project, CustomUserPrincipal principal) {
        validateProjectWorkspace(project, principal);
        validateTaskWorkspace(task, principal);

        if (isWorkspaceAdmin(principal)) {
            return true;
        }

        if (isProjectCreator(project, principal)) {
            return true;
        }

        return isTaskAssignee(task, principal);
    }

    public void requireProjectView(Project project, CustomUserPrincipal principal) {
        if (!canViewProject(project, principal)) {
            throw new BadRequestException("You do not have access to this project");
        }
    }

    public void requireProjectManage(Project project, CustomUserPrincipal principal) {
        if (!canManageProject(project, principal)) {
            throw new BadRequestException("You do not have permission to manage this project");
        }
    }

    public void requireProjectMemberManage(Project project, CustomUserPrincipal principal) {
        if (!canManageProjectMembers(project, principal)) {
            throw new BadRequestException("You do not have permission to manage project members");
        }
    }

    public void requireTaskCreate(Project project, CustomUserPrincipal principal) {
        if (!canCreateTask(project, principal)) {
            throw new BadRequestException("You do not have permission to create tasks in this project");
        }
    }

    public void requireTaskEdit(Task task, Project project, CustomUserPrincipal principal) {
        if (!canEditTask(task, project, principal)) {
            throw new BadRequestException("You do not have permission to edit this task");
        }
    }

    public void requireTaskDelete(Task task, Project project, CustomUserPrincipal principal) {
        if (!canDeleteTask(task, project, principal)) {
            throw new BadRequestException("You do not have permission to delete this task");
        }
    }

    public void requireTaskStatusChange(Task task, Project project, CustomUserPrincipal principal) {
        if (!canChangeTaskStatus(task, project, principal)) {
            throw new BadRequestException("You can only change the status of your own assigned tasks");
        }
    }

    private boolean isProjectCreator(Project project, CustomUserPrincipal principal) {
        UUID createdBy = project.getCreatedBy();
        return createdBy != null && createdBy.equals(principal.getUserId());
    }

    private boolean isProjectMember(UUID projectId, CustomUserPrincipal principal) {
        return projectMemberRepository.existsByTenantIdAndProjectIdAndUserId(
                principal.getTenantId(),
                projectId,
                principal.getUserId()
        );
    }

    private boolean isTaskCreator(Task task, CustomUserPrincipal principal) {
        UUID createdBy = task.getCreatedBy();
        return createdBy != null && createdBy.equals(principal.getUserId());
    }

    private boolean isTaskAssignee(Task task, CustomUserPrincipal principal) {
        UUID assigneeId = task.getAssigneeId();
        return assigneeId != null && assigneeId.equals(principal.getUserId());
    }

    private void validateProjectWorkspace(Project project, CustomUserPrincipal principal) {
        if (!project.getTenantId().equals(principal.getTenantId())) {
            throw new BadRequestException("Project does not belong to your workspace");
        }
    }

    private void validateTaskWorkspace(Task task, CustomUserPrincipal principal) {
        if (!task.getTenantId().equals(principal.getTenantId())) {
            throw new BadRequestException("Task does not belong to your workspace");
        }
    }

    private String normalizeRole(String role) {
        return role == null ? "" : role.trim().toUpperCase();
    }
}