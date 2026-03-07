import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "../api/workspaces.api";
import { toast } from "sonner";


export default function useCreateWorkspace() {

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkspace,
    retry: 2,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success("Workspace created.");
    },
    onError: (error) => {
      console.error(error.message)
      toast.error(error.message)
    }
  })
}
