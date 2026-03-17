export type ProjectMember = {
  id: string | null;
  userId: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  joinedAt: string | null;
};