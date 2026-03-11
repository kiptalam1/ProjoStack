import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../api/tasks.api";
import { toast } from "sonner";

export default function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    retry: 2,
    onError: (error: Error) => {
      console.error(error.message)
      toast.error(error.message ?? "Update failed!");
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}
