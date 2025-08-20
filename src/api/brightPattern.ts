import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import http from "../utils/https";
import type { City, Organization } from "../types/ref";
// Типы для справочных данных

export interface ApiResponse<T> {
  id: string;
  date: string; // e.g., "2025-08-19T07:22:25.090Z"
  status: string;
  reason: string;
  contact_id: string;
  employee_id: string;
  city_id: string;
  district_id: string;
  healthcare_facility_id: string;
  call_type_id: string;
  call_sub_type_id: string;
  appeal_category_id: string;
  appeal_sub_category_id: string;

  contact: {
    id: string;
    caller_id: string;
    full_name: string;
    called_by: string;
    iin: string;
    birth_date: string; // e.g., "2025-08-19"
    gender: "male" | "female" | "not_specified";
  };

  city: {
    id: string;
    name: string;
  };

  district: {
    id: string;
    name: string;
  };

  healthcare_facility: {
    id: string;
    name: string;
  };

  call_type: {
    id: string;
    name: string;
  };

  call_sub_type: {
    id: string;
    name: string;
  };

  appeal_category: {
    id: string;
    name: string;
  };

  appeal_sub_category: {
    id: string;
    name: string;
  };
}

export function RefApi<T = any>(
  url: string,
  data?: Record<string, any>,
  method: Method = "POST"
): Promise<AxiosResponse<T>> {
  const axiosConfig: AxiosRequestConfig = {
    url: `appeal/api/v1/appeals/q${url}`,
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
  return RefApi<ApiResponse<any>>("", params, "GET");
};

export const createOrganization = (
  data: Partial<
    Omit<
      Organization,
      "id" | "created_at" | "updated_at" | "display_name" | "is_active"
    >
  >
) => {
  return RefApi<Organization>("organizations/", data, "POST");
};
