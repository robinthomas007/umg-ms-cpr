import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Componets/Common/Navbar'

export const PublicRoutes = () => {
  return (
    <div>
      <Navbar />
      <div className='cpr-layout-inside'>
        <Outlet />
      </div>
    </div>
  )
}
