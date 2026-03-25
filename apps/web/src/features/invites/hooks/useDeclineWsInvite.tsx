import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectWsInvite } from "../api/invites.api";
import { toast } from "sonner";

export function useDeclineWsInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectWsInvite,
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message ?? "Failed!");
    },
    onSuccess: (response) => {
      toast.success(response.message ?? "Invite declined successfully.");
      queryClient.invalidateQueries({ queryKey: ['invites'] })
    }
  })
}
