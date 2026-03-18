import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendWsInvite } from "../api/invites.api";
import { toast } from "sonner";

export default function useSendWsInvite() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: sendWsInvite,
		retry: 2,
		onError: (error) => {
			console.error(error.message);
			toast.error(error.message ?? "Invite failed!");
		},
		onSuccess: (response) => {
			toast.success(response.message ?? "Invite sent.");
			queryClient.invalidateQueries({ queryKey: ["invites"] });
		},
	});
}
