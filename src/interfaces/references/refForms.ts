import type {
  CallTypePost,
  CallSubtypePost,
  ComplaintStatusPost,
  ComplaintCategoryPost,
  ComplaintSubcategoryPost,
  OrganizationsPost,
  CallTypePut,
  CallSubtypePut,
  ComplaintStatusPut,
  ComplaintCategoryPut,
  ComplaintSubcategoryPut,
  OrganizationsPut,
} from "../references/requestDto/index";

// Образы объектов для создания форм в модальном окне добавления и редактирования справочника
export const callTypePost: CallTypePost = {
  code: "",
  description: "",
  is_complaint: false,
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const callSubtypePost: CallSubtypePost = {
  code: "",
  description: "",
  call_type_id: "",
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const complaintStatusPost: ComplaintStatusPost = {
  code: "",
  description: "",
  is_final: false,
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const complaintCategoryPost: ComplaintCategoryPost = {
  code: "",
  description: "",
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const complaintSubcategoryPost: ComplaintSubcategoryPost = {
  code: "",
  description: "",
  complaint_category_id: "",
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const organizationsPost: OrganizationsPost = {
  organization_number: "",
  full_name: "",
  short_name: "",
  organization_type: "",
  phone: "",
  email: "",
  website: "",
  description: "",
};
export const callTypePut: CallTypePut = {
  code: "",
  description: "",
  is_active: false,
  is_complaint: false,
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const callSubtypePut: CallSubtypePut = {
  code: "",
  description: "",
  call_type_id: "",
  is_active: false,
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const complaintStatusPut: ComplaintStatusPut = {
  code: "",
  description: "",
  is_final: true,
  is_active: false,
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const complaintCategoryPut: ComplaintCategoryPut = {
  code: "",
  description: "",
  is_active: false,
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const complaintSubcategoryPut: ComplaintSubcategoryPut = {
  code: "",
  description: "",
  complaint_category_id: "",
  is_active: true,
  name_kk: "",
  name_ru: "",
  name_en: "",
};
export const organizationsPut: OrganizationsPut = {
  organization_number: "",
  full_name: "",
  short_name: "",
  organization_type: "",
  phone: "",
  email: "",
  website: "",
  description: "",
  is_active: true,
};
