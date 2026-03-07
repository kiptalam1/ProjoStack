import { useQuery } from "@tanstack/react-query";
import { getWorkspaceProjects } from "../api/projects.api";

export function useGetProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getWorkspaceProjects(workspaceId),
    enabled: !!workspaceId,
  });
}
