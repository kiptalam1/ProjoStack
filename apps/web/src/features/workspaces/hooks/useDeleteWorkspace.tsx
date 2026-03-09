import { useMutation, useQueryClient, } from "@tanstack/react-query";
import { deleteWorkspace } from "../api/workspaces.api";
import { toast } from "sonner";

export default function useDeleteWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteWorkspace,
    retry: 2,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success(data);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message)
    }
  })
}
