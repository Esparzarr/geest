import { Grid, MenuItem, TextField } from '@mui/material'
import type { FormikProps } from 'formik'
import type { DepartmentsResponse } from 'src/@types/departments'
import Modal from 'src/components/modal'
import type { CreateContactProps } from 'src/@types/contacts'

interface Props {
  open: boolean
  onClose: () => void
  onSave: () => void
  loading: boolean
  contactForm: FormikProps<CreateContactProps>
  deparments: DepartmentsResponse[]
  title: string
  titleSaveButton: string
}
export const ModalContacts = ({
  onClose,
  onSave,
  open,
  loading,
  contactForm,
  deparments,
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
      disabled={loading || !contactForm.isValid}
    >
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            size="small"
            label="Nombre"
            name="name"
            value={contactForm.values.name}
            onChange={contactForm.handleChange}
            error={Boolean(contactForm.errors.name)}
            helperText={contactForm.errors.name}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            size="small"
            label="Email"
            name="email"
            value={contactForm.values.email}
            onChange={contactForm.handleChange}
            error={Boolean(contactForm.errors.email)}
            helperText={contactForm.errors.email}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Teléfono"
            name="phone"
            value={contactForm.values.phone}
            onChange={contactForm.handleChange}
            error={Boolean(contactForm.errors.phone)}
            helperText={contactForm.errors.phone}
            slotProps={{
              htmlInput: {
                onKeyPress: (
                  event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
                ) => {
                  if (!/^[0-9]+$/.test(event.key)) {
                    event.preventDefault()
                  }
                },
                maxLength: 10,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            required
            fullWidth
            size="small"
            label="Departamento"
            name="department"
            value={contactForm.values.department}
            onChange={contactForm.handleChange}
            error={Boolean(contactForm.errors.department)}
            helperText={contactForm.errors.department}
          >
            <MenuItem value="" disabled>
              Selecciona una opción
            </MenuItem>
            {deparments?.map((item, index) => (
              <MenuItem value={item?.id} key={`${index}-${item.id}`}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Modal>
  )
}
