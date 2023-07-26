import React from 'react'
import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoutes'
// import Policy from '../Components/Policy';
import Dashboard from '../Componets/Dashboard'
import Search from '../Componets/Search'
import Administration from '../Componets/Administration'
import Sidebar from '../Componets/Sidebar'
import { PublicRoutes } from './PublicRoutes'
import { FCUserRoutes } from './FCUserRoutes'
// import GreenList from '../Components/GreenList';
// import FirstSeen from '../Components/FirstSeen';

function Routes() {
  let element = useRoutes([
    {
      element: <ProtectedRoutes />,
      children: [{ path: '/policy', element: <Search /> }],
    },
    {
      element: <PublicRoutes />,
      children: [
        { path: '/', element: <Dashboard /> },
        { path: '/Search', element: <Search /> },
        { path: '/admin', element: <Administration /> },
      ],
    },
    {
      element: <FCUserRoutes />,
      children: [{ path: '/first_seen', element: <Search /> }],
    },
  ])
  return element
}

const Router = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes />
    </Suspense>
  )
}

export default Router
