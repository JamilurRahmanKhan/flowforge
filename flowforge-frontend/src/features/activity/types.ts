export type ActivityItem = {
  id: string;
  type:
    | "PROJECT_CREATED"
    | "PROJECT_UPDATED"
    | "PROJECT_ARCHIVED"
    | "PROJECT_ACTIVE"
    | "TASK_CREATED";
  title: string;
  description: string;
  timestamp: string;
};