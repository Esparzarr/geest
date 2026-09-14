import { Building2, Users } from 'lucide-react'
import { useNavigate } from 'react-router'
import { selectUser, setClearSession } from 'src/redux/slices/user'
import { useDispatch, useSelector } from 'src/redux/store'
import { PATH_DASHBOARD } from 'src/routes/paths'

const opciones = [
  {
    titulo: 'Departamentos',
    descripcion: 'Crear, editar y listar los departamentos',
    path: PATH_DASHBOARD.departamentos,
    Icono: Building2,
  },
  {
    titulo: 'Contactos',
    descripcion: 'Crear contactos y filtrarlos por nombre o departamento',
    path: PATH_DASHBOARD.contactos,
    Icono: Users,
  },
]

const useHook = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)

  const logout = () => dispatch(setClearSession())

  const abrir = (path: string) => navigate(path)

  return { user, opciones, abrir, logout }
}

export default useHook
