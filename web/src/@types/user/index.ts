import type { AuthUser } from 'src/@types/auth'

export interface UserState {
  isAuthenticated: boolean
  user: AuthUser | null
  accessToken: string | null
}

export const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
}
