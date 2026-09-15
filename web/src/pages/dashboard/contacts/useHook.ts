import { useEffect, useState } from 'react'
import { ContactsService } from 'src/services/contacts'
import { enqueueSnackbar } from 'notistack'
import { useFormik } from 'formik'
import type { ContactsResponse, CreateContactProps } from 'src/@types/contacts'
import { CreateContactSchema } from 'src/schemas/Contacts'
import { useDisclosure } from 'src/hooks/useDisclosure'
import { DepartmentsService } from 'src/services/departments'

const ROWS_PER_PAGE = 10

const useHook = () => {
  const [search, setSearch] = useState<string>('')
  const [searchDebounced, setSearchDebounced] = useState<string>('')
  const [department, setDepartment] = useState<string[]>([])
  const [contactId, setContactId] = useState<string>('')
  const [editContactId, setEditContactId] = useState<string>('')
  const [page, setPage] = useState<number>(0)

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const { isOpen: isOpenCreate, onOpen: openCreate, onClose: onCloseCreate } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: openDelete, onClose: onCloseDelete } = useDisclosure()
  const { isOpen: isOpenEdit, onOpen: openEdit, onClose: onCloseEdit } = useDisclosure()

  const {
    data: contactsPage,
    error: errorContacts,
    // Solo la primera carga: las siguientes conservan la página anterior en pantalla
    isLoading: loadingList,
  } = ContactsService.GetContacts.useQuery(
    {
      department: department,
      search: searchDebounced,
      limit: ROWS_PER_PAGE,
      offset: page * ROWS_PER_PAGE,
    },
    {
      retry: false,
    },
  )

  const contacts = contactsPage?.data
  const total = contactsPage?.total ?? 0

  const hasFilters = searchDebounced !== '' || department.length > 0
  const isEmpty = !loadingList && contacts?.length === 0

  const { mutate: onCreateContact, isPending: loadingCreateContact } =
    ContactsService.CreateContacts.useMutation({
      retry: false,
    })

  const { mutate: onUpdateContact, isPending: loadingUpdateContact } =
    ContactsService.UpdateContact.useMutation({
      retry: false,
    })

  const { mutate: onDeleteContact, isPending: loadingDeleteContact } =
    ContactsService.DeleteContact.useMutation({
      retry: false,
    })

  const {
    data: deparments,
    error: errorDeparments,
    isLoading: loadingDeparments,
  } = DepartmentsService.GetDepartments.useQuery({
    retry: false,
  })

  useEffect(() => {
    if (errorContacts) {
      enqueueSnackbar(errorContacts?.message, {
        variant: 'warning',
      })
    }
  }, [errorContacts])

  useEffect(() => {
    if (errorDeparments) {
      enqueueSnackbar(errorDeparments?.message, {
        variant: 'warning',
      })
    }
  }, [errorDeparments])

  const contactForm = useFormik<CreateContactProps>({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      department: '',
    },
    validateOnMount: false,
    validationSchema: CreateContactSchema,
    onSubmit: (values) => {
      if (editContactId) {
        onUpdateContact(
          { id: editContactId, ...values, phone: values.phone || null },
          {
            onSuccess() {
              handleCloseEdit()
            },
          },
        )
        return
      }

      onCreateContact(values, {
        onSuccess() {
          handleCloseCreate()
        },
      })
    },
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  // Un chip agrega o quita su departamento de la selección
  const handleToggleDepartment = (id: string) => {
    setDepartment((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
    setPage(0)
  }

  const handleSelectEdit = (contact: ContactsResponse) => {
    setEditContactId(contact.id)
    contactForm.setValues({
      name: contact.name,
      email: contact.email,
      phone: contact.phone ?? '',
      department: contact.department.id,
    })
    openEdit()
  }

  const handleCloseEdit = () => {
    setEditContactId('')
    contactForm.resetForm()
    onCloseEdit()
  }

  const handleCloseCreate = () => {
    contactForm.resetForm()
    onCloseCreate()
  }

  const handleSelectDelete = (id: string) => {
    setContactId(id)
    openDelete()
  }

  const handleDelete = () => {
    onDeleteContact(contactId, {
      onSuccess: () => {
        // Si era el único de la página, esta quedaría vacía: se retrocede una
        if (contacts?.length === 1 && page > 0) setPage(page - 1)
        onCloseDelete()
      },
    })
  }

  return {
    loadingList,
    hasFilters,
    isEmpty,
    total,
    page,
    setPage,
    rowsPerPage: ROWS_PER_PAGE,
    loading:
      loadingList ||
      loadingCreateContact ||
      loadingUpdateContact ||
      loadingDeparments ||
      loadingDeleteContact,
    search,
    handleSearch,
    department,
    setDepartment,
    handleToggleDepartment,
    contacts,
    contactForm,
    isOpenCreate,
    openCreate,
    onCloseCreate,
    deparments,
    isOpenDelete,
    openDelete,
    onCloseDelete,
    onDeleteContact,
    handleDelete,
    contactId,
    handleSelectDelete,
    isOpenEdit,
    handleSelectEdit,
    handleCloseEdit,
    handleCloseCreate,
    editContactId,
  }
}

export default useHook
