import { Layout, Menu, Row, Col, Typography } from 'antd'
import styles from './index.module.css'
import { BarChartOutlined, PushpinFilled } from '@ant-design/icons'
const { Sider } = Layout
const { Paragraph } = Typography

const MENUS = [
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

export default function SideNav() {
  return (
    <Sider className={styles.sider}>
      <Menu defaultSelectedKeys={[MENUS[0].key]} items={MENUS} />
      <Row className={styles.news}>
        <Col className={styles.newsBoardText}>
          <Paragraph>From The Board</Paragraph>
          <PushpinFilled className={styles.newsPin} />
        </Col>
        <Col>
          <Paragraph className={styles.newsTitle}>Last Weeks Leak</Paragraph>
          <Paragraph className={styles.newsSubTitle}>Graeme Grant</Paragraph>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer scelerisque porta justo, in placerat dolor
            ultrices eu. Lorem ipsum dolor sit amet...
          </Paragraph>
        </Col>
        <Col>
          <Paragraph className={styles.newsTitle}>Last Weeks Leak</Paragraph>
          <Paragraph className={styles.newsSubTitle}>Graeme Grant</Paragraph>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer scelerisque porta justo, in placerat dolor
            ultrices eu. Lorem ipsum dolor sit amet...
          </Paragraph>
        </Col>
      </Row>
    </Sider>
  )
}
