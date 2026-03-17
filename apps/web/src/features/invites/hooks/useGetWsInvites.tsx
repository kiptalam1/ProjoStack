import { useQuery } from "@tanstack/react-query";
import { getWsInvites } from "../api/invites.api";

export default function useGetWsInvites() {
	return useQuery({
		queryKey: ["invites"],
		queryFn: getWsInvites,
	});
}
