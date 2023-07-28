import { Layout, Menu, Row, Col, Typography } from 'antd'
import styles from './index.module.css'
import {
  AlertFilled,
  PushpinFilled,
  MenuOutlined,
  AppstoreFilled,
  MailFilled,
  SlidersFilled,
  AuditOutlined,
} from '@ant-design/icons'
const { Sider } = Layout
const { Paragraph } = Typography

export default function SideNav() {
  return (
    <Sider>
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
