import { Layout, Row, Col, Space, Button, Badge, Typography } from 'antd'
import logo from '../../images/logo.png'
import guardian from '../../images/guardian.png'
import cp3 from '../../images/cp3.png'
import styles from './index.module.css'
import { BellFilled } from '@ant-design/icons'
const { Header } = Layout
const { Text } = Typography

export default function Navbar() {
  return (
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
            <Text>Welcome, Dineshkumar Raman</Text>
          </Space>
        </Col>
      </Row>
    </Header>
  )
}
