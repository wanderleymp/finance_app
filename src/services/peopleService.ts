import { api } from '../lib/api';
import { Person } from '../types/person';

export async function getPeople() {
  const response = await api.get('/people');
  return response.data;
}

export async function getPerson(id: number) {
  const response = await api.get(`/people/${id}`);
  return response.data;
}

export async function createPerson(data: Partial<Person>) {
  const response = await api.post('/people', data);
  return response.data;
}

export async function updatePerson(id: number, data: Partial<Person>) {
  const response = await api.put(`/people/${id}`, data);
  return response.data;
}

export async function deletePerson(id: number) {
  await api.delete(`/people/${id}`);
}