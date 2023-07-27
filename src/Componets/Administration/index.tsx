import React, { useState } from 'react'
import { Typography, Layout, Row, theme, Col, Menu } from 'antd'
import { Content } from 'antd/es/layout/layout'
import type { MenuProps } from 'antd'
import './admin.css'
import User from './user'
import Team from './team'

const { Title } = Typography

export default function Administration() {
  const [current, setCurrent] = useState('user')
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [reloadTeamDataFromUser, setReloadTeamDataFromUser] = useState<boolean>(false)
  const [reloadUserDataFromTeam, setReloadUserDataFromTeam] = useState<boolean>(false)
  const { useToken }: { useToken: any } = theme
  const { token }: { token: any } = useToken()

  const items: MenuProps['items'] = [
    {
      label: 'User & Team Management',
      key: 'user',
    },
    {
      label: 'Reporting',
      key: 'report',
    },
    {
      label: 'CPR Metrics',
      key: 'cpr',
    },
  ]

  const handleDragStart = (event, item) => {
    setDraggedItem(item)
  }

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
  }

  const reloadTeamData = () => {
    setReloadTeamDataFromUser(!reloadTeamDataFromUser)
  }

  const reloadUserData = () => {
    setReloadUserDataFromTeam(!reloadUserDataFromTeam)
  }

  return (
    <Layout>
      <Content style={{ padding: '70px 70px 60px' }} className="admin-wrapper">
        <Title level={3}>User & Team Management</Title>
        <Menu
          style={{ background: token.colorDark, margin: '30px auto' }}
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
        ;
        <Row justify={'space-between'}>
          <Col span={11}>
            <User
              handleDragStart={handleDragStart}
              reloadTeamData={reloadTeamData}
              reloadUserDataFromTeam={reloadUserDataFromTeam}
            />
          </Col>
          <Col span={11} offset={1}>
            <Team
              draggedItem={draggedItem}
              reloadUserData={reloadUserData}
              updateTeamDataFromUser={reloadTeamDataFromUser}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
