import { Layout, Row, Col, Space, Button, Badge, Typography, Menu, Switch } from 'antd'
import './header.css'
import { BASE_URL } from '../../../App'
import getCookie from '../cookie'
import { config } from '../../../Componets/Common/Utils'
import axios from 'axios'
import logo from '../../../images/cpr.png'
import retool from '../../../images/retro.png'
import guardian from '../../../images/guardian.png'
import cp3 from '../../../images/cp3.png'
import { BellFilled } from '@ant-design/icons'
import getAuthUser from '../../../utils/getAuthUser'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../Context/authContext'
import React from 'react'
import { getApi, postApi } from '../../../Api/Api'
import type { MenuProps } from 'antd'
import moment from 'moment'
const { Header } = Layout
const { Text } = Typography

// type Items={ key?: string | null; label?: string; icon?: React.JSX.Element |undefined; path?: string; }
const hexArray = ['#FDD981', '#F88E86', '#F57F17', '#FBC02D']
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
    key: 'myqueue',
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
  const { setDarkMode, darkMode } = useAuth()
  const [current, setCurrent] = useState('')
  const { pathname } = useLocation()
  const [toggle, setToggle] = useState(false)
  const [notifications, setNotifications] = useState<any>([])
  const [showNoti, setShowNoti] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setDarkMode(toggle)
  }, [toggle])

  useEffect(() => {
    getAllNotifications()
    const interval = setInterval(() => {
      getAllNotifications()
    }, 60000)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      clearInterval(interval)
    }
  }, [])

  const navigate = useNavigate()

  useEffect(() => {
    const pathSegments = pathname.split('/');
    switch (pathSegments[1]) {
      case '':
        setCurrent('dashboard')
        break
      case 'search':
        setCurrent('search')
        break
      case 'myqueue':
        setCurrent('myqueue')
        break
      case 'admin':
        setCurrent('administration')
        break
      case 'tasking':
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
      case 'administration':
        navigate('/admin')
        break
      case 'myqueue':
        navigate('/myqueue')
        break

      default:
        navigate('/')
    }
  }
  const onChange = (checked: boolean) => {
    setToggle(checked)
    // handleThemeColor(checked)
  }

  const openNotification = () => {
    if (notifications.length > 0) setShowNoti(!showNoti)
  }
  const clearNotification = () => {
    setNotifications([])
    setShowNoti(false)
    // setLoading(true)
    axios
      .get(BASE_URL + 'Notification/ClearNotification', {
        headers: {
          cp3_auth: getCookie('cp3_auth'),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          getAllNotifications()
        }
      })
      .catch((err) => {
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleClickOutside = (event: any) => {
    const elem = document.querySelector('.notification-wrapper-div')
    if (
      elem &&
      !elem.contains(event.target) &&
      event.target.id !== 'notify-wrapper' &&
      event.target.parentElement.id !== 'notify-wrapper'
    ) {
      if (document.querySelector('.notification-wrapper')) {
        setShowNoti(false)
        event.preventDefault()
      }
    }
  }

  const getAllNotifications = () => {
    setLoading(true)
    getApi({}, '/notification/getunreadnotification')
      .then((res) => {
        setNotifications(res)
      })
      .catch((error) => {
        console.log('error feching data', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getAlias = (name: any) => {
    if (name) {
      const nameArr = name.split(' ')
      return nameArr[0].charAt().toUpperCase() + nameArr[1].charAt().toUpperCase()
    }
    return 'UK'
  }

  const naviagetNotificationPage = (source: string, notificationId: string, isRead: boolean) => {
    !isRead && markAsRead(Number(notificationId), source)
    switch (source) {
      case 'Projects':
        navigate('/search', {
          state: { notificationId: notificationId },
          replace: true,
        })
        break
      case 'GL':
        navigate('/green_list', {
          state: { notificationId: notificationId },
          replace: true,
        })
        break
      case 'CP3':
        navigate('/', {
          state: { notificationId: notificationId },
          replace: true,
        })
        break
      default:
        navigate('/', {
          state: { notificationId: notificationId },
          replace: true,
        })
    }
    setShowNoti(false)
  }

  const markAsRead = (id: number, source: string) => {
    // mark as read api on hold for client verification
    postApi({ notificationId: id }, '/notification/readnotification', 'marked as read nottification').then((res) => {
      console.log('response', res)
    })
  }

  const renderNotifications = () => {
    return notifications.map((noti: any, i) => {
      return (
        <div key={i} className={`${noti.isRead ? 'read' : ''} noti-item`}>
          <div className="alias">
            <span
              style={{
                background: hexArray[Math.floor(Math.random() * hexArray.length)],
              }}
            >
              {' '}
              {getAlias(noti.userName)}
            </span>
          </div>
          <div
            className="noti-content"
            onClick={() => naviagetNotificationPage(noti.source, noti.notificationId, noti.isRead)}
          // onMouseEnter={() => !noti.isRead && markAsRead(noti.notificationId, noti.source)}
          >
            {noti.notificationType.toLowerCase() === 'created' && (
              <>
                <strong>{noti.userName}</strong> {noti.notificationType.toLowerCase()} a new{' '}
                {noti.source === 'Projects' ? 'project' : noti.source === 'CP3' ? 'CP3' : 'Greenlist'} of{' '}
                <strong>"{noti.projectName}"</strong> and assigned it to {noti.teamName}
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
            {noti.notificationType.toLowerCase() === 'updated' && (
              <>
                <strong>{noti.userName}</strong> {noti.notificationType.toLowerCase()} a{' '}
                {noti.source === 'Projects' ? 'project' : noti.source === 'CP3' ? 'CP3' : 'Greenlist'} of{' '}
                <strong>"{noti.projectName}"</strong>
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
            {noti.notificationType.toLowerCase() === 'assigned' && noti.source === 'Projects' && (
              <>
                <strong>{noti.userName}</strong> {noti.notificationType.toLowerCase()} to{' '}
                {noti.source === 'Projects' ? 'project' : noti.source === 'CP3' ? 'CP3' : 'Greenlist'} of{' '}
                <strong>"{noti.projectName}"</strong>
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
            {noti.notificationType.toLowerCase() === 'assigned' && noti.source === 'Links' && (
              <>
                <strong>{noti.userName}</strong> {noti.notificationType.toLowerCase()} to{' '}
                {noti.source === 'Projects' ? 'project' : noti.source === 'CP3' ? 'CP3' : 'Greenlist'} of{' '}
                <strong>"{noti.projectName}"</strong>
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}

            {noti.notificationType.toLowerCase() === 'notes' && (
              <>
                <strong>{noti.userName}</strong> left a note for you, "{noti.notes}"
                {/* {noti.source === 'Projects' ? 'project' : noti.source === 'Links' ? 'links' : 'Greenlist'} of{' '}
                <strong>"{noti.projectName}"</strong> */}
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
            {noti.notificationType.toLowerCase() === 'links' && (
              <>
                <strong>{noti.userName}</strong> assigned {noti.linksCount} on the {''}
                {noti.source === 'Projects' ? 'project' : noti.source === 'Links' ? 'links' : 'Greenlist'}{' '}
                <strong>"{noti.projectName}"</strong> to you{' '}
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <Header>
        <Row justify="space-between">
          <img src={logo} alt="logo" />
          <Col span={10} push={3}>
            <Row justify="end">
              <Col span={8}>
                <img src={guardian} height="32px" alt="guardian" />
              </Col>
              <Col span={8}>
                <img src={cp3} height="48px" alt="cp3" />
              </Col>
              <Col span={8}>
                <img src={retool} style={{ width: '74px', height: '16px' }} alt="Retool" />
              </Col>
            </Row>
          </Col>
          <Col className="header-typography">
            <Space size={'large'}>
              <Badge size="small" count={notifications.length}>
                <Button onClick={openNotification} type="primary" shape="circle" icon={<BellFilled />} />
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
      <div className="notification-wrapper-div">
        {showNoti && (
          <div className="notification-wrapper arrow-top" style={{ background: '#000' }}>
            {renderNotifications()}
            <div className="clr-noti">
              <Button size="large" type="primary">
                Clear All
              </Button>
            </div>

            {/* <span onClick={clearNotification}>Clear</span> */}
          </div>
        )}
      </div>
    </>
  )
}
