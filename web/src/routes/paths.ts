function path(root: string, sublink: string) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/'
const ROOTS_DASHBOARD = '/dashboard'

export const PATH_AUTH = {
  login: ROOTS_AUTH,
}

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  inicio: path(ROOTS_DASHBOARD, '/inicio'),
  departamentos: path(ROOTS_DASHBOARD, '/departamentos'),
  contactos: path(ROOTS_DASHBOARD, '/contactos'),
}

export const PATH_AFTER_LOGIN = PATH_DASHBOARD.inicio
