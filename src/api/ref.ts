import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import http from '../utils/https'
import type { ComplaintCategory, ComplaintStatus, ComplaintSubcategory, CallSubtype } from '../types/ref'
// Типы для справочных данных
export interface City {
  id: string
  name: string
  name_kk?: string
  name_ru?: string
  is_active: boolean
}
export interface Region {
  id: string
  name: string
  name_kk?: string
  name_ru?: string
  region_code?: string
  admin_code?: string
  region_type?: string
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
  id: string;
  created_at: string;
  updated_at: string;
  organization_number?: string | null;
  full_name: string;
  short_name: string;
  organization_type: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  description?: string | null;
  display_name: string;
  is_active: boolean;
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

export const getOrganizations = (params?: { include_inactive?: boolean; district_id?: string ;  search?: string; page?: number; page_size?: number}) => {
  return RefApi<ApiResponse<Organization>>('organizations/', params, 'GET')
}
export const getRegions = (params?: { include_inactive?: boolean; search?: string; page?: number; page_size?: number }) => {
  return RefApi<ApiResponse<Region>>('regions/', params, 'GET')
}

export const createOrganization = (data: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'display_name' | 'is_active'>>) => {
  return RefApi<Organization>('organizations/', data, 'POST')
}

export const updateOrganization = (id: string, data: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'display_name'>>) => {
  return RefApi<Organization>(`organizations/${id}`, data, 'PUT')
}

export const getComplaintSubcategories = (params?: { include_inactive?: boolean }) => {
  return RefApi<ApiResponse<ComplaintSubcategory>>('complaint-subcategories/', params, 'GET')
}

export const createComplaintSubcategory = (data: Partial<Omit<ComplaintSubcategory, 'id' | 'created_at' | 'updated_at' | 'is_active'>>) => {
  return RefApi<ComplaintSubcategory>('complaint-subcategories/', data, 'POST')
}

export const updateComplaintSubcategory = (id: string, data: Partial<Omit<ComplaintSubcategory, 'id' | 'created_at' | 'updated_at' | 'is_active'>>) => {
  return RefApi<ComplaintSubcategory>(`complaint-subcategories/${id}`, data, 'PUT')
}

export const getComplaintCategories = (params?: { include_inactive?: boolean }) => {
  return RefApi<ApiResponse<ComplaintCategory>>('complaint-categories/', params, 'GET')
}

export const createComplaintCategory = (data: Partial<Omit<ComplaintCategory, 'id' | 'created_at' | 'updated_at' | 'is_active'>>) => {
  return RefApi<ComplaintCategory>('complaint-categories/', data, 'POST')
}

export const updateComplaintCategory = (id: string, data: Partial<Omit<ComplaintCategory, 'id' | 'created_at' | 'updated_at' | 'is_active'>>) => {
  return RefApi<ComplaintCategory>(`complaint-categories/${id}`, data, 'PUT')
}

export const getComplaintStatuses = (params?: { include_inactive?: boolean }) => {
  return RefApi<ApiResponse<ComplaintStatus>>('complaint-statuses/', params, 'GET')
}

export const createComplaintStatus = (data: Partial<Omit<ComplaintStatus, 'id' | 'created_at' | 'updated_at' | 'is_active'>>) => {
  return RefApi<ComplaintStatus>('complaint-statuses/', data, 'POST')
}

export const updateComplaintStatus = (id: string, data: Partial<Omit<ComplaintStatus, 'id' | 'created_at' | 'updated_at'>>) => {
  return RefApi<ComplaintStatus>(`complaint-statuses/${id}`, data, 'PUT')
}

export const getCallSubtypes = (params?: { include_inactive?: boolean }) => {
  return RefApi<ApiResponse<CallSubtype>>('call-subtypes/', params, 'GET')
}

export const createCallSubtype = (data: Partial<Omit<CallSubtype, 'id' | 'created_at' | 'updated_at' | 'is_active'>>) => {
  return RefApi<CallSubtype>('call-subtypes/', data, 'POST')
}

export const updateCallSubtype = (id: string, data: Partial<Omit<CallSubtype, 'id' | 'created_at' | 'updated_at' | 'is_active'>>) => {
  return RefApi<CallSubtype>(`call-subtypes/${id}`, data, 'PUT')
}


