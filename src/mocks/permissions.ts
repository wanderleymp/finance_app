import { Permission } from '../types/permission';

export const mockPermissions: Permission[] = [
  {
    permission_id: 1,
    feature_name: 'view_dashboard',
    description: 'Visualizar dashboard',
    can_access: true,
    created_at: '2024-03-10T00:00:00',
    updated_at: '2024-03-10T00:00:00'
  },
  {
    permission_id: 2,
    feature_name: 'manage_users',
    description: 'Gerenciar usuários',
    can_access: true,
    created_at: '2024-03-10T00:00:00',
    updated_at: '2024-03-10T00:00:00'
  },
  {
    permission_id: 3,
    feature_name: 'manage_licenses',
    description: 'Gerenciar licenças',
    can_access: true,
    created_at: '2024-03-10T00:00:00',
    updated_at: '2024-03-10T00:00:00'
  },
  {
    permission_id: 4,
    feature_name: 'manage_permissions',
    description: 'Gerenciar permissões',
    can_access: true,
    created_at: '2024-03-10T00:00:00',
    updated_at: '2024-03-10T00:00:00'
  },
  {
    permission_id: 5,
    feature_name: 'view_reports',
    description: 'Visualizar relatórios',
    can_access: true,
    created_at: '2024-03-10T00:00:00',
    updated_at: '2024-03-10T00:00:00'
  }
];