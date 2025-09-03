import axios from "axios";
import { Platform } from "react-native";
import { useAuthStore } from "../stores/authStore";
import { storage } from "../utils/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        let refreshPayload = {};
        if (Platform.OS !== "web") {
          const refreshToken = await storage.getItem("refresh");
          if (refreshToken) {
            refreshPayload = { refresh: refreshToken };
          } else {
            throw new Error("No refresh token available on mobile");
          }
        }
        // On web, the payload is empty as the browser sends the HttpOnly cookie.

        const { data } = await api.post(
          "/auth/token/refresh/",
          refreshPayload,
        );

        const { access: newAccessToken, refresh: newRefreshToken } = data;
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
