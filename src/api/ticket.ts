import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import http from '../utils/https'
export function TicketApi<T = any>(
    url: string,
    data?: Record<string, any>,
    method: Method = 'POST'
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      url: `ticket/api/v1/ticket/${url}`,
      method,
    }
  
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      config.data = data
    } else if (method.toUpperCase() === 'GET') {
      config.params = data
    }
  
    return http(config)
  }
  