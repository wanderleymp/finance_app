import { api } from '../lib/api';
import { License } from '../types/license';

export async function getLicenses() {
  const response = await api.get('/licenses');
  return response.data;
}

export async function getLicense(id: number) {
  const response = await api.get(`/licenses/${id}`);
  return response.data;
}

export async function createLicense(data: Partial<License>) {
  const response = await api.post('/licenses', data);
  return response.data;
}

export async function updateLicense(id: number, data: Partial<License>) {
  const response = await api.put(`/licenses/${id}`, data);
  return response.data;
}

export async function deleteLicense(id: number) {
  await api.delete(`/licenses/${id}`);
}