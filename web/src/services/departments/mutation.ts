import type { ApiClientError } from 'src/services/api/apiClient'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { DepartmentsResponse } from 'src/@types/departments'
import { getDepartment } from './services'

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
}

export default DepartmentsService
