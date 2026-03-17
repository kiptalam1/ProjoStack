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
