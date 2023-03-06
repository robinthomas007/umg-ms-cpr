import { Layout, Row, Col, Space, Button, Badge, Typography, Menu } from 'antd'
import logo from '../../images/logo.png'
import guardian from '../../images/guardian.png'
import cp3 from '../../images/cp3.png'
import { BellFilled, SearchOutlined, SafetyCertificateFilled } from '@ant-design/icons'
import getAuthUser from '../../utils/getAuthUser'
import { useState } from 'react'
const { Header } = Layout
const { Text } = Typography

const items = [
  {
    label: 'Search',
    key: 'logo',
    icon: <SearchOutlined />,
  },
  {
    label: 'Policy',
    key: 'cis',
    icon: <SafetyCertificateFilled />,
  },
]

export default function Navbar() {
  const user = getAuthUser()
  const [current, setCurrent] = useState(items[0].key)

  const onClick = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }

  return (
    <Header>
      <Row justify="space-between">
        <img src={logo} height="92px" style={{ marginTop: '-18px' }} alt="logo" />
        <Col>
          <Space size={'large'}>
            <img src={guardian} height="32px" alt="guardian" />
            <img src={cp3} height="48px" alt="cp3" />
          </Space>
        </Col>
        <Col>
          <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        </Col>
        <Col>
          <Space size={'large'}>
            <Badge size="small" count={5}>
              <Button shape="circle" icon={<BellFilled />} />
            </Badge>
            <Text>Welcome {user ? user.name : ''}</Text>
          </Space>
        </Col>
      </Row>
    </Header>
  )
}
