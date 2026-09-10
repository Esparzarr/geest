import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { UserPlus } from 'lucide-react'

function App() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'grey.50',
      }}
    >
      <Stack spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant="h5">Contacts</Typography>
        <TextField label="Nombre" size="small" fullWidth />
        <TextField label="Email" type="email" size="small" fullWidth />
        <Button variant="contained" startIcon={<UserPlus size={16} />}>
          Agregar contacto
        </Button>
      </Stack>
    </Box>
  )
}

export default App
