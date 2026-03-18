export type ActivityItem = {
  type: string;
  title: string;
  description: string;
  createdAt: string;
  projectId: string | null;
  projectName: string | null;
  taskId: string | null;
  taskTitle: string | null;
  userId: string | null;
  userName: string | null;
};