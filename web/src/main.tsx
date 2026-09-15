import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from 'src/redux/store'
import App from './App.tsx'
import { theme } from './theme.ts'

// Por defecto React Query pausa las mutaciones si el navegador está sin conexión:
// no lanza la petición ni el onError, así que el botón se queda esperando para siempre.
// Con 'always' siempre se intenta, falla, y el usuario ve el error.
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { networkMode: 'always' },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={3}
              preventDuplicate
              autoHideDuration={4000}
              variant="success"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </SnackbarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
