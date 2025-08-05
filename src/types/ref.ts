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
  