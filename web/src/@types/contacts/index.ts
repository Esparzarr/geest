export interface ContactsPayload {
  search?: string
  department?: string[]
}

export interface ContactsResponse {
  id: string
  name: string
  email: string
  phone?: string
  department: Department
  createdAt: string
  updatedAt: string
}

export interface Department {
  id: string
  name: string
}

export interface UpdateContactProps {
  id: string
  name?: string
  email?: string
  phone?: string | null
  department?: string
}

export interface CreateContactProps {
  name: string
  email: string
  phone?: string
  department: string
}
