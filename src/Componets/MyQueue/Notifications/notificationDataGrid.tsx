import React, { useState, useEffect } from 'react'
import { Table, Tag, Select } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { TableRowSelection } from 'antd/es/table/interface'
import { clearConfigCache } from 'prettier'
import './notifications.css'
import { postApi, getApi } from '../../../Api/Api'
import { useAuth } from '../../../Context/authContext'
import axios from 'axios'
import { config } from '../../Common/Utils'
import { BASE_URL } from '../../../App'

const onChange: TableProps<Notification>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}
interface NotificationProps {
  columnsNotifications: ColumnsType<Notification>
  notifications: Notification[]
  loading: boolean
  getUpdatedNotificationList: any
}

const MyQueueDataGrid: React.FC<NotificationProps> = ({
  columnsNotifications,
  notifications,
  loading,
  getUpdatedNotificationList,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { notifyCount, setNotifyCount } = useAuth()

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const getAllNotifications = () => {
    getApi({}, '/notification/getunreadnotification')
      .then((res) => {
        setNotifyCount(res.length)
      })
      .catch((error) => {
        console.log('error feching data', error)
      })
  }

  return (
    <Table
      columns={columnsNotifications}
      scroll={{ y: 450 }}
      rowSelection={rowSelection}
      dataSource={notifications}
      onChange={onChange}
      pagination={false}
      rowKey={'notificationId'}
      loading={loading}
      rowClassName={(record: any, index) => {
        return record.isRead ? 'checkedNoti' : 'uncheckedNoti'
      }}
      onRow={(record: any, rowIndex) => {
        return {
          onMouseEnter: (event) => {
            if (!record.isRead) {
              postApi({ notificationId: Number(record.notificationId) }, '/notification/readnotification', '').then(
                (res) => {
                  getAllNotifications()
                  getUpdatedNotificationList()
                }
              )
            }
          },
        }
      }}
    />
  )
}

export default MyQueueDataGrid
