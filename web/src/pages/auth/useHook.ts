import { useFormik } from 'formik'
import type { LoginValues } from 'src/@types/auth'
import { selectUser, setReduxSession } from 'src/redux/slices/user'
import { useDispatch, useSelector } from 'src/redux/store'
import { loginSchema } from 'src/schemas/Auth'
import { AuthService } from 'src/services/auth'

const initialValues: LoginValues = { username: '', password: '' }

const useHook = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const { mutate, isPending, error } = AuthService.Login.useMutation()

  const formik = useFormik<LoginValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: (response) => dispatch(setReduxSession(response)),
      })
    },
  })

  return {
    formik,
    isPending,
    error: error?.message ?? null,
    user,
  }
}

export default useHook
