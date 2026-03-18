export type DashboardRecentActivityItem = {
  type: string;
  title: string;
  description: string;
  createdAt: string;
  projectId: string | null;
  projectName: string | null;
  taskId: string | null;
};

export type DashboardSummary = {
  totalProjects: number;
  activeProjects: number;
  archivedProjects: number;
  myTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  overdueTasks: number;
  assignedProjects: number;
  recentActivity: DashboardRecentActivityItem[];
};