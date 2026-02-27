import { useState } from "react";
import { AxiosError, type AxiosResponse } from "axios";
import { toast } from "sonner";
import api from "../api/api";
import { type User, type LoginDataType, AuthContext, type RegisterDataType } from "./AuthContext";
import { useNavigate } from "react-router";

type AuthSuccess = { message?: string; data: User };
type AuthError = { error?: string[] | string };

const getErrorMessage = (err: AxiosError<AuthError>): string => {
  if (err.code === "ECONNABORTED") {
    return err.message;
  }
  const e = err.response?.data.error;

  return Array.isArray(e) ?
    (e[0] ?? "Request failed!")
    : (e ?? "Request failed!");
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate()



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
      setUser(res.data.data);
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

  const register = async (data: RegisterDataType): Promise<boolean> => {
    try {
      await toast.promise(api.post("/auth/register", data), {
        loading: "Loading...",
        success: (response) => response.data.message ?? "Account created successfully",
        error: (err: AxiosError<AuthError>) => getErrorMessage(err)
      });
      //const res = await toastResult.unwrap();
      return true;
    } catch (error: unknown) {
      const msg = error instanceof AxiosError ? getErrorMessage(error as AxiosError<AuthError>) : error instanceof Error ? error.message : String(error);
      console.error(msg);
      return false;
    }
  }

  const logoutUser = async () => {
    try {
      await toast.promise(api.post("/auth/logout"), {
        loading: "Logging out...",
        success: (response: AxiosResponse<AuthSuccess>) => response.data.message ?? "Logged out successfully",
        error: (err: AxiosError<AuthError>) => getErrorMessage(err)
      })
      setUser(null);
      navigate("/auth/login");
    } catch (error: unknown) {
      const msg = error instanceof AxiosError ? getErrorMessage(error as AxiosError<AuthError>) : error instanceof Error ? error.message : String(error);
      console.error(msg);
    }
  }


  return (
    <AuthContext.Provider value={{ user, login, register, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
