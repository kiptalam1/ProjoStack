import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../api/projects.api";
import { toast } from "sonner";

export default function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    retry: 2,
    onSuccess: (data) => {
      toast.success(data.message ?? "Project updated successfully.");
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: Error) => {
      console.error(error.message);
      toast.error(error.message ?? "Update failed!");
    }
  })
}
