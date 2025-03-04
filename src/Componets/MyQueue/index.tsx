import React, { useEffect, useState } from 'react'

import type { MenuProps } from 'antd'
import { Typography, Menu } from 'antd'
import NotificationsPage from './Notifications/notificationsPage'
import TasksPage from './Tasks/myTasksPage'

import { useLocation } from 'react-router-dom'

const { Title } = Typography

function MyQueue() {
  const [current, setCurrent] = useState('notifications')
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type')

  useEffect(() => {
    let activePage = type === 'notifications' ? 'notifications' : 'tasks'
    setCurrent(activePage)
  }, [type])
  const items: MenuProps['items'] = [
    {
      label: 'Notifications',
      key: 'notifications',
    },
    {
      label: 'My Tasks/Projects',
      key: 'tasks',
    },
  ]

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
  }

  return (
    <div className="search-wrapper">
      <Title>My Queue</Title>
      <Menu className="admin-menu" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      {current === 'notifications' && <NotificationsPage />}
      {current === 'tasks' && <TasksPage />}
    </div>
  )
}

export default MyQueue
