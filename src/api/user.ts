import http from '../utils/https'
import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'

export function UserApi<T = any>(
  url: string,
  data?: Record<string, any>,
  method: Method = 'POST'
): Promise<AxiosResponse<T>> {
  const config: AxiosRequestConfig = {
    url: `users/${url}`,
    method,
  }

  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    config.data = data
  } else if (method.toUpperCase() === 'GET') {
    config.params = data
  }

  return http(config)
}
