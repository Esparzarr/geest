import * as Yup from 'yup'

export const CreateDepartmentSchema = () =>
  Yup.object().shape({
    name: Yup.string()
      .required('Este campo es requerido')
      .max(50, 'El nombre no puede superar más de 50 caracteres'),
  })

export type CreateDepartmentValues = Yup.InferType<ReturnType<typeof CreateDepartmentSchema>>
