import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  useLogin, 
  useRegister, 
  useGetMe, 
  LoginRequest, 
  RegisterRequest,
  User
} from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("re_token");

  const { data: user, isLoading, isError } = useGetMe({
    query: {
      retry: false,
      enabled: !!token,
    },
    request: { headers: getAuthHeaders() }
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("re_token");
    }
  }, [isError]);

  const login = async (data: LoginRequest) => {
    const res = await loginMutation.mutateAsync({ data });
    localStorage.setItem("re_token", res.token);
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    setLocation(res.user.role === "admin" ? "/dashboard" : "/");
  };

  const registerUser = async (data: RegisterRequest) => {
    const res = await registerMutation.mutateAsync({ data });
    localStorage.setItem("re_token", res.token);
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    setLocation("/");
  };

  const logout = () => {
    localStorage.removeItem("re_token");
    queryClient.setQueryData(["/api/auth/me"], null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{
      user: user || null,
      isLoading,
      login,
      register: registerUser,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
