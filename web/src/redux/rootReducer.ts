import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import userReducer from './slices/user'

const storage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
}

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
}

export const userPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
})

export default rootReducer
