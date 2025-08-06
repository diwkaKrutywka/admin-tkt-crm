interface BaseEntity extends MultilingualMixin {
  code: string;
  description: string;
}

interface MultilingualMixin {
  name_kk?: string;
  name_ru?: string;
  name_en?: string;
}

// POST интерфейсы

export interface CallTypePost extends BaseEntity, MultilingualMixin {
  is_complaint: boolean;
}

export interface CallSubtypePost extends BaseEntity, MultilingualMixin {
  call_type_id: string;
}

export interface ComplaintStatusPost extends BaseEntity, MultilingualMixin {
  is_final: boolean;
}

export interface ComplaintCategoryPost extends BaseEntity, MultilingualMixin {}

export interface ComplaintSubcategoryPost
  extends BaseEntity,
    MultilingualMixin {
  complaint_category_id: string;
}
export interface OrganizationsPost {
  organization_number: string;
  full_name: string;
  short_name: string;
  organization_type: "company" | string; // extend with other types if needed
  phone: string;
  email: string;
  website: string;
  description: string;
}

// PUT интерфейсы

export interface CallTypePut extends BaseEntity, MultilingualMixin {
  is_complaint: boolean;
  is_active: boolean;
}

export interface CallSubtypePut extends BaseEntity, MultilingualMixin {
  call_type_id: string;
  is_active: boolean;
}
export interface ComplaintStatusPut extends BaseEntity {
  is_final: true;
  is_active: boolean;
}
export interface ComplaintCategoryPut extends BaseEntity {
  is_active: boolean;
}
export interface ComplaintSubcategoryPut extends BaseEntity {
  complaint_category_id: string;
  is_active: true;
}
export interface OrganizationsPut {
  organization_number: string;
  full_name: string;
  short_name: string;
  organization_type: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  is_active: boolean;
}
