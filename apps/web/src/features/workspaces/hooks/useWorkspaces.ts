import { useQuery, } from "@tanstack/react-query";
import { getWorkSpaces } from "../api/workspaces.api";

export default function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkSpaces,
  });
}
