
  
  export interface Appeal {
    id: string;
    date: string; // ISO date string
    status: 'new' | 'in_progress' | 'closed' | string; // уточни, если есть фиксированные значения
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
  
    contact: Contact;
    city: City;
    district: District;
    healthcare_facility: HealthcareFacility;
    call_type: CallType;
    call_sub_type: CallSubType;
    appeal_category: AppealCategory;
    appeal_sub_category: AppealSubCategory;
  }
  
  export interface Contact {
    id: string;
    caller_id: string;
    full_name: string;
    called_by: string;
    iin: string | null;
    birth_date: string | null; // ISO date string or null
    gender: 'male' | 'female' | 'not_specified' | string;
  }
  
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
  