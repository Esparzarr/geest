import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { ArrowLeft, Trash, UserRoundPen } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PATH_DASHBOARD } from 'src/routes/paths'
import useHook from './useHok'
import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material'
import Modal from 'src/components/modal'
import { ModalDepartments } from './ModalDepartments'

export default function DepartmentsPage() {
  const navigate = useNavigate()
  const {
    departments,
    loading,
    loadingList,
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
  } = useHook()

  return (
    <Box component="main" sx={{ minHeight: '100dvh', bgcolor: 'grey.50', p: 3 }}>
      <Stack spacing={3} sx={{ maxWidth: 900, mx: 'auto' }}>
        <Button
          variant="text"
          onClick={() => navigate(PATH_DASHBOARD.inicio)}
          startIcon={<ArrowLeft size={16} />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Volver al panel
        </Button>

        <Typography variant="h5">Departamentos</Typography>

        <Button
          sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
          variant="outlined"
          onClick={openCreate}
        >
          Crear departamento
        </Button>

        <Typography variant="body2" color="text.secondary">
          {loading
            ? 'Cargando...'
            : `${departments?.length ?? 0} ${departments?.length === 1 ? 'departamento' : 'departamentos'}`}
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingList
                ? Array.from({ length: 3 }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-${rowIndex}`}>
                      {Array.from({ length: 2 }).map((__, cellIndex) => (
                        <TableCell key={`skeleton-${rowIndex}-${cellIndex}`} align="center">
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : departments?.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ justifyContent: 'center', display: 'flex' }}
                        >
                          <Button
                            startIcon={<UserRoundPen size={16} />}
                            color="primary"
                            onClick={() => handleSelectEdit(row)}
                          >
                            Editar
                          </Button>
                          <Button
                            startIcon={<Trash size={16} />}
                            color="error"
                            onClick={() => handleSelectDelete(row.id)}
                          >
                            Eliminar
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <ModalDepartments
        open={isOpenCreate}
        onClose={handleCloseCreate}
        onSave={departmentForm.handleSubmit}
        loading={loading}
        departmentForm={departmentForm}
        title="Creación de departamento"
        titleSaveButton="Crear"
      />

      <ModalDepartments
        open={isOpenEdit}
        onClose={handleCloseEdit}
        onSave={departmentForm.handleSubmit}
        loading={loading}
        departmentForm={departmentForm}
        title="Edición de departamento"
        titleSaveButton="Actualizar"
      />

      <Modal
        open={isOpenDelete}
        onClose={onCloseDelete}
        onSave={handleDelete}
        title="Eliminación de departamento"
        titleCloseButton="Cancelar"
        titleSaveButton="Confirmar"
        colorCloseButton="inherit"
        colorSaveButton="success"
        disabled={loading}
      >
        <Typography>¿Estas seguro de eliminar el departamento?</Typography>
      </Modal>
    </Box>
  )
}
