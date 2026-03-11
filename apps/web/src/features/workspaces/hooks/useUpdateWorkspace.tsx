import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkspace } from "../api/workspaces.api";
import { toast } from "sonner";

export default function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWorkspace,
    retry: 2,
    onSuccess: (data) => {
      toast.success(data.message ?? "Workspace updated successfully.");
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (error: Error) => {
      console.error(error.message);
      toast.error(error.message ?? "Update failed!");
    }
  })
}
