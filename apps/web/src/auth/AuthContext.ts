import { createContext } from "react";

export type LoginDataType = {
	email: string;
	password: string;
};

export type User = {
	id: string;
	role: "ADMIN" | "USER";
	email: string;
	username: string;
	createdAt: string;
};

type AuthContextType = {
	user: User | null;
	login: (data: LoginDataType) => Promise<Response | void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
