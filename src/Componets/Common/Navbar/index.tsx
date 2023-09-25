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
import { hexArray } from './../../Common/StaticDatas'
import { ADMIN } from './../../Common/StaticDatas'
import moment from 'moment'
const { Header } = Layout
const { Text } = Typography

// type Items={ key?: string | null; label?: string; icon?: React.JSX.Element |undefined; path?: string; }

export default function Navbar() {
  const user = getAuthUser()
  const { setDarkMode, darkMode, notifyCount, setNotifyCount } = useAuth()
  const [current, setCurrent] = useState('')
  const { pathname } = useLocation()
  const [toggle, setToggle] = useState(false)
  const [notifications, setNotifications] = useState<any>([])
  const [showNoti, setShowNoti] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const auth = useAuth()

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
      style: { visibility: auth.user.role !== ADMIN ? 'hidden' : 'visible' },
    },
    {
      key: 'knowledgeBase',
      label: 'Knowledge Base',
    },
  ]

  useEffect(() => {
    setDarkMode(toggle)
  }, [toggle])

  useEffect(() => {
    getAllNotifications()
    localStorage.setItem('notifyCount', String(0))
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
    const pathSegments = pathname.split('/')
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
    postApi({ notificationId: 0 }, '/notification/readnotification', '').then((res) => {
      setNotifyCount(0)
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
        setNotifyCount(res.length)
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
    navigate('/myqueue?type=notifications', {
      state: { notificationId: notificationId },
      replace: true,
    })
    setShowNoti(false)
  }

  const markAsRead = (id: number, source: string) => {
    // mark as read api on hold for client verification
    return false
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
                {noti.source === 'Projects' ? 'project' : noti.source === 'Links' ? 'Links' : 'project'} of{' '}
                <strong>"{noti.projectName}"</strong> and assigned it to {noti.teamName}
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
            {noti.notificationType.toLowerCase() === 'updated' && (
              <>
                <strong>{noti.userName}</strong> {noti.notificationType.toLowerCase()} a{' '}
                {noti.source === 'Projects' ? 'project' : noti.source === 'Links' ? 'Links' : 'project'} of{' '}
                <strong>"{noti.projectName}"</strong>
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
            {noti.notificationType.toLowerCase() === 'assigned' && noti.source === 'Projects' && (
              <>
                <strong>{noti.userName}</strong> {noti.notificationType.toLowerCase()} to{' '}
                {noti.source === 'Projects' ? 'project' : noti.source === 'Links' ? 'links' : 'project'} of{' '}
                <strong>"{noti.projectName}"</strong>
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
            {noti.notificationType.toLowerCase() === 'assigned' && noti.source === 'Links' && (
              <>
                <strong>{noti.userName}</strong> {noti.notificationType.toLowerCase()} to {noti.linksCount}{' '}
                {noti.source === 'Projects' ? 'project' : noti.source === 'Links' ? 'links' : 'project'} of{' '}
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
                {noti.source === 'Projects' ? 'project' : noti.source === 'Links' ? 'links' : 'project'}{' '}
                <strong>"{noti.projectName}"</strong> to you{' '}
                <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
            {noti.notificationType.toLowerCase() === 'newrelease' && (
              <>
                <strong>{noti.userName}</strong> The New Release for{' '}
                <strong>"{noti?.projectName.split('##')[0]}"</strong> titled,
                <strong>"{noti?.projectName.split('##')[1]}"</strong>is due to Release in{' '}
                {noti?.projectName.split('##')[2]}!<span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
              </>
            )}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="header-wrapper">
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
              <Badge size="small" count={notifyCount}>
                <Button
                  id="notify-wrapper"
                  onClick={openNotification}
                  type="primary"
                  shape="circle"
                  icon={<BellFilled />}
                />
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
              <Button size="large" type="primary" onClick={clearNotification}>
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
