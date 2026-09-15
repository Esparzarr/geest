import axios, { type AxiosError } from 'axios'
import { store } from 'src/redux/store'
import { setClearSession } from 'src/redux/slices/user'
import { enqueueSnackbar } from 'notistack'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

// indexes: null serializa los arreglos como ?department=a&department=b
// En vez del ?department[]=a por defecto, que la API rechaza con 400
const axiosInstance = axios.create({
  baseURL: API_URL,
  paramsSerializer: { indexes: null },
  timeout: 15000,
})

const FALLBACK_MESSAGE = 'La acción no pudo completarse. Inténtalo nuevamente.'
const OFFLINE_MESSAGE = 'Sin conexión. Revisa tu internet e inténtalo de nuevo.'
const SESSION_MESSAGE = 'Tu sesión expiró. Inicia sesión de nuevo.'

// El token sale de Redux, así que basta con iniciar sesión para que viaje en cada petición
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = store.getState().user
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

// La API manda el mensaje como texto, o como lista cuando falla la validación.
// Aquí se deja siempre un Error con un mensaje legible, para que las vistas solo lean error.message.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    if (!error.response) return Promise.reject(new Error(OFFLINE_MESSAGE))

    // El token venció o no vale: se limpia la sesión y el guard manda al login,
    // en vez de dejar al usuario en una vista que solo responde 401.
    // El aviso se lanza aquí y no en las vistas porque el guard puede desmontarlas antes.
    if (error.response.status === 401) {
      // Al cargar fallan varias peticiones a la vez: solo la primera encuentra sesión
      if (store.getState().user.accessToken) {
        store.dispatch(setClearSession())
        enqueueSnackbar(SESSION_MESSAGE, { variant: 'warning' })
      }
      return Promise.reject(new Error(SESSION_MESSAGE))
    }

    const message = error.response.data?.message
    const text = Array.isArray(message) ? message[0] : message
    return Promise.reject(new Error(text ?? FALLBACK_MESSAGE))
  },
)

export default axiosInstance
