import { AxiosError } from "axios";
import api from "../../../api/api";
import type { ProjectsTypes } from "./projects.types";

export async function getWorkspaceProjects(
  workspaceId: string,
): Promise<ProjectsTypes[]> {
  try {
    const res = await api.get(`/projects/workspace/${workspaceId}`);
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }

    if (error instanceof Error) {
      throw Error(error.message);
    }
    throw new Error("Unexpected error occurred");
  }
}

type CreateProjectInput = {
  workspaceId: string;
  name: string;
};

export async function createProject({
  workspaceId,
  name,
}: CreateProjectInput): Promise<ProjectsTypes> {
  try {
    const res = await api.post(`/projects/workspace/${workspaceId}/create`, {
      name,
    });
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }

    if (error instanceof Error) {
      throw Error(error.message);
    }
    throw new Error("Unexpected error occurred");
  }
}
