import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptWsInvite } from "../api/invites.api";
import { toast } from "sonner";

export function useAcceptWsInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptWsInvite,
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message ?? "Invite failed!");
    },
    onSuccess: (data) => {
      toast.success(data.message ?? "Invite accepted.");
      queryClient.invalidateQueries({ queryKey: ['invites'] })
    }
  })
}
