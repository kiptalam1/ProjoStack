import api from "../../../api/api";
import { AxiosError } from "axios";
import type { WorkspacesTypes } from "./workspaces.types";

export async function getWorkSpaces(): Promise<WorkspacesTypes[]> {
  try {
    const res = await api.get("/workspaces");
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error occurred.");
  }
}

export async function createWorkspace(name: string): Promise<WorkspacesTypes> {
  try {
    const res = await api.post("/workspaces/create", { name });
    return res.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error occurred.");
  }
}

export async function deleteWorkspace(workspaceId: string) {
  try {
    const res = await api.delete(`/workspaces/delete/${workspaceId}`);
    return res.data.message;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unexpected error occurred.");
  }
}
