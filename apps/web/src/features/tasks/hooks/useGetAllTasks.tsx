import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../api/tasks.api";

export default function useGetAllTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks,
  })
}
