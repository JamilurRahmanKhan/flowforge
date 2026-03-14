import ProjectDetailsScreen from "@/components/screens/projects/ProjectDetailsScreen";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailsScreen id={id} />;
}