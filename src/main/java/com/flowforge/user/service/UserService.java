package com.flowforge.user.service;

import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.task.repository.TaskRepository;
import com.flowforge.user.dto.WorkspaceUserResponse;
import com.flowforge.user.entity.User;
import com.flowforge.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;

    public UserService(
            UserRepository userRepository,
            ProjectMemberRepository projectMemberRepository,
            TaskRepository taskRepository
    ) {
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.taskRepository = taskRepository;
    }

    public List<WorkspaceUserResponse> getWorkspaceUsers(CustomUserPrincipal principal) {
        return userRepository.findAllByTenantIdOrderByCreatedAtDesc(principal.getTenantId())
                .stream()
                .map(this::toWorkspaceResponse)
                .toList();
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