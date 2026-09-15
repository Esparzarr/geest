import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { DepartmentsService } from 'src/services/departments'
import { useDisclosure } from 'src/hooks/useDisclosure'
import { useFormik } from 'formik'
import type { CreateDepartmentPros, DepartmentsResponse } from 'src/@types/departments'
import { CreateDepartmentSchema } from 'src/schemas/Departmets'

const useHook = () => {
  const [departmentId, setDepartmentId] = useState<string>('')
  const [editDepartmentId, setEditDepartmentId] = useState<string>('')

  const { isOpen: isOpenCreate, onOpen: openCreate, onClose: onCloseCreate } = useDisclosure()
  const { isOpen: isOpenEdit, onOpen: openEdit, onClose: onCloseEdit } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: openDelete, onClose: onCloseDelete } = useDisclosure()

  const {
    data: departments,
    error: errorDepartments,
    isLoading: loadingDepartments,
    isFetching: loadingList,
  } = DepartmentsService.GetDepartments.useQuery({
    retry: false,
  })

  const isEmpty = !loadingList && departments?.length === 0

  const { mutate: onCreateDepartment, isPending: loadingCreateDepartment } =
    DepartmentsService.CreateDepartment.useMutation({
      retry: false,
    })

  const { mutate: onUpdateDepartment, isPending: loadingUpdateDepartment } =
    DepartmentsService.UpdateDepartment.useMutation({
      retry: false,
    })

  const { mutate: onDeleteDepartment, isPending: loadingDeleteDepartment } =
    DepartmentsService.DeleteDepartment.useMutation({
      retry: false,
    })

  useEffect(() => {
    if (errorDepartments) {
      enqueueSnackbar(errorDepartments?.message, {
        variant: 'warning',
      })
    }
  }, [errorDepartments])

  const departmentForm = useFormik<CreateDepartmentPros>({
    initialValues: {
      name: '',
    },
    validateOnMount: false,
    validationSchema: CreateDepartmentSchema,
    onSubmit: (values) => {
      if (editDepartmentId) {
        onUpdateDepartment(
          { id: editDepartmentId, name: values.name },
          {
            onSuccess() {
              handleCloseEdit()
            },
          },
        )
        return
      }

      onCreateDepartment(values, {
        onSuccess() {
          handleCloseCreate()
        },
      })
    },
  })

  const handleSelectEdit = (department: DepartmentsResponse) => {
    setEditDepartmentId(department.id)
    departmentForm.setValues({ name: department.name })
    openEdit()
  }

  const handleCloseEdit = () => {
    setEditDepartmentId('')
    departmentForm.resetForm()
    onCloseEdit()
  }

  const handleCloseCreate = () => {
    departmentForm.resetForm()
    onCloseCreate()
  }

  const handleSelectDelete = (id: string) => {
    setDepartmentId(id)
    openDelete()
  }

  const handleDelete = () => {
    onDeleteDepartment(departmentId, {
      onSuccess: () => {
        onCloseDelete()
      },
    })
  }

  return {
    loading:
      loadingDepartments ||
      loadingCreateDepartment ||
      loadingUpdateDepartment ||
      loadingDeleteDepartment,
    loadingList,
    isEmpty,
    departments,
    departmentForm,
    isOpenCreate,
    openCreate,
    handleCloseCreate,
    isOpenEdit,
    handleSelectEdit,
    handleCloseEdit,
    isOpenDelete,
    handleSelectDelete,
    onCloseDelete,
    handleDelete,
  }
}

export default useHook
