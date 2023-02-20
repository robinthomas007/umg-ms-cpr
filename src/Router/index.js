import React from 'react'
import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoutes'
import { PublicRoutes } from './PublicRoutes'

function Routes() {
  let element = useRoutes([
    {
      element: <ProtectedRoutes />,
      children: [{ path: '/dashboard', element: <div>Dashboard</div> }],
    },
    {
      element: <PublicRoutes />,
      children: [
        {
          path: '/',
          element: (
            <div>
              <h1>Welcome to CPR</h1>
            </div>
          ),
        },
      ],
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
