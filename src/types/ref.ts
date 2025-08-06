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
  