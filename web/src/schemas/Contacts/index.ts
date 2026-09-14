import * as Yup from 'yup'
import { emailValid } from 'src/utils/validations'

export const CreateContactSchema = () =>
  Yup.object().shape({
    name: Yup.string()
      .required('Este campo es requerido')
      .max(100, 'El nombre no puede superar más de 100 caracteres'),
    email: Yup.string()
      .required('Este campo es requerido')
      .test('email-valido', function emailTest(value) {
        if (!value) return this.createError({ message: 'Este campo es requerido' })

        const isValid = emailValid.test(value)

        if (!isValid) {
          return this.createError({
            message: 'El formato del correo electrónico no es válido',
          })
        }

        return true
      }),
    phone: Yup.string().matches(/^\d{10}$/, {
      message: 'El teléfono debe tener 10 dígitos',
      excludeEmptyString: true,
    }),
    department: Yup.string().required('Este campo es requerido'),
  })

export type CreateContactValues = Yup.InferType<ReturnType<typeof CreateContactSchema>>
