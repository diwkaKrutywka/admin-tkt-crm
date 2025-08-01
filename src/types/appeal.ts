interface Contact {
    id: string;
    caller_id: string;
    full_name: string;
    called_by: string;
    iin: string;
    birth_date: string;
    gender: 'male' | 'female' | 'not_specified'; 
  }
  
  export interface Appeal {
    id: string;
    date: string; 
    status: string;
    reason: string;
    employee_id: string;
    city_id: string;
    district_id: string;
    healthcare_facility_id: string;
    call_type_id: string;
    call_sub_type_id: string;
    appeal_category_id?: string;
    appeal_sub_category_id?: string;
    contact: Contact;
  }
  