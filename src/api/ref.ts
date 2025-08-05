import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import http from '../utils/https'
import config from '../config'

// Типы для справочных данных
export interface City {
  id: string
  name: string
  name_kk?: string
  name_ru?: string
  is_active: boolean
}

export interface District {
  id: string
  name: string
  name_kk?: string
  name_ru?: string
  city_id: string
  is_active: boolean
}

export interface Organization {
  id: string
  name: string
  name_kk?: string
  name_ru?: string
  district_id: string
  is_active: boolean
}

export interface ApiResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export function RefApi<T = any>(
    url: string,
    data?: Record<string, any>,
    method: Method = 'POST'
  ): Promise<AxiosResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      url: `ref/api/v1/${url}`,
      method,
    }
  
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      axiosConfig.data = data
    } else if (method.toUpperCase() === 'GET') {
      axiosConfig.params = data
    }
  
    return http(axiosConfig)
  }

// API методы для справочных данных
export const getCities = (params?: { include_inactive?: boolean }) => {
  return RefApi<ApiResponse<City>>('cities/', params, 'GET')
}

export const getDistricts = (params?: { include_inactive?: boolean; city_id?: string }) => {
  return RefApi<ApiResponse<District>>('districts/', params, 'GET')
}

export const getOrganizations = (params?: { include_inactive?: boolean; district_id?: string }) => {
  return RefApi<ApiResponse<Organization>>('organizations/', params, 'GET')
}
  