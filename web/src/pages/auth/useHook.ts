import { useFormik } from 'formik'
import { useNavigate } from 'react-router'
import type { LoginValues } from 'src/@types/auth'
import { setReduxSession } from 'src/redux/slices/user'
import { useDispatch } from 'src/redux/store'
import { PATH_AFTER_LOGIN } from 'src/routes/paths'
import { loginSchema } from 'src/schemas/Auth'
import { AuthService } from 'src/services/auth'

const initialValues: LoginValues = { username: '', password: '' }

/** Toda la lógica de la vista: formulario, envío a la API y entrada al sistema. */
const useHook = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { mutate, isPending, error } = AuthService.Login.useMutation()

  const formik = useFormik<LoginValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: (response) => {
          dispatch(setReduxSession(response))
          navigate(PATH_AFTER_LOGIN, { replace: true })
        },
      })
    },
  })

  return {
    formik,
    isPending,
    error: error?.message ?? null,
  }
}

export default useHook
