import { AxiosError } from "axios";
import api from "../../../api/api";
import type { TaskTypes } from "./tasks.types";

export async function getProjectTasks(projectId: string): Promise<TaskTypes[]> {
  try {
    const res = await api.get(`/tasks/project/${projectId}`);
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    if (error instanceof Error) {
      throw Error(error.message);
    }
    throw new Error("Unexpected error occured");
  }
}

type CreateTaskInput = {
  projectId: string;
  title: string;
};
export async function createTask({
  projectId,
  title,
}: CreateTaskInput): Promise<TaskTypes> {
  try {
    const res = await api.post(`/tasks/project/${projectId}`, { title });
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    if (error instanceof Error) {
      throw Error(error.message);
    }
    throw new Error("Unexpected error occured");
  }
}
