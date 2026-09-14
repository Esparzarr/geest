import type {
  ContactsPayload,
  ContactsResponse,
  CreateContactProps,
  UpdateContactProps,
} from 'src/@types/contacts'
import axiosInstance from 'src/utils/axios'

export async function getContacts(payload: ContactsPayload): Promise<ContactsResponse[]> {
  const { data } = await axiosInstance.get<ContactsResponse[]>('/contacts', { params: payload })
  return data
}

export async function createContact(payload: CreateContactProps): Promise<ContactsResponse> {
  const body = { ...payload, phone: payload.phone || undefined }
  const { data } = await axiosInstance.post<ContactsResponse>('/contacts', body)
  return data
}

export async function updateContact({ id, ...payload }: UpdateContactProps) {
  const { data } = await axiosInstance.patch<ContactsResponse>(`/contacts/${id}`, payload)
  return data
}

export async function deleteContact(id: string) {
  const { data } = await axiosInstance.delete(`/contacts/${id}`)
  return data
}
