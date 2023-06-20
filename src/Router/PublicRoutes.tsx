import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Componets/Common/Navbar'

export const PublicRoutes = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}
