import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PATH_DASHBOARD } from 'src/routes/paths'

export default function DepartmentsPage() {
  const navigate = useNavigate()

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
      </Stack>
    </Box>
  )
}
