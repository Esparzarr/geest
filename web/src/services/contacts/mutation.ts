import type { ApiClientError } from 'src/services/api/apiClient'
import { createContact, deleteContact, getContacts, updateContact } from './services'
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'
import type {
  ContactsPayload,
  ContactsResponse,
  CreateContactProps,
  UpdateContactProps,
} from 'src/@types/contacts'
import { enqueueSnackbar } from 'notistack'

const ContactsService = {
  GetContacts: {
    useQuery: (
      params: ContactsPayload,
      options?: Omit<UseQueryOptions<ContactsResponse[], ApiClientError>, 'queryKey' | 'queryFn'>,
    ) => {
      return useQuery({
        queryKey: ['contacts', JSON.stringify(params)],
        queryFn: () => getContacts(params),
        staleTime: 1000 * 60 * 5,
        ...options,
      })
    },
  },
  CreateContacts: {
    useMutation: (
      options?: UseMutationOptions<ContactsResponse, ApiClientError, CreateContactProps>,
    ) => {
      const queryClient = useQueryClient()
      return useMutation({
        ...options,
        mutationFn: createContact,
        onSuccess: (data, vars, result, ctx) => {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'contacts',
          })

          options?.onSuccess?.(data, vars, result, ctx)

          enqueueSnackbar('Contacto creado correctamente.')
        },
        onError: (error) => {
          enqueueSnackbar(error.message, {
            variant: 'warning',
          })
        },
      })
    },
  },
  UpdateContact: {
    useMutation: (
      options?: UseMutationOptions<ContactsResponse, ApiClientError, UpdateContactProps>,
    ) => {
      const queryClient = useQueryClient()
      return useMutation({
        ...options,
        mutationFn: updateContact,
        onSuccess: (data, vars, result, ctx) => {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'contacts',
          })

          options?.onSuccess?.(data, vars, result, ctx)

          enqueueSnackbar('Contacto actualizado correctamente.')
        },
        onError: (error) => {
          enqueueSnackbar(error.message, {
            variant: 'warning',
          })
        },
      })
    },
  },
  DeleteContact: {
    useMutation: (options?: UseMutationOptions<null, ApiClientError, string>) => {
      const queryClient = useQueryClient()
      return useMutation({
        ...options,
        mutationFn: deleteContact,
        onSuccess: (data, vars, result, ctx) => {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'contacts',
          })

          options?.onSuccess?.(data, vars, result, ctx)

          enqueueSnackbar('Contacto eliminado correctamente.')
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

export default ContactsService
