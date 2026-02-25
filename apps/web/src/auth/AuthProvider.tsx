import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import api from "../api/api";
import { type User, type LoginDataType, AuthContext } from "./AuthContext";

type AuthSuccess = { message?: string; user: User };
type AuthError = { error?: string[] | string };

const getErrorMessage = (err: AxiosError<AuthError>): string => {
	if (err.code === "ECONNABORTED") {
		return err.message;
	}
	const e = err.response?.data.error;

	return Array.isArray(e) ?
			(e[0] ?? "Request failed!")
		:	(e ?? "Request failed!");
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const login = async (data: LoginDataType): Promise<void> => {
		try {
			const toastResult = toast.promise(
				api.post<AuthSuccess>("/auth/login", data),
				{
					loading: "Loading...",
					success: (response) =>
						response.data.message ?? "Logged in successfully",
					error: (err: AxiosError<AuthError>) => getErrorMessage(err),
				},
			);
			const res = await toastResult.unwrap();
			if (!res.data) return;
			setUser(res.data.user);
		} catch (error: unknown) {
			const msg =
				error instanceof AxiosError ?
					getErrorMessage(error as AxiosError<AuthError>)
				: error instanceof Error ? error.message
				: String(error);
			console.error(msg);
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login }}>
			{children}
		</AuthContext.Provider>
	);
};
