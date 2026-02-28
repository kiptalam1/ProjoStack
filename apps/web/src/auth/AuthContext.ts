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

export type RegisterDataType = {
  username: string;
  email: string;
  password: string;
};

type AuthContextType = {
  loading: boolean;
  user: User | null;
  login: (data: LoginDataType) => Promise<void>;
  register: (data: RegisterDataType) => Promise<boolean | void>;
  logoutUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
