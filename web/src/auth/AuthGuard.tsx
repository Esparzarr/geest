import { Navigate, Outlet } from 'react-router'
import { selectIsAuthenticated } from 'src/redux/slices/user'
import { useSelector } from 'src/redux/store'
import { PATH_AUTH } from 'src/routes/paths'

export default function AuthGuard() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (!isAuthenticated) return <Navigate to={PATH_AUTH.login} replace />

  return <Outlet />
}
