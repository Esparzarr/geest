import axios, { type AxiosError } from 'axios'
import { store } from 'src/redux/store'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

// indexes: null serializa los arreglos como ?department=a&department=b
// En vez del ?department[]=a por defecto, que la API rechaza con 400
const axiosInstance = axios.create({
  baseURL: API_URL,
  paramsSerializer: { indexes: null },
})

const FALLBACK_MESSAGE = 'La acción no pudo completarse. Inténtalo nuevamente.'

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
    const message = error.response?.data?.message
    const text = Array.isArray(message) ? message[0] : message
    return Promise.reject(new Error(text ?? FALLBACK_MESSAGE))
  },
)

export default axiosInstance
