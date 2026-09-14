import { TextField } from '@mui/material'
import type { FormikProps } from 'formik'
import Modal from 'src/components/modal'
import type { CreateDepartmentPros } from 'src/@types/departments'

interface Props {
  open: boolean
  onClose: () => void
  onSave: () => void
  loading: boolean
  departmentForm: FormikProps<CreateDepartmentPros>
  title: string
  titleSaveButton: string
}

export const ModalDepartments = ({
  onClose,
  onSave,
  open,
  loading,
  departmentForm,
  title,
  titleSaveButton,
}: Props) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      onSave={onSave}
      title={title}
      titleCloseButton="Cancelar"
      titleSaveButton={titleSaveButton}
      colorCloseButton="inherit"
      colorSaveButton="success"
      disabled={loading || !departmentForm.isValid}
    >
      <TextField
        required
        fullWidth
        size="small"
        label="Nombre"
        name="name"
        value={departmentForm.values.name}
        onChange={departmentForm.handleChange}
        error={Boolean(departmentForm.errors.name)}
        helperText={departmentForm.errors.name}
      />
    </Modal>
  )
}
