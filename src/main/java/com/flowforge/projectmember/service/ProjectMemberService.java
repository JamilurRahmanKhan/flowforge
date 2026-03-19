package com.flowforge.projectmember.service;

import com.flowforge.common.exception.BadRequestException;
import com.flowforge.project.entity.Project;
import com.flowforge.project.repository.ProjectRepository;
import com.flowforge.projectmember.dto.ProjectMemberResponse;
import com.flowforge.projectmember.entity.ProjectMember;
import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.security.WorkspaceAccessService;
import com.flowforge.user.entity.User;
import com.flowforge.user.repository.UserRepository;
import com.flowforge.workspace.entity.WorkspaceMember;
import com.flowforge.workspace.repository.WorkspaceMemberRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProjectMemberService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final WorkspaceAccessService workspaceAccessService;

    public ProjectMemberService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository,
            WorkspaceMemberRepository workspaceMemberRepository,
            WorkspaceAccessService workspaceAccessService
    ) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
        this.workspaceAccessService = workspaceAccessService;
    }

    public List<ProjectMemberResponse> getAssignedMembers(UUID projectId, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireProjectView(project, currentUser);

        List<ProjectMember> assignments =
                projectMemberRepository.findByTenantIdAndProjectIdOrderByCreatedAtAsc(
                        currentUser.getTenantId(),
                        project.getId()
                );

        return assignments.stream()
                .map(assignment -> {
                    User user = userRepository.findById(assignment.getUserId())
                            .orElseThrow(() -> new BadRequestException("Assigned user not found"));

                    WorkspaceMember workspaceMember = workspaceMemberRepository
                            .findByTenantIdAndUserId(currentUser.getTenantId(), user.getId())
                            .orElseThrow(() -> new BadRequestException("Workspace membership not found"));

                    return ProjectMemberResponse.builder()
                            .assignmentId(assignment.getId())
                            .userId(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .role(workspaceMember.getRole())
                            .active(user.isActive())
                            .joinedAt(assignment.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<ProjectMemberResponse> getAvailableMembers(UUID projectId, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireProjectMemberManage(project, currentUser);

        List<ProjectMember> assignments =
                projectMemberRepository.findByTenantIdAndProjectIdOrderByCreatedAtAsc(
                        currentUser.getTenantId(),
                        project.getId()
                );

        Set<UUID> assignedUserIds = assignments.stream()
                .map(ProjectMember::getUserId)
                .collect(Collectors.toSet());

        return workspaceMemberRepository.findByTenantIdOrderByCreatedAtDesc(currentUser.getTenantId())
                .stream()
                .filter(workspaceMember -> !assignedUserIds.contains(workspaceMember.getUserId()))
                .map(workspaceMember -> {
                    User user = userRepository.findById(workspaceMember.getUserId())
                            .orElseThrow(() -> new BadRequestException("Workspace user not found"));

                    return ProjectMemberResponse.builder()
                            .assignmentId(null)
                            .userId(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .role(workspaceMember.getRole())
                            .active(user.isActive())
                            .joinedAt(workspaceMember.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public void assignMember(UUID projectId, UUID userId, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireProjectMemberManage(project, currentUser);

        userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        workspaceMemberRepository.findByTenantIdAndUserId(currentUser.getTenantId(), userId)
                .orElseThrow(() -> new BadRequestException("User is not a member of this workspace"));

        boolean alreadyAssigned = projectMemberRepository.existsByTenantIdAndProjectIdAndUserId(
                currentUser.getTenantId(),
                project.getId(),
                userId
        );

        if (alreadyAssigned) {
            throw new BadRequestException("User is already assigned to this project");
        }

        ProjectMember assignment = ProjectMember.builder()
                .tenantId(currentUser.getTenantId())
                .projectId(project.getId())
                .userId(userId)
                .addedBy(currentUser.getUserId())
                .createdAt(Instant.now())
                .build();

        projectMemberRepository.save(assignment);
    }

    public void removeMember(UUID projectId, UUID userId, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        workspaceAccessService.requireProjectMemberManage(project, currentUser);

        ProjectMember assignment = projectMemberRepository
                .findByTenantIdAndProjectIdAndUserId(
                        currentUser.getTenantId(),
                        project.getId(),
                        userId
                )
                .orElseThrow(() -> new BadRequestException("Project member assignment not found"));

        projectMemberRepository.delete(assignment);
    }
}