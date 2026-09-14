import { lazy, Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router'
import AuthGuard from 'src/auth/AuthGuard'
import GuestGuard from 'src/auth/GuestGuard'
import { PATH_AFTER_LOGIN } from './paths'

const LoginPage = lazy(() => import('src/pages/auth/LoginPage'))
const DashboardPage = lazy(() => import('src/pages/dashboard/index'))
const DepartmentsPage = lazy(() => import('src/pages/dashboard/departments/index'))
const ContactsPage = lazy(() => import('src/pages/dashboard/contacts/index'))

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      ),
    },
    {
      path: 'dashboard',
      element: <AuthGuard />,
      children: [
        { index: true, element: <Navigate to={PATH_AFTER_LOGIN} replace /> },
        { path: 'inicio', element: <DashboardPage /> },
        { path: 'departamentos', element: <DepartmentsPage /> },
        { path: 'contactos', element: <ContactsPage /> },
      ],
    },
    // Cualquier otra ruta vuelve al inicio
    { path: '*', element: <Navigate to="/" replace /> },
  ])

  return <Suspense fallback={null}>{routes}</Suspense>
}
