package com.flowforge.dashboard.service;

import com.flowforge.activity.service.ActivityService;
import com.flowforge.dashboard.dto.DashboardRecentActivityItem;
import com.flowforge.dashboard.dto.DashboardSummaryResponse;
import com.flowforge.project.repository.ProjectRepository;
import com.flowforge.projectmember.repository.ProjectMemberRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.task.entity.Task;
import com.flowforge.task.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ActivityService activityService;

    public DashboardService(
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            ProjectMemberRepository projectMemberRepository,
            ActivityService activityService
    ) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.activityService = activityService;
    }

    public DashboardSummaryResponse getDashboard(CustomUserPrincipal principal) {
        long totalProjects =
                projectRepository.countByTenantId(principal.getTenantId());

        long activeProjects =
                projectRepository.countByTenantIdAndStatus(
                        principal.getTenantId(),
                        "ACTIVE"
                );

        long archivedProjects =
                projectRepository.countByTenantIdAndStatus(
                        principal.getTenantId(),
                        "ARCHIVED"
                );

        List<Task> myTasks =
                taskRepository.findByTenantIdAndAssigneeIdOrderByCreatedAtDesc(
                        principal.getTenantId(),
                        principal.getUserId()
                );

        long todoTasks = myTasks.stream()
                .filter(task -> "TODO".equals(task.getStatus()))
                .count();

        long inProgressTasks = myTasks.stream()
                .filter(task -> "IN_PROGRESS".equals(task.getStatus()))
                .count();

        long doneTasks = myTasks.stream()
                .filter(task -> "DONE".equals(task.getStatus()))
                .count();

        LocalDate today = LocalDate.now();
        long overdueTasks = myTasks.stream()
                .filter(task -> task.getDueDate() != null)
                .filter(task -> !"DONE".equals(task.getStatus()))
                .filter(task -> task.getDueDate().isBefore(today))
                .count();

        long assignedProjects =
                projectMemberRepository.countByTenantIdAndUserId(
                        principal.getTenantId(),
                        principal.getUserId()
                );

        var activity = activityService.getWorkspaceActivity(principal, 8);

        List<DashboardRecentActivityItem> recentActivity = activity.stream()
                .map(item -> new DashboardRecentActivityItem(
                        item.getType(),
                        item.getTitle(),
                        item.getDescription(),
                        item.getCreatedAt(),
                        item.getProjectId(),
                        item.getProjectName(),
                        item.getTaskId()
                ))
                .toList();

        return new DashboardSummaryResponse(
                totalProjects,
                activeProjects,
                archivedProjects,
                myTasks.size(),
                todoTasks,
                inProgressTasks,
                doneTasks,
                overdueTasks,
                assignedProjects,
                recentActivity
        );
    }
}