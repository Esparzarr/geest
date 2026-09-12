import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { LoginResponse, LoginValues } from 'src/@types/auth'
import type { ApiClientError } from 'src/services/api/apiClient'
import { login } from './services'

const AuthService = {
  Login: {
    useMutation: (options?: UseMutationOptions<LoginResponse, ApiClientError, LoginValues>) =>
      useMutation({ ...options, mutationFn: login }),
  },
}

export default AuthService
