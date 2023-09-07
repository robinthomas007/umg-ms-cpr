import React from 'react'
import { createContext, useState, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import getCookie from '../Componets/Common/cookie'
import { isSessionExpired } from '../Componets/Common/Utils'
import { BASE_URL } from './../App'
import axios from 'axios'

type AuthContextProps = {
  children: React.ReactNode
}
type userTypeProps = {
  name: string
  unique_name: string
  role: String
}
type Authype = {
  user: userTypeProps
  login: any
}

const AuthContext = createContext<Authype | any>(null)
export const AuthProvider = ({ children }: AuthContextProps) => {
  const token = getCookie('cpr_portal')
  let LoggedInUser: any = jwt_decode(token)
  const [user, setUser] = useState<any>(LoggedInUser || {})
  const [darkMode, setDarkMode] = useState<boolean>(true)
  const [updatedRole, setUpdatedRole] = useState<boolean>(false)

  const getUserRole = () => {
    return axios
      .get(BASE_URL + 'User/GetUser', {
        headers: {
          cpr_portal: token,
        },
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        return false
      })
  }
  React.useEffect(() => {
    getUserRole().then((res) => {
      if (res && res.length > 0) {
        setUser({ ...user, role: res[0].masterRole })
      }
    })
  }, [updatedRole])
  const login = (user: any) => {
    setUser(user)
  }
  return (
    <AuthContext.Provider value={{ user, login, darkMode, setDarkMode, updatedRole, setUpdatedRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
