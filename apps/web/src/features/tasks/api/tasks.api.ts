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

type DeleteTaskInput = {
  projectId: string;
  taskId: string;
};

type DeleteResponse = {
  message: string;
  task: TaskTypes;
};
export async function deleteTask({
  projectId,
  taskId,
}: DeleteTaskInput): Promise<DeleteResponse> {
  try {
    const res = await api.delete(`/tasks/project/${projectId}/task/${taskId}`);
    return res.data.message;
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

type UpdateTaskInput = {
  workspaceId: string;
  projectId: string;
  taskId: string;
  title?: string;
  status?: "PENDING" | "STARTED" | "COMPLETE";
};

type UpdateResponse = {
  message: string;
  data: TaskTypes;
};
export async function updateTask({
  workspaceId,
  projectId,
  taskId,
  title,
  status,
}: UpdateTaskInput): Promise<UpdateResponse> {
  try {
    const res = await api.patch(
      `/tasks/workspace/${workspaceId}/project/${projectId}/task/${taskId}`,
      {
        title,
        status,
      },
    );
    return res.data;
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
