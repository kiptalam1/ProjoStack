import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../api/tasks.api";
import { toast } from "sonner";

export default function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (response) => {
      toast.success(response.message ?? "Task deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}
