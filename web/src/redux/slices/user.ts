import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LoginResponse } from 'src/@types/auth'
import { initialState, type UserState } from 'src/@types/user'

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setReduxSession(state, action: PayloadAction<LoginResponse>) {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.accessToken = action.payload.access_token
    },
    setClearSession(state) {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
    },
  },
})

// Actions
export const { setReduxSession, setClearSession } = slice.actions

// Selectors
export const selectUserState = (state: { user: UserState }) => state.user
export const selectUser = (state: { user: UserState }) => state.user.user
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated
export const selectAccessToken = (state: { user: UserState }) => state.user.accessToken

export default slice.reducer
