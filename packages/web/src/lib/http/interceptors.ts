import type { AxiosError, AxiosResponse } from "axios";
import { instance } from "./client";

let refreshPromise: Promise<AxiosResponse> | null = null;

async function refreshToken() {
  if (!refreshPromise) {
    refreshPromise = instance.post("/auth/refresh").finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function setupResponseInterceptors() {
  instance.interceptors.response.use(
    function (response) {
      return Promise.resolve(response.data);
    },
    async function (error: AxiosError) {
      if (!error.config || error.config?.url?.includes("refresh")) {
        return Promise.reject(error);
      }

      if (error.status == 401) {
        try {
          await refreshToken();
          return instance.request(error.config);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );
}

export function setupInterceptors() {
  setupResponseInterceptors();
}
