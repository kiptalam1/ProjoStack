import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../api/projects.api";
import { toast } from "sonner";

export default function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    retry: false,
    onSuccess: (data) => {
      toast.success(data ?? "Project deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error(error.message);
    }

  })
}
