import type { LoginResponse, LoginValues } from 'src/@types/auth'
import axiosInstance from 'src/utils/axios'

export async function login(values: LoginValues): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>('/auth/login', values)
  return data
}
