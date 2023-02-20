import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../Context/authContext'

export const ProtectedRoutes = () => {
  const auth = useAuth()
  const location = useLocation()
  if (auth.user && auth.user.role !== 'admin') {
    return <Navigate to="/" state={{ path: location.pathname }} />
  }
  return (
    <div>
      <Outlet />
    </div>
  )
}
