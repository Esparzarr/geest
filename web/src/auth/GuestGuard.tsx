import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { selectIsAuthenticated } from 'src/redux/slices/user'
import { useSelector } from 'src/redux/store'
import { PATH_AFTER_LOGIN } from 'src/routes/paths'

export default function GuestGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (isAuthenticated) return <Navigate to={PATH_AFTER_LOGIN} replace />

  return <>{children}</>
}
