import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import http from "../utils/https";
import type {
  City,
  Region,
  District,
  Street,
  Address,
  CallType,
  Organization,
  ComplaintCategory,
  ComplaintStatus,
  ComplaintSubcategory,
  CallSubtype,
} from "../types/ref";
// Типы для справочных данных

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

export const getOrganizations = (params?: {
  include_inactive?: boolean;
  district_id?: string;
  search?: string;
  page?: number;
  page_size?: number;
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

export const updateOrganization = (
  id: string,
  data: Partial<
    Omit<Organization, "id" | "created_at" | "updated_at" | "display_name">
  >
) => {
  return RefApi<Organization>(`organizations/${id}`, data, "PUT");
};

export const getComplaintSubcategories = (params?: {
  include_inactive?: boolean;
}) => {
  return RefApi<ApiResponse<ComplaintSubcategory>>(
    "complaint-subcategories/",
    params,
    "GET"
  );
};

export const createComplaintSubcategory = (
  data: Partial<
    Omit<ComplaintSubcategory, "id" | "created_at" | "updated_at" | "is_active">
  >
) => {
  return RefApi<ComplaintSubcategory>("complaint-subcategories/", data, "POST");
};

export const updateComplaintSubcategory = (
  id: string,
  data: Partial<
    Omit<ComplaintSubcategory, "id" | "created_at" | "updated_at" | "is_active">
  >
) => {
  return RefApi<ComplaintSubcategory>(
    `complaint-subcategories/${id}`,
    data,
    "PUT"
  );
};

export const getComplaintCategories = (params?: {
  include_inactive?: boolean;
}) => {
  return RefApi<ApiResponse<ComplaintCategory>>(
    "complaint-categories/",
    params,
    "GET"
  );
};

export const createComplaintCategory = (
  data: Partial<
    Omit<ComplaintCategory, "id" | "created_at" | "updated_at" | "is_active">
  >
) => {
  return RefApi<ComplaintCategory>("complaint-categories/", data, "POST");
};

export const updateComplaintCategory = (
  id: string,
  data: Partial<
    Omit<ComplaintCategory, "id" | "created_at" | "updated_at" | "is_active">
  >
) => {
  return RefApi<ComplaintCategory>(`complaint-categories/${id}`, data, "PUT");
};

export const getComplaintStatuses = (params?: {
  include_inactive?: boolean;
}) => {
  return RefApi<ApiResponse<ComplaintStatus>>(
    "complaint-statuses/",
    params,
    "GET"
  );
};

export const createComplaintStatus = (
  data: Partial<
    Omit<ComplaintStatus, "id" | "created_at" | "updated_at" | "is_active">
  >
) => {
  return RefApi<ComplaintStatus>("complaint-statuses/", data, "POST");
};

export const updateComplaintStatus = (
  id: string,
  data: Partial<Omit<ComplaintStatus, "id" | "created_at" | "updated_at">>
) => {
  return RefApi<ComplaintStatus>(`complaint-statuses/${id}`, data, "PUT");
};

export const getCallSubtypes = (params?: {
  include_inactive?: boolean;
  page?: number;
  page_size?: number;
}) => {
  return RefApi<ApiResponse<CallSubtype>>("call-subtypes/", params, "GET");
};

export const createCallSubtype = (
  data: Partial<
    Omit<CallSubtype, "id" | "created_at" | "updated_at" | "is_active">
  >
) => {
  return RefApi<CallSubtype>("call-subtypes/", data, "POST");
};

export const updateCallSubtype = (
  id: string,
  data: Partial<
    Omit<CallSubtype, "id" | "created_at" | "updated_at" | "is_active">
  >
) => {
  return RefApi<CallSubtype>(`call-subtypes/${id}`, data, "PUT");
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
export const getAddressById = (id: string) => {
  return RefApi<Address>(`addresses/${id}`, { multilingual: true }, "GET");
};

// Создать адрес
export const createAddress = (data: Partial<Address>) => {
  return RefApi("addresses/", data, "POST");
};

export const getAddresses = (params?: {
  include_inactive?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}) => {
  return RefApi<ApiResponse<City>>("addresses/", params, "GET");
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
  return RefApi(`streets/${id}`, data, "PUT");
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

// Создать район
export const createDistrict = (data: Partial<District>) => {
  return RefApi("districts/", data, "POST");
};

// Обновить район
export const updateDistrict = (id: string, data: Partial<District>) => {
  return RefApi(`districts/${id}`, data, "PUT");
};

export const getComplaintCategoryById = (id: string) => {
  return RefApi<ComplaintCategory>(
    `complaint-categories/${id}`,
    { multilingual: true },
    "GET"
  );
};

// Получить сабтип по ID
export const getCallSubtypeById = (id: string) => {
  return RefApi<CallSubtype>(
    `call-subtypes/${id}`,
    { multilingual: true },
    "GET"
  );
};
export const getSubtypeById = (id: string) => {
  return RefApi<CallSubtype>(
    `call-subtypes/${id}`,
    { multilingual: true },
    "GET"
  );
};
export const createSubtype = (
  data: Partial<
    Omit<CallSubtype, "id" | "created_at" | "updated_at" | "is_active">
  >
) => {
  return RefApi<CallSubtype>("call-subtypes/", data, "POST");
};
export const updateSubtype = (
  id: string,
  data: Partial<
    Omit<CallSubtype, "id" | "created_at" | "updated_at" | "is_active">
  >
) => {
  return RefApi<CallSubtype>(`call-subtypes/${id}`, data, "PUT");
};

export const getComplaintStatusById = (id: string) => {
  return RefApi<ComplaintStatus>(
    `complaint-statuses/${id}`,
    { multilingual: true },
    "GET"
  );
};

export const getOrganizationById = (id: string) => {
  return RefApi<Organization>(`organizations/${id}`, {}, "GET");
};
