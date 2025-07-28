
export interface User {
    id: string;
    username: string;
    full_name: string;
    user_role: string;
    organization_id: string | null;
    organization_name: string;
    department: string;
    position: string;
    is_active: boolean;
    is_locked: boolean;
    must_change_password: boolean;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
  }
  