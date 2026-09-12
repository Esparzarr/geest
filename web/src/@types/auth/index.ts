export interface LoginValues {
  username: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
}

export interface LoginResponse {
  access_token: string
  user: AuthUser
}
