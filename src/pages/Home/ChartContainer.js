import { Typography, Select, Space } from 'antd'
import styles from './ChartContainer.module.css'
import { HolderOutlined, SettingFilled, FundFilled } from '@ant-design/icons'

export default function Home({ title, children, labels }) {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <Typography.Title level={5}>
          <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />
          {title}
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
      <div className={styles.chart}>{children}</div>
      <div className={styles.chartFooter}>
        <Space size={'large'}>
          {labels.map((label) => (
            <Space key={label.text}>
              <FundFilled style={{ color: label.color }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{label.text}</span>
            </Space>
          ))}
        </Space>
      </div>
      <SettingFilled className={styles.footerSettings} />
    </div>
  )
}
