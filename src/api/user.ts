import http from '../utils/https'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export function UserApi<T = any>(
  url: string,
  data?: Record<string, any>,
  method: 'GET' | 'POST' = 'POST'
): Promise<AxiosResponse<T>> {
  const config: AxiosRequestConfig = {
    url: `users/${url}`,
    method,
  }

  if (method === 'POST') {
    config.data = data
  } else {
    config.params = data
  }

  return http(config)
}
