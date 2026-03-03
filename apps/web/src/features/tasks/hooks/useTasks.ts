import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "../api/tasks.api";

export function useGetProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
    enabled: !!projectId,
  });
}
