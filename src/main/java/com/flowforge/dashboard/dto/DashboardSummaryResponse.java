package com.flowforge.dashboard.dto;

import java.util.List;

public class DashboardSummaryResponse {

    private long totalProjects;
    private long activeProjects;
    private long archivedProjects;
    private long myTasks;
    private long todoTasks;
    private long inProgressTasks;
    private long doneTasks;
    private long overdueTasks;
    private long assignedProjects;
    private List<DashboardRecentActivityItem> recentActivity;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(
            long totalProjects,
            long activeProjects,
            long archivedProjects,
            long myTasks,
            long todoTasks,
            long inProgressTasks,
            long doneTasks,
            long overdueTasks,
            long assignedProjects,
            List<DashboardRecentActivityItem> recentActivity
    ) {
        this.totalProjects = totalProjects;
        this.activeProjects = activeProjects;
        this.archivedProjects = archivedProjects;
        this.myTasks = myTasks;
        this.todoTasks = todoTasks;
        this.inProgressTasks = inProgressTasks;
        this.doneTasks = doneTasks;
        this.overdueTasks = overdueTasks;
        this.assignedProjects = assignedProjects;
        this.recentActivity = recentActivity;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public long getArchivedProjects() {
        return archivedProjects;
    }

    public long getMyTasks() {
        return myTasks;
    }

    public long getTodoTasks() {
        return todoTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public long getDoneTasks() {
        return doneTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public long getAssignedProjects() {
        return assignedProjects;
    }

    public List<DashboardRecentActivityItem> getRecentActivity() {
        return recentActivity;
    }
}