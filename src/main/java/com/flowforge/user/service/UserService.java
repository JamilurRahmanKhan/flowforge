package com.flowforge.user.service;

import com.flowforge.common.exception.BadRequestException;
import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.task.repository.TaskRepository;
import com.flowforge.user.dto.ChangePasswordRequest;
import com.flowforge.user.dto.CurrentUserResponse;
import com.flowforge.user.dto.UpdateProfileRequest;
import com.flowforge.user.dto.WorkspaceUserResponse;
import com.flowforge.user.entity.User;
import com.flowforge.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            ProjectMemberRepository projectMemberRepository,
            TaskRepository taskRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<WorkspaceUserResponse> getWorkspaceUsers(CustomUserPrincipal principal) {
        return userRepository.findAllByTenantIdOrderByCreatedAtDesc(principal.getTenantId())
                .stream()
                .map(this::toWorkspaceResponse)
                .toList();
    }

    public CurrentUserResponse getCurrentUser(CustomUserPrincipal principal) {
        User user = userRepository.findByIdAndTenantId(principal.getUserId(), principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return toCurrentUserResponse(user);
    }

    public CurrentUserResponse updateProfile(CustomUserPrincipal principal, UpdateProfileRequest request) {
        User user = userRepository.findByIdAndTenantId(principal.getUserId(), principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setName(request.getName().trim());
        user = userRepository.save(user);

        return toCurrentUserResponse(user);
    }

    public void changePassword(CustomUserPrincipal principal, ChangePasswordRequest request) {
        User user = userRepository.findByIdAndTenantId(principal.getUserId(), principal.getTenantId())
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

    private CurrentUserResponse toCurrentUserResponse(User user) {
        return new CurrentUserResponse(
                user.getId(),
                user.getTenantId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive(),
                user.getCreatedAt()
        );
    }

    private WorkspaceUserResponse toWorkspaceResponse(User user) {
        long assignedProjectsCount =
                projectMemberRepository.countByTenantIdAndUserId(user.getTenantId(), user.getId());

        long assignedTasksCount =
                taskRepository.countByTenantIdAndAssigneeId(user.getTenantId(), user.getId());

        return new WorkspaceUserResponse(
                user.getId(),
                user.getTenantId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive(),
                user.getCreatedAt(),
                assignedProjectsCount,
                assignedTasksCount
        );
    }
}