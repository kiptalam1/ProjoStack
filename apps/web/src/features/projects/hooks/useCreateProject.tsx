import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../api/projects.api";
import { toast } from "sonner";

export function useCreateProject() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    retry: 2,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success("Project created successfully")
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
