import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import http from '../utils/https'

// Типы для справочных данных
export interface City {
  id: string
  name: string
  region_id: string
  city_code: string
  city_type: string
  is_regional_center: boolean
  is_district_center: boolean
  postal_code: string
  display_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}
export interface Region {
  id: string
  name: string
  name_kk?: string
  name_ru?: string
  name_en?: string // добавь, если используешь в форме
  region_code?: string
  admin_code?: string
  region_type?: string
  capital_city?: string // если используешь
  display_order?: number // если используешь
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
export const getCities = (params?: { include_inactive?: boolean, search?: string; page?: number; page_size?: number  }) => {
  return RefApi<ApiResponse<City>>('cities/', params, 'GET')
}

export const getDistricts = (params?: { include_inactive?: boolean; city_id?: string }) => {
  return RefApi<ApiResponse<District>>('districts/', params, 'GET')
}

export const getOrganizations = (params?: { include_inactive?: boolean; district_id?: string }) => {
  return RefApi<ApiResponse<Organization>>('organizations/', params, 'GET')
}
export const getRegions = (params?: { include_inactive?: boolean; search?: string; page?: number; page_size?: number }) => {
  return RefApi<ApiResponse<Region>>('regions/', params, 'GET')
}
// Добавить регион
export const createRegion = (data: Partial<Region>) => {
  return RefApi('regions/', data, 'POST')
}

// Обновить регион
export const updateRegion = (id: string, data: Partial<Region>) => {
  return RefApi(`regions/${id}/`, data, 'PUT')
}

// Получить регион по ID (для редактирования)
export const getRegionById = (id: string) => {
  return RefApi<Region>(`regions/${id}`, {multilingual:true}, 'GET')
}
export const deleteItems = (url:string, id: string) => {
  return RefApi(`${url}/${id}`, undefined, 'DELETE')
}
export const createCity = (data: Partial<City>) => {
  return RefApi('cities/', data, 'POST')
}

// Обновить город
export const updateCity = (id: string, data: Partial<City>) => {
  return RefApi(`cities/${id}/`, data, 'PUT')
}

// Получить город по ID
export const getCityById = (id: string) => {
  return RefApi<City>(`cities/${id}`, { multilingual: true }, 'GET')
}