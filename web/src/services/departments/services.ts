import type { DepartmentsResponse } from 'src/@types/departments'
import axiosInstance from 'src/utils/axios'

export async function getDepartment(): Promise<DepartmentsResponse[]> {
  const { data } = await axiosInstance.get<DepartmentsResponse[]>('/departments')
  return data
}
