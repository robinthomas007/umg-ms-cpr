import { Row, Col, Typography, Select, Space, Tag } from 'antd'
import styles from './index.module.css'
import Chart1 from './Chart1'
import Chart2 from './Chart2'
import { HolderOutlined, SettingFilled, FundFilled } from '@ant-design/icons'

export default function Home() {
  return (
    <Row gutter={40} style={{ marginLeft: 20 }}>
      <Col span={12}>
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <Typography.Title level={5}>
              <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />
              Guardian Projects
            </Typography.Title>
            <Select
              defaultValue="lucy"
              style={{
                width: 120,
              }}
              options={[
                {
                  value: 'jack',
                  label: '15 days',
                },
                {
                  value: 'lucy',
                  label: '30 days',
                },
                {
                  value: 'Yiminghe',
                  label: '60 days',
                },
                {
                  value: 'disabled',
                  label: '90 days',
                },
              ]}
            />
          </div>
          <div className={styles.chart}>
            <Chart1 />
          </div>
          <div className={styles.chartFooter}>
            <Space size={'large'}>
              <Space>
                <FundFilled style={{ color: '#01579B' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Submitted</span>
              </Space>
              <Space>
                <FundFilled style={{ color: '#85D305' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Published</span>
              </Space>
              <Space>
                <FundFilled style={{ color: '#F5FA20' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>In Progress</span>
              </Space>
            </Space>
          </div>
          <SettingFilled className={styles.footerSettings} />
        </div>
      </Col>
      <Col span={12}>
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <Typography.Title level={5}>
              <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />
              CP3 New Records
            </Typography.Title>
            <Select
              defaultValue="lucy"
              style={{
                width: 120,
              }}
              options={[
                {
                  value: 'jack',
                  label: '15 days',
                },
                {
                  value: 'lucy',
                  label: '30 days',
                },
                {
                  value: 'Yiminghe',
                  label: '60 days',
                },
                {
                  value: 'disabled',
                  label: '90 days',
                },
              ]}
            />
          </div>
          <div className={styles.chart}>
            <Chart2 />
          </div>
          <div className={styles.chartFooter}>
            <Space size={'large'}>
              <Space>
                <FundFilled style={{ color: '#01579B' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>First Seen</span>
              </Space>
              <Space>
                <FundFilled style={{ color: '#85D305' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>CP3 Entry</span>
              </Space>
              <Space>
                <FundFilled style={{ color: '#F5FA20' }} />
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Greenlisting</span>
              </Space>
            </Space>
          </div>
          <SettingFilled className={styles.footerSettings} />
        </div>
      </Col>
    </Row>
  )
}
