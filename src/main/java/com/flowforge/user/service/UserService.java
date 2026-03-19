package com.flowforge.user.service;

import com.flowforge.common.exception.BadRequestException;
import com.flowforge.organization.entity.Organization;
import com.flowforge.organization.repository.OrganizationRepository;
import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.task.repository.TaskRepository;
import com.flowforge.user.dto.AddWorkspaceMemberRequest;
import com.flowforge.user.dto.ChangePasswordRequest;
import com.flowforge.user.dto.CurrentUserResponse;
import com.flowforge.user.dto.MyWorkspaceResponse;
import com.flowforge.user.dto.UpdateProfileRequest;
import com.flowforge.user.dto.WorkspaceUserResponse;
import com.flowforge.user.entity.User;
import com.flowforge.user.repository.UserRepository;
import com.flowforge.workspace.entity.WorkspaceMember;
import com.flowforge.workspace.repository.WorkspaceMemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final OrganizationRepository organizationRepository;

    public UserService(
            UserRepository userRepository,
            ProjectMemberRepository projectMemberRepository,
            TaskRepository taskRepository,
            PasswordEncoder passwordEncoder,
            WorkspaceMemberRepository workspaceMemberRepository,
            OrganizationRepository organizationRepository
    ) {
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
        this.workspaceMemberRepository = workspaceMemberRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<WorkspaceUserResponse> getWorkspaceUsers(CustomUserPrincipal principal) {
        return workspaceMemberRepository.findByTenantIdOrderByCreatedAtDesc(principal.getTenantId())
                .stream()
                .map(workspaceMember -> {
                    User user = userRepository.findById(workspaceMember.getUserId())
                            .orElseThrow(() -> new BadRequestException("User not found"));

                    return toWorkspaceResponse(user, workspaceMember);
                })
                .toList();
    }

    public List<MyWorkspaceResponse> getMyWorkspaces(CustomUserPrincipal principal) {
        return workspaceMemberRepository.findByUserIdOrderByCreatedAtDesc(principal.getUserId())
                .stream()
                .map(workspaceMember -> {
                    Organization organization = organizationRepository.findById(workspaceMember.getTenantId())
                            .orElseThrow(() -> new BadRequestException("Workspace not found"));

                    return new MyWorkspaceResponse(
                            organization.getId(),
                            organization.getName(),
                            organization.getSlug(),
                            workspaceMember.getRole(),
                            workspaceMember.getCreatedAt()
                    );
                })
                .toList();
    }

    public CurrentUserResponse getCurrentUser(CustomUserPrincipal principal) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return toCurrentUserResponse(user, principal.getTenantId());
    }

    public CurrentUserResponse updateProfile(CustomUserPrincipal principal, UpdateProfileRequest request) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setName(request.getName().trim());
        user = userRepository.save(user);

        return toCurrentUserResponse(user, principal.getTenantId());
    }

    public void changePassword(CustomUserPrincipal principal, ChangePasswordRequest request) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public WorkspaceUserResponse addExistingUserToWorkspace(
            CustomUserPrincipal principal,
            AddWorkspaceMemberRequest request
    ) {
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String normalizedRole = request.getRole().trim().toUpperCase(Locale.ROOT);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("No account exists with this email"));

        boolean alreadyInWorkspace = workspaceMemberRepository.existsByTenantIdAndUserId(
                principal.getTenantId(),
                user.getId()
        );

        if (alreadyInWorkspace) {
            throw new BadRequestException("This user is already in the workspace");
        }

        WorkspaceMember workspaceMember = WorkspaceMember.builder()
                .tenantId(principal.getTenantId())
                .userId(user.getId())
                .role(normalizedRole)
                .addedBy(principal.getUserId())
                .createdAt(Instant.now())
                .build();

        workspaceMember = workspaceMemberRepository.save(workspaceMember);

        return toWorkspaceResponse(user, workspaceMember);
    }

    private CurrentUserResponse toCurrentUserResponse(User user, UUID tenantId) {
        String workspaceRole = workspaceMemberRepository
                .findByTenantIdAndUserId(tenantId, user.getId())
                .map(WorkspaceMember::getRole)
                .orElse("MEMBER");

        return new CurrentUserResponse(
                user.getId(),
                tenantId,
                user.getName(),
                user.getEmail(),
                workspaceRole,
                user.isActive(),
                user.getCreatedAt()
        );
    }

    private WorkspaceUserResponse toWorkspaceResponse(User user, WorkspaceMember workspaceMember) {
        long assignedProjectsCount =
                projectMemberRepository.countByTenantIdAndUserId(workspaceMember.getTenantId(), user.getId());

        long assignedTasksCount =
                taskRepository.countByTenantIdAndAssigneeId(workspaceMember.getTenantId(), user.getId());

        return new WorkspaceUserResponse(
                user.getId(),
                workspaceMember.getTenantId(),
                user.getName(),
                user.getEmail(),
                workspaceMember.getRole(),
                user.isActive(),
                workspaceMember.getCreatedAt(),
                assignedProjectsCount,
                assignedTasksCount
        );
    }
}