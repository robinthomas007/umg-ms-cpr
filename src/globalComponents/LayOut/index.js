import { Layout, Menu, Row, Col, Space, Button, Badge } from 'antd'
import React from 'react'
import logo from '../../images/logo.png'
import guardian from '../../images/guardian.png'
import cp3 from '../../images/cp3.png'
import styles from './index.module.css'
import { BellFilled, BarChartOutlined } from '@ant-design/icons'
const { Header, Content, Sider } = Layout

const leftNavItems = [
  {
    key: 'Dashboard',
    label: 'Dashboard',
    icon: <BarChartOutlined />,
  },
  {
    key: 'My Queue',
    label: 'My Queue',
    icon: <BarChartOutlined />,
  },
  {
    key: 'Message Board',
    label: 'Message Board',
    icon: <BarChartOutlined />,
  },
  {
    key: 'Tasking',
    label: 'Tasking',
    icon: <BarChartOutlined />,
  },
  {
    key: 'Administration',
    label: 'Administration',
    icon: <BarChartOutlined />,
  },
  {
    key: 'Knowledge Base',
    label: 'Knowledge Base',
    icon: <BarChartOutlined />,
  },
]

const LayOut = ({ children }) => {
  return (
    <Layout>
      <Header className={styles.header}>
        <Row justify="space-between">
          <img src={logo} style={{ height: 92, marginTop: '-16px' }} alt="logo" />
          <Col>
            <Space size={'large'}>
              <img src={guardian} style={{ height: 32, marginTop: '-4px' }} alt="guardian" />
              <img src={cp3} style={{ height: 48, marginTop: '-4px' }} alt="cp3" />
            </Space>
          </Col>
          <Col>
            <Space size={'large'}>
              <Badge size="small" count={5}>
                <Button shape="circle" icon={<BellFilled />} />
              </Badge>
              <span>Welcome, Dineshkumar Raman</span>
            </Space>
          </Col>
        </Row>
      </Header>
      <Layout
        style={{
          margin: '40px',
        }}
      >
        <Sider width={200} style={{ height: '100%' }}>
          <Menu defaultSelectedKeys={['Dashboard']} items={leftNavItems} />
        </Sider>
        <Content
          style={{
            padding: '0 24px',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
export default LayOut
