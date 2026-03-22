import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/shared/config/env";
import { ApiError } from "@/shared/lib/api/apiError";

const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: env.apiUrl,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => config
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; errors?: unknown }>) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        "An unexpected error occurred while consuming the API.";

      return Promise.reject(
        new ApiError(message, error.response?.status, error.response?.data)
      );
    }
  );

  return instance;
};

const httpClient = createHttpClient();

export const apiRequest = async <Response, Payload = unknown>(
  config: AxiosRequestConfig<Payload>
): Promise<Response> => {
  const response = await httpClient.request<Response, { data: Response }, Payload>(
    config
  );

  return response.data;
};
