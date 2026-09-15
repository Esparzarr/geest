import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ArrowLeft, Trash, UserRoundPen, Users } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PATH_DASHBOARD } from 'src/routes/paths'

import useHook from './useHook'
import {
  Chip,
  Skeleton,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material'
import Modal from 'src/components/modal'
import { ModalContacts } from './ModalContacts'

export default function ContactsPage() {
  const navigate = useNavigate()

  const {
    loading,
    department,
    handleToggleDepartment,
    search,
    handleSearch,
    contacts,
    loadingList,
    hasFilters,
    isEmpty,
    total,
    page,
    setPage,
    rowsPerPage,
    contactForm,
    isOpenCreate,
    openCreate,
    deparments,
    isOpenDelete,
    onCloseDelete,
    handleDelete,
    handleSelectDelete,
    isOpenEdit,
    handleSelectEdit,
    handleCloseEdit,
    handleCloseCreate,
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

        <Typography variant="h5">Contactos</Typography>

        <Button
          sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
          variant="outlined"
          onClick={openCreate}
        >
          Crear contacto
        </Button>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Buscador"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 100 } }}
          />
        </Grid>

        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          {deparments?.map((item) => {
            const selected = department.includes(item.id)
            return (
              <Chip
                key={item.id}
                label={item.name}
                onClick={() => handleToggleDepartment(item.id)}
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
              />
            )
          })}
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {loading ? 'Cargando...' : `${total} ${total === 1 ? 'contacto' : 'contactos'}`}
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Teléfono</TableCell>
                <TableCell align="center">Departamento</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingList ? (
                Array.from({ length: 3 }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <TableCell key={`skeleton-${rowIndex}-${cellIndex}`} align="center">
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isEmpty ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, border: 0 }}>
                    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Users size={40} color="#9e9e9e" />
                      <Typography variant="subtitle1">
                        {hasFilters
                          ? 'Sin resultados para estos filtros'
                          : 'Todavía no hay contactos'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {hasFilters
                          ? 'Prueba con otro nombre o quita algún departamento.'
                          : 'Crea el primero para empezar.'}
                      </Typography>
                      {!hasFilters && (
                        <Button
                          variant="outlined"
                          onClick={openCreate}
                          sx={{ textTransform: 'none', mt: 1 }}
                        >
                          Crear contacto
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                contacts?.map((row) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.phone ?? '--'}</TableCell>
                    <TableCell align="center">{row.department.name}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1}>
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
                ))
              )}
            </TableBody>
          </Table>

          {!isEmpty && (
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[rowsPerPage]}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          )}
        </TableContainer>
      </Stack>

      <ModalContacts
        open={isOpenCreate}
        onClose={handleCloseCreate}
        onSave={contactForm.handleSubmit}
        loading={loading}
        contactForm={contactForm}
        deparments={deparments || []}
        title="Creación de contacto"
        titleSaveButton="Guardar"
      />

      <ModalContacts
        open={isOpenEdit}
        onClose={handleCloseEdit}
        onSave={contactForm.handleSubmit}
        loading={loading}
        contactForm={contactForm}
        deparments={deparments || []}
        title="Edición de contacto"
        titleSaveButton="Actualizar"
      />

      <Modal
        open={isOpenDelete}
        onClose={onCloseDelete}
        onSave={handleDelete}
        title="Eliminación de contacto"
        titleCloseButton="Cancelar"
        titleSaveButton="Confirmar"
        colorCloseButton="inherit"
        colorSaveButton="success"
        disabled={loading}
      >
        <Typography>¿Estas seguro de eliminar el contacto?</Typography>
      </Modal>
    </Box>
  )
}
