import { AxiosError } from "axios";
import type { InviteTypes } from "./invites.types";
import api from "../../../api/api";

export async function getWsInvites(): Promise<InviteTypes[]> {
  try {
    const res = await api.get("/invites");
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

type ResponseTypes = {
  message: string;
  data: InviteTypes;
};

type InputTypes = {
  workspaceId: string;
  emails: string[];
};
export async function sendWsInvite({
  workspaceId,
  emails,
}: InputTypes): Promise<ResponseTypes> {
  try {
    const res = await api.post(`/invites/workspace/${workspaceId}/invite`, {
      emails,
    });
    return res.data;
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

// accept invite;
export async function acceptWsInvite(
  token: string,
): Promise<{ message: string }> {
  try {
    const res = await api.post(`/invites/${token}/accept`);
    return res.data;
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

