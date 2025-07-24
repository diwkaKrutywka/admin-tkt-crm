// types/editUser.ts

export interface EditUserRequest {
  full_name: string;
  organization_id: string;
  organization_name: string;
  department: string;
  position: string;
  is_active: boolean;
}

export interface Organization {
  id: string;
  name: string;
}

export interface EditUserModalProps {
  visible: boolean;
  initialData?: Partial<EditUserRequest>;
  organizations: Organization[];
  loading?: boolean;
}

export interface EditUserModalEmits {
  (e: "update:visible", value: boolean): void;
  (e: "submit", data: EditUserRequest): void;
  (e: "cancel"): void;
}
