import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import http from "../utils/https";
import type { Organization } from "../types/ref";
// Типы для справочных данных

// Contact interface
export interface Contact {
  id: string;
  caller_id: string;
  full_name: string;
  called_by: string;
  iin: string | null;
  birth_date: string | null; // Format: "YYYY-MM-DD"
  gender: "male" | "female" | "not_specified";
  home_address: string | null;
}

// Reference data interfaces
export interface City {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
}

export interface HealthcareFacility {
  id: string;
  name: string;
}

export interface CallType {
  id: string;
  name: string;
}

export interface CallSubType {
  id: string;
  name: string;
}

export interface AppealCategory {
  id: string;
  name: string;
}

export interface AppealSubCategory {
  id: string;
  name: string;
}

// Main appeal item interface
export interface AppealItem {
  id: string;
  date: string; // Format: "2025-07-30T12:49:13.222720Z"
  status: "new" | "in_progress" | "completed" | "cancelled" | string;
  reason: string | null;
  contact_id: string;
  employee_id: string;
  city_id: string;
  district_id: string;
  healthcare_facility_id: string;
  call_type_id: string;
  call_sub_type_id: string;
  appeal_category_id: string;
  appeal_sub_category_id: string;

  // Nested objects
  contact: Contact;
  city: City;
  district: District;
  healthcare_facility: HealthcareFacility;
  call_type: CallType;
  call_sub_type: CallSubType;
  appeal_category: AppealCategory | null;
  appeal_sub_category: AppealSubCategory | null;
}

// Paginated response interface
export interface PaginatedAppealsResponse {
  total: number;
  page: number;
  page_size: number;
  items: AppealItem[];
}

// Generic paginated response interface (reusable)
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

// Usage examples:
// const appealsResponse: PaginatedAppealsResponse = ...
// const genericResponse: PaginatedResponse<AppealItem> = ...

// API function type
export type GetAppealsFunction = (params?: {
  page?: number;
  page_size?: number;
  status?: string;
  bp_giid?: string;
  [key: string]: any;
}) => Promise<AxiosResponse<PaginatedAppealsResponse>>;

// Update your existing API function
export const getAppealBpGiidInterface = (params?: {
  bp_giid?: string;
  page?: number;
  page_size?: number;
  status?: string;
}): Promise<AxiosResponse<PaginatedAppealsResponse>> => {
  return RefApi<PaginatedAppealsResponse>("", {}, params, "GET");
};

export function RefApi<T = any>(
  url: string,
  data?: Record<string, any>,
  params?: Record<string, any>,
  method: Method = "POST"
): Promise<AxiosResponse<T>> {
  const axiosConfig: AxiosRequestConfig = {
    url: `appeal/api/v1/appeals/${url}`,
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
export const getAppealBpGiid = (params?: { bp_giid?: string }) => {
  return RefApi<PaginatedAppealsResponse>("", {}, params, "GET");
};
 
