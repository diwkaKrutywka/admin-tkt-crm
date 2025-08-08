export interface Region {
  id: string;
  name: string;
  region_code: string;
  admin_code: string;
  region_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  capital_city?: string | null;
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

export interface ComplaintSubcategory {
id: string;
complaint_category_id: string;
name?: string;
name_kk?: string;
name_en?: string;
code: string;
description?: string;
}

export interface ComplaintCategory {
id: string;
name?: string;
name_ru?: string;
name_kk?: string;
name_en?: string;
code: string;
description?: string;
is_active: boolean;
}

export interface ComplaintStatus {
id: string;
name: string;
name_kk?: string;
name_ru?: string;
name_en?: string;
code: string;
description?: string;
is_final: boolean;
is_active: boolean;
created_at: string;
updated_at: string;
}
export interface Subtype {
  id: string;
  name_kk?: string;
  name_ru?: string;
  name_en?: string;
  call_type_id: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  }

export interface CallSubtype {
id: string;
name_kk?: string;
name_ru?: string;
name_en?: string;
call_type_id: string;
code: string;
description?: string;
is_active: boolean;
created_at: string;
updated_at: string;
}

export interface City {
  id: string
  name: string
  name_kz: string
  name_ru: string
  name_en: string
  region_id: string
  region?: {
    id: string
    name: string
    name_kz: string
    name_ru: string
    name_en: string
  }
  display_order: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface District {
  id: string;
  name?: string; // объединённое имя, если нужно
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
  name_kk: string;
  name_ru: string;
  name_en: string;
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
export interface Street {
  id: string;
  name_kk: string;
  name_ru: string;
  name_en: string;
  city_id: string;
  district_ids: string[];
  district_names: string[];
  street_type: string;
  street_code: string;
  description?: string;
  display_order?: number;
  osm_id?: string;
  is_custom?: boolean;
  geometry?: string;
  is_active: boolean;
  full_name?: string;
}

