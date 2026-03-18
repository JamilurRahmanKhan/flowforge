package com.flowforge.activity.service;

import com.flowforge.activity.dto.ActivityResponse;
import com.flowforge.comment.entity.Comment;
import com.flowforge.comment.repository.CommentRepository;
import com.flowforge.common.exception.BadRequestException;
import com.flowforge.project.entity.Project;
import com.flowforge.project.repository.ProjectRepository;
import com.flowforge.projectmember.entity.ProjectMember;
import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.task.entity.Task;
import com.flowforge.task.repository.TaskRepository;
import com.flowforge.user.entity.User;
import com.flowforge.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class ActivityService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    public ActivityService(
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            CommentRepository commentRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository
    ) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
    }

    public List<ActivityResponse> getWorkspaceActivity(CustomUserPrincipal principal, int limit) {
        List<Project> projects = projectRepository.findByTenantIdOrderByCreatedAtDesc(principal.getTenantId());

        List<ActivityResponse> activities = new ArrayList<>();

        for (Project project : projects) {
            activities.add(new ActivityResponse(
                    "PROJECT_CREATED",
                    "Project created",
                    project.getName() + " was created",
                    project.getCreatedAt(),
                    project.getId(),
                    project.getName(),
                    null,
                    null,
                    project.getCreatedBy(),
                    resolveUserName(principal.getTenantId(), project.getCreatedBy())
            ));

            List<Task> tasks = taskRepository.findByTenantIdAndProjectIdOrderByCreatedAtDesc(
                    principal.getTenantId(),
                    project.getId()
            );

            for (Task task : tasks) {
                activities.add(new ActivityResponse(
                        "TASK_CREATED",
                        "Task created",
                        task.getTitle() + " was created in " + project.getName(),
                        task.getCreatedAt(),
                        project.getId(),
                        project.getName(),
                        task.getId(),
                        task.getTitle(),
                        task.getCreatedBy(),
                        resolveUserName(principal.getTenantId(), task.getCreatedBy())
                ));

                List<Comment> comments = commentRepository.findByTenantIdAndTaskIdOrderByCreatedAtAsc(
                        principal.getTenantId(),
                        task.getId()
                );

                for (Comment comment : comments) {
                    activities.add(new ActivityResponse(
                            "COMMENT_ADDED",
                            "Comment added",
                            "A comment was added to " + task.getTitle(),
                            comment.getCreatedAt(),
                            project.getId(),
                            project.getName(),
                            task.getId(),
                            task.getTitle(),
                            comment.getAuthorId(),
                            resolveUserName(principal.getTenantId(), comment.getAuthorId())
                    ));
                }
            }

            List<ProjectMember> members = projectMemberRepository.findByTenantIdAndProjectIdOrderByCreatedAtAsc(
                    principal.getTenantId(),
                    project.getId()
            );

            for (ProjectMember member : members) {
                activities.add(new ActivityResponse(
                        "MEMBER_ASSIGNED",
                        "Member assigned",
                        resolveUserName(principal.getTenantId(), member.getUserId()) + " joined " + project.getName(),
                        member.getCreatedAt(),
                        project.getId(),
                        project.getName(),
                        null,
                        null,
                        member.getUserId(),
                        resolveUserName(principal.getTenantId(), member.getUserId())
                ));
            }
        }

        return activities.stream()
                .sorted(Comparator.comparing(ActivityResponse::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(limit)
                .toList();
    }

    public List<ActivityResponse> getProjectActivity(UUID projectId, CustomUserPrincipal principal, int limit) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found"));

        List<ActivityResponse> activities = new ArrayList<>();

        activities.add(new ActivityResponse(
                "PROJECT_CREATED",
                "Project created",
                project.getName() + " was created",
                project.getCreatedAt(),
                project.getId(),
                project.getName(),
                null,
                null,
                project.getCreatedBy(),
                resolveUserName(principal.getTenantId(), project.getCreatedBy())
        ));

        List<Task> tasks = taskRepository.findByTenantIdAndProjectIdOrderByCreatedAtDesc(
                principal.getTenantId(),
                project.getId()
        );

        for (Task task : tasks) {
            activities.add(new ActivityResponse(
                    "TASK_CREATED",
                    "Task created",
                    task.getTitle() + " was created",
                    task.getCreatedAt(),
                    project.getId(),
                    project.getName(),
                    task.getId(),
                    task.getTitle(),
                    task.getCreatedBy(),
                    resolveUserName(principal.getTenantId(), task.getCreatedBy())
            ));

            List<Comment> comments = commentRepository.findByTenantIdAndTaskIdOrderByCreatedAtAsc(
                    principal.getTenantId(),
                    task.getId()
            );

            for (Comment comment : comments) {
                activities.add(new ActivityResponse(
                        "COMMENT_ADDED",
                        "Comment added",
                        "A comment was added to " + task.getTitle(),
                        comment.getCreatedAt(),
                        project.getId(),
                        project.getName(),
                        task.getId(),
                        task.getTitle(),
                        comment.getAuthorId(),
                        resolveUserName(principal.getTenantId(), comment.getAuthorId())
                ));
            }
        }

        List<ProjectMember> members = projectMemberRepository.findByTenantIdAndProjectIdOrderByCreatedAtAsc(
                principal.getTenantId(),
                project.getId()
        );

        for (ProjectMember member : members) {
            activities.add(new ActivityResponse(
                    "MEMBER_ASSIGNED",
                    "Member assigned",
                    resolveUserName(principal.getTenantId(), member.getUserId()) + " joined this project",
                    member.getCreatedAt(),
                    project.getId(),
                    project.getName(),
                    null,
                    null,
                    member.getUserId(),
                    resolveUserName(principal.getTenantId(), member.getUserId())
            ));
        }

        return activities.stream()
                .sorted(Comparator.comparing(ActivityResponse::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(limit)
                .toList();
    }

    private String resolveUserName(UUID tenantId, UUID userId) {
        if (userId == null) {
            return "Unknown user";
        }

        return userRepository.findByIdAndTenantId(userId, tenantId)
                .map(User::getName)
                .orElse("Unknown user");
    }
}