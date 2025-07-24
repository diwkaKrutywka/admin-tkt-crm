// для стора

export interface UserDto {
  id: string;
  username: string;
  full_name: string;
  user_role: string;
  organization_id: string;
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
// для таблицы

export interface UserView {
  id: string;
  fullName: string;
  role: string;
  organization: string;
  isActive: boolean;
  lastLogin: string | null;
  organization_id: string;
}

export interface pagination {
  page: number;
  page_size: number;
  total: number;
}
