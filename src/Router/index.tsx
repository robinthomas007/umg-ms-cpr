import React from 'react'
import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import Dashboard from '../Componets/Dashboard'
import Search from '../Componets/Search'
import Administration from '../Componets/Administration'
import { PublicRoutes } from './PublicRoutes'
import MyQueue from '../Componets/MyQueue'
import ProjectDetails from '../Componets/ProjectDetails';

function Routes() {
  let element = useRoutes([
    {
      element: <PublicRoutes />,
      children: [
        { path: '/', element: <Dashboard /> },
        { path: '/search', element: <Search /> },
        { path: '/admin', element: <Administration /> },
        { path: '/myqueue', element: <MyQueue /> },
        { path: '/Search/:projectId/:teamId', element: <ProjectDetails /> },
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
