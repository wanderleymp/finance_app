import apiClient from '../lib/apiClient';
import { Person } from '../types/person';
import { handleError } from '../utils/errorHandler';

export async function listPersons(): Promise<Person[]> {
  try {
    const response = await apiClient.get<Person[]>('/person');
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao carregar lista de pessoas');
    throw error;
  }
}

export async function getPerson(id: number): Promise<Person> {
  try {
    const response = await apiClient.get<Person>(`/person/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao carregar dados da pessoa');
    throw error;
  }
}

export async function createPerson(data: Partial<Person>): Promise<Person> {
  try {
    const response = await apiClient.post<Person>('/person', data);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao criar pessoa');
    throw error;
  }
}

export async function updatePerson(id: number, data: Partial<Person>): Promise<Person> {
  try {
    const response = await apiClient.put<Person>(`/person/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao atualizar pessoa');
    throw error;
  }
}

export async function deletePerson(id: number): Promise<void> {
  try {
    await apiClient.delete(`/person/${id}`);
  } catch (error) {
    handleError(error, 'Erro ao excluir pessoa');
    throw error;
  }
}

export async function searchPersonByCNPJ(cnpj: string): Promise<Person> {
  try {
    const response = await apiClient.get<Person>(`/person/cnpj/${cnpj}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Erro ao buscar dados do CNPJ');
    throw error;
  }
}

export async function addContact(personId: number, data: any): Promise<void> {
  try {
    await apiClient.post(`/person/${personId}/contacts`, data);
  } catch (error) {
    handleError(error, 'Erro ao adicionar contato');
    throw error;
  }
}

export async function updateContact(personId: number, contactId: number, data: any): Promise<void> {
  try {
    await apiClient.put(`/person/${personId}/contacts/${contactId}`, data);
  } catch (error) {
    handleError(error, 'Erro ao atualizar contato');
    throw error;
  }
}

export async function deleteContact(personId: number, contactId: number): Promise<void> {
  try {
    await apiClient.delete(`/person/${personId}/contacts/${contactId}`);
  } catch (error) {
    handleError(error, 'Erro ao excluir contato');
    throw error;
  }
}

export async function addAddress(personId: number, data: any): Promise<void> {
  try {
    await apiClient.post(`/person/${personId}/addresses`, data);
  } catch (error) {
    handleError(error, 'Erro ao adicionar endereço');
    throw error;
  }
}

export async function updateAddress(personId: number, addressId: number, data: any): Promise<void> {
  try {
    await apiClient.put(`/person/${personId}/addresses/${addressId}`, data);
  } catch (error) {
    handleError(error, 'Erro ao atualizar endereço');
    throw error;
  }
}

export async function deleteAddress(personId: number, addressId: number): Promise<void> {
  try {
    await apiClient.delete(`/person/${personId}/addresses/${addressId}`);
  } catch (error) {
    handleError(error, 'Erro ao excluir endereço');
    throw error;
  }
}

export async function addDocument(personId: number, data: any): Promise<void> {
  try {
    await apiClient.post(`/person/${personId}/documents`, data);
  } catch (error) {
    handleError(error, 'Erro ao adicionar documento');
    throw error;
  }
}

export async function updateDocument(personId: number, documentId: number, data: any): Promise<void> {
  try {
    await apiClient.put(`/person/${personId}/documents/${documentId}`, data);
  } catch (error) {
    handleError(error, 'Erro ao atualizar documento');
    throw error;
  }
}

export async function deleteDocument(personId: number, documentId: number): Promise<void> {
  try {
    await apiClient.delete(`/person/${personId}/documents/${documentId}`);
  } catch (error) {
    handleError(error, 'Erro ao excluir documento');
    throw error;
  }
}