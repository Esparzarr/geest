import * as Yup from 'yup'

export const loginSchema = Yup.object({
  username: Yup.string().trim().required('El usuario es obligatorio'),
  password: Yup.string().required('La contraseña es obligatoria'),
})
