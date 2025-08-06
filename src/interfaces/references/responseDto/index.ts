export interface CallType {
  created_at: string;
  updated_at: string;
  id: string;
  call_type_id: string;
  name: string;
  code: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

export interface CallSubtype {
  created_at: string;
  updated_at: string;
  id: string;
  call_type_id: string;
  name: string;
  code: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

export interface ComplaintStatus {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  code: string;
  description: string;
  is_final: false;
  display_order: 0;
  is_active: true;
}

export interface ComplaintCategory {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  code: string;
  description: string;
  display_order: 0;
  is_active: true;
}

export interface ComplaintSubcategory {
  created_at: string;
  updated_at: string;
  id: string;
  complaint_category_id: string;
  name: string;
  code: string;
  description: string;
  display_order: 0;
  is_active: true;
}

export interface Organization {
  created_at: string; // ISO date string
  updated_at: string;
  id: string; // UUID
  organization_number: string;
  full_name: string;
  short_name: string;
  organization_type: string; // can be a union if other types exist
  phone: string;
  email: string;
  website: string;
  description: string;
  display_name: string;
  is_active: boolean;
}

export interface ReferencesState {
  callTypes: CallType[];
  callSubtypes: CallSubtype[];
  complaintStatuses: ComplaintStatus[];
  complaintCategories: ComplaintCategory[];
  complaintSubcategories: ComplaintSubcategory[];
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}
