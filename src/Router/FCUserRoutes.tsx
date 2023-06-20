import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../Context/authContext'
import Navbar from '../Componets/Common/Navbar'

export const FCUserRoutes = () => {
  const auth = useAuth()
  const location = useLocation()
  if (auth.user && auth.user.FS === false) {
    return <Navigate to="/" state={{ path: location.pathname }} />
  }
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}
