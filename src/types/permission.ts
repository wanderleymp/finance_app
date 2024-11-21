export interface Permission {
  permission_id: number;
  feature_name: string;
  can_access: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  profile_id: number;
  permissions: Permission[];
}