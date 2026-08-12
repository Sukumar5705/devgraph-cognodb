import axios from 'axios';
import type { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  timeout: 25000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<{ error?: { message?: string }; message?: string }>) => {
    const message =
      error.response?.data?.error?.message ??
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);
