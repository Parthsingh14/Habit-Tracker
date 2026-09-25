import axios from "axios";
import { ApiError, ApiErrorShape } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        // Network failure - backend unreachable, offline, timeout, etc.
        return Promise.reject(
          new ApiError("Could not reach the server. Check your connection and try again.")
        );
      }
      const data = error.response.data as Partial<ApiErrorShape> | undefined;
      const message = data?.message || "Something went wrong. Please try again.";
      return Promise.reject(new ApiError(message, error.response.status));
    }
    return Promise.reject(new ApiError("An unexpected error occurred."));
  }
);
