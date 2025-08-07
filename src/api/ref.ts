import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import http from "../utils/https";

// Типы для справочных данных
export interface City {
  id: string;
  name: string;
  region_id: string;
  city_code: string;
  city_type: string;
  is_regional_center: boolean;
  is_district_center: boolean;
  postal_code: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface Region {
  id: string;
  name: string;
  name_kk?: string;
  name_ru?: string;
  name_en?: string; // добавь, если используешь в форме
  region_code?: string;
  admin_code?: string;
  region_type?: string;
  capital_city?: string; // если используешь
  display_order?: number; // если используешь
  is_active: boolean;
}

export interface District {
  id: string;
  name?: string;
  name_kk?: string;
  name_ru?: string;
  name_en?: string;
  city_id: string;
  district_code?: string;
  district_type?: string;
  administrative_center?: string;
  display_order?: number;
  description?: string;
  is_active: boolean;
}
export interface CallType {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_complaint: boolean;
  is_active: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id: string;
  region_id: string;
  city_id: string;
  district_id: string;
  street_id: string;
  house_number: string;
  block?: string;
  apartment_number?: number;
  full_address_text?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  name_kk?: string;
  name_ru?: string;
  district_id: string;
  is_active: boolean;
}
export interface Street {
  id: string;
  name_kk: string;
  name_ru: string;
  name_en: string;
  city_id: string;
  district_ids: string[];
  street_type: string;
  street_code: string;
  description: string;
  display_order: number;
  osm_id: string;
  is_custom: boolean;
  geometry: string;
  is_active: boolean;
  district_names: string[];
  full_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export function RefApi<T = any>(
  url: string,
  data?: Record<string, any>,
  method: Method = "POST"
): Promise<AxiosResponse<T>> {
  const axiosConfig: AxiosRequestConfig = {
    url: `ref/api/v1/${url}`,
    method,
  };

  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    axiosConfig.data = data;
  } else if (method.toUpperCase() === "GET") {
    axiosConfig.params = data;
  }

  return http(axiosConfig);
}

// API методы для справочных данных
export const getCities = (params?: {
  include_inactive?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}) => {
  return RefApi<ApiResponse<City>>("cities/", params, "GET");
};

export const getDistricts = (params?: {
  include_inactive?: boolean;
  city_id?: string;
  page?: number;
  page_size?: number;
}) => {
  return RefApi<ApiResponse<District>>("districts/", params, "GET");
};
// Получить район по ID (для формы редактирования)
export const getDistrictById = (id: string) => {
  return RefApi<District>(`districts/${id}`, { multilingual: true }, "GET");
};

// Создать район
export const createDistrict = (data: Partial<District>) => {
  return RefApi("districts/", data, "POST");
};

// Обновить район
export const updateDistrict = (id: string, data: Partial<District>) => {
  return RefApi(`districts/${id}/`, data, "PUT");
};

export const getOrganizations = (params?: {
  include_inactive?: boolean;
  district_id?: string;
}) => {
  return RefApi<ApiResponse<Organization>>("organizations/", params, "GET");
};
export const getRegions = (params?: {
  include_inactive?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}) => {
  return RefApi<ApiResponse<Region>>("regions/", params, "GET");
};
// Добавить регион
export const createRegion = (data: Partial<Region>) => {
  return RefApi("regions/", data, "POST");
};

// Обновить регион
export const updateRegion = (id: string, data: Partial<Region>) => {
  return RefApi(`regions/${id}/`, data, "PUT");
};

// Получить регион по ID (для редактирования)
export const getRegionById = (id: string) => {
  return RefApi<Region>(`regions/${id}`, { multilingual: true }, "GET");
};
export const deleteItems = (url: string, id: string) => {
  return RefApi(`${url}/${id}`, undefined, "DELETE");
};
export const createCity = (data: Partial<City>) => {
  return RefApi("cities/", data, "POST");
};

// Обновить город
export const updateCity = (id: string, data: Partial<City>) => {
  return RefApi(`cities/${id}/`, data, "PUT");
};

// Получить город по ID
export const getCityById = (id: string) => {
  return RefApi<City>(`cities/${id}`, { multilingual: true }, "GET");
};
// Получить список адресов
export const getAddresses = (params?: {
  include_inactive?: boolean;
  page?: number;
  page_size?: number;
}) => {
  return RefApi<ApiResponse<Address>>("addresses/", params, "GET");
};

// Получить адрес по ID
export const getAddressById = (id: string) => {
  return RefApi<Address>(`addresses/${id}`, { multilingual: true }, "GET");
};

// Создать адрес
export const createAddress = (data: Partial<Address>) => {
  return RefApi("addresses/", data, "POST");
};

// Обновить адрес
export const updateAddress = (id: string, data: Partial<Address>) => {
  return RefApi(`addresses/${id}`, data, "PUT");
};
// Получить список улиц
export const getStreets = (params?: {
  include_inactive?: boolean;
  city_id?: string;
  district_id?: string;
  search?: string;
  page?: number;
  page_size?: number;
}) => {
  return RefApi<ApiResponse<Street>>("streets/", params, "GET");
};

// Получить улицу по ID
export const getStreetById = (id: string) => {
  return RefApi<Street>(`streets/${id}`, { multilingual: true }, "GET");
};

// Создать улицу
export const createStreet = (data: Partial<Street>) => {
  return RefApi("streets/", data, "POST");
};

// Обновить улицу
export const updateStreet = (id: string, data: Partial<Street>) => {
  return RefApi(`streets/${id}/`, data, "PUT");
};
export const getCallTypes = (params?: {
  include_inactive?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}) => {
  return RefApi<ApiResponse<CallType>>("call-types/", params, "GET");
};
export const getCallTypeById = (id: string) => {
  return RefApi<CallType>(`call-types/${id}`, { multilingual: true }, "GET");
};

export const createCallType = (data: Partial<CallType>) => {
  return RefApi("call-types/", data, "POST");
};

export const updateCallType = (id: string, data: Partial<CallType>) => {
  return RefApi(`call-types/${id}`, data, "PUT");
};
