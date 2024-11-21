import { api } from '../lib/api';
import { Permission, UserPermission } from '../types/permission';

export async function getPermissions() {
  const response = await api.get<Permission[]>('/permissions');
  return response.data;
}

export async function getUserPermissions(userId: number) {
  const response = await api.get<UserPermission>(`/users/${userId}/permissions`);
  return response.data;
}

export async function updateUserPermissions(userId: number, permissions: Permission[]) {
  const response = await api.put(`/users/${userId}/permissions`, { permissions });
  return response.data;
}

export async function createPermission(data: Partial<Permission>) {
  const response = await api.post('/permissions', data);
  return response.data;
}

export async function updatePermission(id: number, data: Partial<Permission>) {
  const response = await api.put(`/permissions/${id}`, data);
  return response.data;
}

export async function deletePermission(id: number) {
  await api.delete(`/permissions/${id}`);
}