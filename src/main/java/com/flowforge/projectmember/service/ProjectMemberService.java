package com.flowforge.projectmember.service;

import com.flowforge.common.exception.BadRequestException;
import com.flowforge.project.entity.Project;
import com.flowforge.project.repository.ProjectRepository;
import com.flowforge.projectmember.dto.ProjectMemberResponse;
import com.flowforge.projectmember.entity.ProjectMember;
import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.user.entity.User;
import com.flowforge.user.repository.UserRepository;
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

    public ProjectMemberService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository
    ) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
    }

    public List<ProjectMemberResponse> getAssignedMembers(UUID projectId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        List<ProjectMember> assignments =
                projectMemberRepository.findByTenantIdAndProjectId(principal.getTenantId(), project.getId());

        Set<UUID> userIds = assignments.stream()
                .map(ProjectMember::getUserId)
                .collect(Collectors.toSet());

        List<User> users = userRepository.findAllByTenantIdOrderByCreatedAtDesc(principal.getTenantId())
                .stream()
                .filter(user -> userIds.contains(user.getId()))
                .toList();

        return users.stream()
                .map(user -> {
                    ProjectMember assignment = assignments.stream()
                            .filter(pm -> pm.getUserId().equals(user.getId()))
                            .findFirst()
                            .orElseThrow();

                    return ProjectMemberResponse.builder()
                            .id(assignment.getId())
                            .userId(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .active(user.isActive())
                            .joinedAt(assignment.getCreatedAt())
                            .build();
                })
                .toList();
    }

    public List<ProjectMemberResponse> getAvailableMembers(UUID projectId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        List<ProjectMember> assignments =
                projectMemberRepository.findByTenantIdAndProjectId(principal.getTenantId(), project.getId());

        Set<UUID> assignedUserIds = assignments.stream()
                .map(ProjectMember::getUserId)
                .collect(Collectors.toSet());

        return userRepository.findAllByTenantIdOrderByCreatedAtDesc(principal.getTenantId())
                .stream()
                .filter(user -> !assignedUserIds.contains(user.getId()))
                .map(user -> ProjectMemberResponse.builder()
                        .id(null)
                        .userId(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .active(user.isActive())
                        .joinedAt(null)
                        .build())
                .toList();
    }

    public void assignMember(UUID projectId, UUID userId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        User user = userRepository.findByIdAndTenantId(userId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("User not found in this workspace"));

        boolean alreadyAssigned = projectMemberRepository
                .findByTenantIdAndProjectIdAndUserId(principal.getTenantId(), project.getId(), user.getId())
                .isPresent();

        if (alreadyAssigned) {
            throw new BadRequestException("User is already assigned to this project");
        }

        projectMemberRepository.save(ProjectMember.builder()
                .id(UUID.randomUUID())
                .tenantId(principal.getTenantId())
                .projectId(project.getId())
                .userId(user.getId())
                .addedBy(principal.getUserId())
                .createdAt(Instant.now())
                .build());
    }

    public void removeMember(UUID projectId, UUID userId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        projectMemberRepository.deleteByTenantIdAndProjectIdAndUserId(
                principal.getTenantId(),
                project.getId(),
                userId
        );
    }
}