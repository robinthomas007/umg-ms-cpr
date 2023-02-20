import React from 'react'
import { createContext, useState, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import getCookie from '../Components/Common/cookie'

const AuthContext = createContext(null)
export const AuthProvider = ({ children }) => {
  const token = getCookie('cp3_auth')
  let LoggedInUser = jwt_decode(token)
  setTimeout(() => {
    alert('Session timed out!')
    window.location.reload()
  }, LoggedInUser.exp)
  const [user, setUser] = useState(LoggedInUser || {})
  const login = (user) => {
    setUser(user)
  }
  return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
