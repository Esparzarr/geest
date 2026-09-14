import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { LogOut } from 'lucide-react'
import useHook from './useHook'

export default function DashboardPage() {
  const { user, opciones, abrir, logout } = useHook()

  return (
    <Box component="main" sx={{ minHeight: '100dvh', bgcolor: 'grey.50', p: 3 }}>
      <Stack spacing={4} sx={{ maxWidth: 900, mx: 'auto' }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5">Panel</Typography>
            <Typography variant="body2" color="text.secondary">
              Hola, {user?.username}
            </Typography>
          </Stack>

          <Button variant="outlined" onClick={logout} startIcon={<LogOut size={16} />}>
            Cerrar sesión
          </Button>
        </Stack>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {opciones.map(({ titulo, descripcion, path, Icono }) => (
            <Card key={path} variant="outlined">
              <CardActionArea onClick={() => abrir(path)} sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      p: 1.5,
                      borderRadius: 2,
                      color: 'primary.main',
                      bgcolor: 'action.hover',
                    }}
                  >
                    <Icono size={22} />
                  </Box>

                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1">{titulo}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {descripcion}
                    </Typography>
                  </Stack>
                </Stack>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Stack>
    </Box>
  )
}
