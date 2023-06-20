import { Layout, Row, Col, Space, Button, Badge, Typography, Menu } from 'antd'
import './header.css'
import logo from '../../../images/cpr.png'
import retool from '../../../images/retro.png'
import guardian from '../../../images/guardian.png'
import cp3 from '../../../images/cp3.png'
import { BellFilled } from '@ant-design/icons'
import getAuthUser from '../../../utils/getAuthUser'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import React from 'react'
import type { MenuProps } from 'antd'
const { Header } = Layout
const { Text } = Typography

// type Items={ key?: string | null; label?: string; icon?: React.JSX.Element |undefined; path?: string; }

const items: MenuProps['items'] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
  },

  {
    key: 'search',
    label: 'Search',
  },
  {
    key: 'myQueue',
    label: 'My Queue',
  },
  {
    key: 'messageBoard',
    label: 'Message Board',
  },
  {
    key: 'tasking',
    label: 'Tasking',
  },
  {
    key: 'administration',
    label: 'Administration',
  },
  {
    key: 'knowledgeBase',
    label: 'Knowledge Base',
  },
]

export default function Navbar() {
  const user = getAuthUser()
  const [current, setCurrent] = useState('')
  const { pathname } = useLocation()

  const navigate = useNavigate()
  useEffect(() => {
    switch (pathname) {
      case '/':
        setCurrent('dashboard')
        break
      case '/search':
        setCurrent('search')
        break
      case '/myQueue':
        setCurrent('myQueue')
        break
      case '/tasking':
        setCurrent('tasking')
        break
      default:
        setCurrent('dashboard')
    }
  }, [pathname])

  const onClickMenu: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    switch (e.key) {
      case 'dashboard':
        navigate('/')
        break
      case 'search':
        navigate('/search')
        break

      default:
        navigate('/')
    }
  }

  return (
    <>
      <Header>
        <Row justify="space-between">
          <img src={logo} alt="logo" />
          <Col>
            <Space size={'large'}>
              <img src={guardian} height="32px" alt="guardian" />
              <img src={cp3} height="48px" alt="cp3" />
              <img src={retool} style={{ width: '74px', height: '16px' }} alt="Retool" />
            </Space>
          </Col>
          <Col>
            <Space size={'large'}>
              <Badge size="small" count={5}>
                <Button shape="circle" icon={<BellFilled />} />
              </Badge>
              <Text>Welcome, {user ? user.name : ''}</Text>
              <Text>{user ? 'Log Out' : 'Log In'}</Text>
            </Space>
          </Col>
        </Row>
      </Header>
      <Menu
        className="header-menu"
        onClick={onClickMenu}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        activeKey={current}
      />
    </>
  )
}
