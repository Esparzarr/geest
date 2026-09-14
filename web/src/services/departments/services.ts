import type { CreateDepartmentPros, DepartmentsResponse } from 'src/@types/departments'
import axiosInstance from 'src/utils/axios'

export async function getDepartment(): Promise<DepartmentsResponse[]> {
  const { data } = await axiosInstance.get<DepartmentsResponse[]>('/departments')
  return data
}

export async function createDepartment(payload: CreateDepartmentPros): Promise<DepartmentsResponse> {
  const { data } = await axiosInstance.post<DepartmentsResponse>('/departments', payload)
  return data
}

export async function updateDepartment({ id, ...payload }: CreateDepartmentPros) {
  const { data } = await axiosInstance.patch<DepartmentsResponse>(`/departments/${id}`, payload)
  return data
}

export async function deleteDepartment(id: string) {
  const { data } = await axiosInstance.delete(`/departments/${id}`)
  return data
}
