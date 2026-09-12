import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useHook from './useHook'

export default function LoginPage() {
  const { formik, isPending, error, user } = useHook()

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
      <Paper
        component="form"
        onSubmit={formik.handleSubmit}
        variant="outlined"
        sx={{ width: '100%', maxWidth: 380, p: 4 }}
      >
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h5">Geest</Typography>
            <Typography variant="body2" color="text.secondary">
              Inicia sesión para continuar
            </Typography>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}
          {user && <Alert severity="success">Hola, {user.username}</Alert>}

          <TextField
            name="username"
            label="Usuario"
            size="small"
            fullWidth
            autoFocus
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          <TextField
            name="password"
            label="Contraseña"
            type="password"
            size="small"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button type="submit" variant="contained" size="large" fullWidth disabled={isPending}>
            {isPending ? 'Entrando…' : 'Entrar'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
