import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  // Expone el theme como CSS custom properties, para poder leerlo desde Tailwind.
  cssVariables: true,
  palette: {
    primary: { main: '#2563eb' },
  },
  shape: { borderRadius: 8 },
})
