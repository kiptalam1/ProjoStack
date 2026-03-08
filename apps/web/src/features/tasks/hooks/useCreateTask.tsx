import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api/tasks.api";
import { toast } from "sonner";

export default function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    retry: 2,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success("Task created successfully.")
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    }
  })
}
