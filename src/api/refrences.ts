import http from "../utils/https";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export function referencesApi<T = any>(
  url: any,
  data?: Record<string, any>,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
): Promise<AxiosResponse<T>> {
  const config: AxiosRequestConfig = {
    url: "ref/api/v1/" + url,
    method,
  };

  if (method === "POST") {
    config.data = data;
  } else if (method === "PUT") {
    console.log(config);

    config.data = data;
  }

  return http(config);
}
