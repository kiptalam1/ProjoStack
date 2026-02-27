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
