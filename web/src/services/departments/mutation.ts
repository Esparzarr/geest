import type { ApiClientError } from 'src/services/api/apiClient'
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'
import type { CreateDepartmentPros, DepartmentsResponse } from 'src/@types/departments'
import { createDepartment, deleteDepartment, getDepartment, updateDepartment } from './services'
import { enqueueSnackbar } from 'notistack'

const DepartmentsService = {
  GetDepartments: {
    useQuery: (
      options?: Omit<
        UseQueryOptions<DepartmentsResponse[], ApiClientError>,
        'queryKey' | 'queryFn'
      >,
    ) => {
      return useQuery({
        queryKey: ['departments'],
        queryFn: getDepartment,
        staleTime: 1000 * 60 * 5,
        ...options,
      })
    },
  },
  CreateDepartment: {
    useMutation: (
      options?: UseMutationOptions<DepartmentsResponse, ApiClientError, CreateDepartmentPros>,
    ) => {
      const queryClient = useQueryClient()
      return useMutation({
        ...options,
        mutationFn: createDepartment,
        onSuccess: (data, vars, result, ctx) => {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'departments',
          })

          options?.onSuccess?.(data, vars, result, ctx)

          enqueueSnackbar('Departamento creado correctamente.')
        },
        onError: (error) => {
          enqueueSnackbar(error.message, {
            variant: 'warning',
          })
        },
      })
    },
  },
  UpdateDepartment: {
    useMutation: (
      options?: UseMutationOptions<DepartmentsResponse, ApiClientError, CreateDepartmentPros>,
    ) => {
      const queryClient = useQueryClient()
      return useMutation({
        ...options,
        mutationFn: updateDepartment,
        onSuccess: (data, vars, result, ctx) => {
          queryClient.invalidateQueries({
            predicate: (query) =>
              query.queryKey[0] === 'departments' || query.queryKey[0] === 'contacts',
          })

          options?.onSuccess?.(data, vars, result, ctx)

          enqueueSnackbar('Departamento actualizado correctamente.')
        },
        onError: (error) => {
          enqueueSnackbar(error.message, {
            variant: 'warning',
          })
        },
      })
    },
  },
  DeleteDepartment: {
    useMutation: (options?: UseMutationOptions<null, ApiClientError, string>) => {
      const queryClient = useQueryClient()
      return useMutation({
        ...options,
        mutationFn: deleteDepartment,
        onSuccess: (data, vars, result, ctx) => {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'departments',
          })

          options?.onSuccess?.(data, vars, result, ctx)

          enqueueSnackbar('Departamento eliminado correctamente.')
        },
        onError: (error) => {
          enqueueSnackbar(error.message, {
            variant: 'warning',
          })
        },
      })
    },
  },
}

export default DepartmentsService
