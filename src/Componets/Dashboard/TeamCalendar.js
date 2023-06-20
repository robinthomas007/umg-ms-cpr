import { Calendar, Typography } from 'antd'
import { HolderOutlined } from '@ant-design/icons'
import styles from './TeamCalendar.module.css'

export default function TeamCalendar() {
  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode)
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <Typography.Title level={5}>
          <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />
          Team Calendar
        </Typography.Title>
      </div>
      <Calendar className="custom-calendar" onPanelChange={onPanelChange} />
    </div>
  )
}
