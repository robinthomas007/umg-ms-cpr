import { Typography } from 'antd'
import styles from './Release.module.css'
import { HolderOutlined } from '@ant-design/icons'

import { Avatar, List } from 'antd'
import React from 'react'

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
]

export default function Release() {
  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <Typography.Title level={5}>
          <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />
          Upcoming Releases
        </Typography.Title>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        style={{ textAlign: 'start' }}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`https://joesch.moe/api/v1/random?key=${index}`} />}
              title={<a href="https://ant.design">{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    </div>
  )
}
