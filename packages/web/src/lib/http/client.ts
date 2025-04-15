import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { config } from "@/config";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { clearUser, setUser } from "@/features/user/slice";

const instance = axios.create({
  baseURL: config.apiUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  transformRequest: [
    function (data) {
      return JSON.stringify(data);
    },
  ],
});

type HttpBaseQueryError = {
  status: number;
  data: { message: string };
};

const httpBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    HttpBaseQueryError
  > =>
  async ({ url, method, data, params, headers }, api) => {
    try {
      const result = await instance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });

      return {
        data: result,
      };
    } catch (axiosError) {
      const error = axiosError as AxiosError;

      if (error.response?.status != 401) {
        return {
          error: {
            status: error.response?.status ?? 500,
            data: (error.response?.data as { message: string }) || {
              message: error.message,
            },
          },
        };
      }

      try {
        const response = await instance.post("/auth/refresh");
        api.dispatch(setUser(response.data));

        const retryResult = await instance({
          url: baseUrl + url,
          method,
          data,
          params,
          headers,
        });

        return {
          data: retryResult.data,
        };
      } catch (axiosError) {
        const error = axiosError as AxiosError;
        api.dispatch(clearUser());

        return {
          error: {
            status: error.response?.status ?? 500,
            data: (error.response?.data as { message: string }) || {
              message: error.message,
            },
          },
        };
      }
    }
  };

export { instance, httpBaseQuery };
export type { HttpBaseQueryError };
