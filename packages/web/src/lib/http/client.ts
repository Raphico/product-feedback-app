import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { config } from "@/config";
import { BaseQueryFn } from "@reduxjs/toolkit/query";

console.log(config.apiUrl);
const instance = axios.create({
  baseURL: config.apiUrl,
  timeout: 5_000,
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
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
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
      return {
        error: {
          status: error.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };

export { instance, httpBaseQuery };
