import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token interceptor
authApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const { data } = await authApi.post("/api/auth/register", {
    name,
    email,
    password,
  });
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const { data } = await authApi.post("/api/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", data.token);
  return data.user;
};

export const getMe = async () => {
  const { data } = await authApi.get("/api/auth/me");
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};