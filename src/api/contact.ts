import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import http from '../utils/https'
export function ContactApi<T = any>(
    url: string,
    data?: Record<string, any>,
    method: Method = 'POST'
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      baseURL: 'http://10.100.0.61:8030/api/v1', // <-- override here
      url: `contacts/${url}`,
      method,
    }
  
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      config.data = data
    } else if (method.toUpperCase() === 'GET') {
      config.params = data
    }
  
    return http(config)
  }
  