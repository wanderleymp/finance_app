import apiClient from '../lib/apiClient';

export interface UserResponse {
  user_id: number;
  username: string;
  person_id: number;
  profile_id: number;
  persons: string;
}

export interface UserPerson {
  person_id: number;
  full_name: string;
  fantasy_name: string | null;
  contacts: Array<{
    contact_id: number;
    contact_type: string;
    contact_value: string;
    contact_name: string | null;
  }>;
  documents: Array<{
    person_document_id: number;
    document_type: string;
    document_value: string;
  }>;
  licenses: Array<{
    license_id: number;
    license_name: string;
    start_date: string;
    end_date: string | null;
    status: string;
  }>;
}

export interface User {
  id: number;
  username: string;
  person: UserPerson;
  profile_id: number;
}

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get<UserResponse[]>('/users');
  
  return response.data.map(user => ({
    id: user.user_id,
    username: user.username,
    person: JSON.parse(user.persons),
    profile_id: user.profile_id,
  }));
}

export async function createUser(data: Partial<User>) {
  const response = await apiClient.post('/users', data);
  return response.data;
}

export async function updateUser(id: number, data: Partial<User>) {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: number) {
  await apiClient.delete(`/users/${id}`);
}