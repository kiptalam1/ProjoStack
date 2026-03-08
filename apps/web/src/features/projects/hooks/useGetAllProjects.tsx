import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../api/projects.api";

export default function useGetAllProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,

  })
}
