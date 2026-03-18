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

    public List<ProjectMemberResponse> getAssignedMembers(UUID projectId, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        List<ProjectMember> assignments =
                projectMemberRepository.findByTenantIdAndProjectIdOrderByCreatedAtAsc(
                        currentUser.getTenantId(),
                        project.getId()
                );

        return assignments.stream()
                .map(assignment -> {
                    User user = userRepository.findByIdAndTenantId(
                                    assignment.getUserId(),
                                    currentUser.getTenantId()
                            )
                            .orElseThrow(() -> new BadRequestException("Assigned user not found"));

                    return ProjectMemberResponse.builder()
                            .assignmentId(assignment.getId())
                            .userId(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .active(user.isActive())
                            .joinedAt(assignment.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<ProjectMemberResponse> getAvailableMembers(UUID projectId, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        List<ProjectMember> assignments =
                projectMemberRepository.findByTenantIdAndProjectIdOrderByCreatedAtAsc(
                        currentUser.getTenantId(),
                        project.getId()
                );

        Set<UUID> assignedUserIds = assignments.stream()
                .map(ProjectMember::getUserId)
                .collect(Collectors.toSet());

        return userRepository.findAllByTenantIdOrderByCreatedAtDesc(currentUser.getTenantId())
                .stream()
                .filter(user -> !assignedUserIds.contains(user.getId()))
                .map(user -> ProjectMemberResponse.builder()
                        .assignmentId(null)
                        .userId(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .active(user.isActive())
                        .joinedAt(null)
                        .build())
                .collect(Collectors.toList());
    }

    public void assignMember(UUID projectId, UUID userId, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        User user = userRepository.findByIdAndTenantId(userId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        boolean alreadyAssigned = projectMemberRepository.existsByTenantIdAndProjectIdAndUserId(
                currentUser.getTenantId(),
                project.getId(),
                user.getId()
        );

        if (alreadyAssigned) {
            throw new BadRequestException("User is already assigned to this project");
        }

        ProjectMember assignment = ProjectMember.builder()
                .tenantId(currentUser.getTenantId())
                .projectId(project.getId())
                .userId(user.getId())
                .addedBy(currentUser.getUserId())
                .createdAt(Instant.now())
                .build();

        projectMemberRepository.save(assignment);
    }

    public void removeMember(UUID projectId, UUID userId, CustomUserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndTenantId(projectId, currentUser.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

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