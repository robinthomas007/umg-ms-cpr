import React, { useEffect, useState } from 'react'
import { Button, Typography, Space, Layout, Row, Col, List, Select, theme, Avatar, Popover } from 'antd'
import { PushpinFilled, HolderOutlined, PlusCircleOutlined, ClockCircleOutlined, ProfileOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Content } from 'antd/es/layout/layout'
import './dashboard.css'
import ChartContainer from './Charts/ChartContainer'
import BarChart from './Charts/BarChart'
import DoughnutChart from './Charts/Doughnut'
import EventModal from './Modal/EventModal'
import moment from 'moment'

const { Paragraph, Text } = Typography

const tableData1 = [
  {
    key: '1',
    day: 'Sun 1/1',
    eventList: [{ name: 'New Years Day', type: '1' }],
  },
  {
    key: '2',
    day: 'Mon 1/2',
    eventList: [{ name: 'Matt, Anna, Jason & Graeme on Vacation', type: '0' }],
  },
  {
    key: '3',
    day: 'Tue 1/3',
    eventList: [{ name: 'Matt &  Anna on Vacation', type: '0' }],
  },
  {
    key: '4',
    day: 'Wed 1/4',
    eventList: [
      { name: 'Matt &  Anna on Vacation', type: '0' },
      { name: 'New Project Published:Justin Beiber / New Guy', type: '2' },
    ],
  },
  {
    key: '4',
    day: 'Thurs 1/5',
    eventList: [
      { name: 'New Release:SZA / SOS', type: '2' },
      { name: 'Matt on Vacation', type: '0' },
    ],
  },
  {
    key: '4',
    day: 'Fri 1/6',
    eventList: [{ name: 'New Release:French Montana / DJ Dr...', type: '2' }],
    type: '1',
  },
  {
    key: '4',
    day: 'Sat 1/7',
    eventList: [],
  },
]

const data = [
  {
    title: 'SOS - Digital Album',
    description: 'SZA',
    rate: '1/5',
  },
  {
    title: 'French Montana & DJ Drama ',
    description: 'Coke Boys',
    rate: '1/6',
  },
  {
    title: '03 Greedo & Mike Free ',
    description: 'Free 03',
    rate: '1/9',
  },
  {
    title: 'Naz',
    description: ' Never Have I Ever',
    rate: '1/9',
  },
  {
    title: 'French Montana & DJ Drama ',
    description: 'Coke Boys',
    rate: '1/6',
  },
  {
    title: '03 Greedo & Mike Free ',
    description: 'Free 03',
    rate: '1/9',
  },
  {
    title: 'Naz',
    description: ' Never Have I Ever',
    rate: '1/9',
  },
]




const handleShowPlusIcon = () => {
  const box: any = document.querySelector('.plusIcon')
  box.style.display = 'block'
}

export default function Search() {
  const { useToken }: { useToken: any } = theme
  const { token }: { token: any } = useToken()
  const [createEventModalOpen, setCreateEventModalOpen] = useState<boolean>(false)
  const [eventList, setEventList] = useState<any>([])

  React.useEffect(() => {
    const data = [{
      "bodyPreview": "sick leave",

      "end": {

        "dateTime": "2023-01-09T22:00:00.0000000",

        "timeZone": "UTC"

      },

      "start": {
        "dateTime": "2023-01-05T20:00:00.0000000",
        "timeZone": "UTC"
      },

      "subject": "Leave",

      "type": 0,

      "categories": [],

      "createdDateTime": "2023-09-14T09:52:40.4767391+00:00",

      "lastModifiedDateTime": "2023-09-14T10:49:26.870079+00:00",

      "id": "AAMkAGE1MjAzZmFhLTQyYjctNGU0My04ODFkLWU4MTI1NTA3ZGUyYwBGAAAAAADGwIBFCovMSIRj9xGd-5FSBwCV_mw3hxehT4fGMQahDDn-AAB1eOekAACV_mw3hxehT4fGMQahDDn-AAB1es1RAAA=",

      "odataType": "#microsoft.graph.event",

    },
    {
      "bodyPreview": "sick leave1",

      "end": {

        "dateTime": "2023-01-09T22:00:00.0000000",

        "timeZone": "UTC"

      },

      "start": {
        "dateTime": "2023-01-05T20:00:00.0000000",
        "timeZone": "UTC"
      },

      "subject": "Leave 2",

      "type": 0,

      "categories": [],

      "createdDateTime": "2023-09-14T09:52:40.4767391+00:00",

      "lastModifiedDateTime": "2023-09-14T10:49:26.870079+00:00",

      "id": "AAMkAGE1MjAzZmFhLTQyYjctNGU0My04ODFkLWU4MTI1NTA3ZGUyYwBGAAAAAADGwIBFCovMSIRj9xGd-5FSBwCV_mw3hxehT4fGMQahDDn-AAB1eOekAACV_mw3hxehT4fGMQahDDn-AAB1es1RAAA=",

      "odataType": "#microsoft.graph.event",

    },
    ]

    const newData: any = []
    data.map((ev) => {
      var a = moment(ev.start.dateTime);
      var b = moment(ev.end.dateTime);
      const diff = b.diff(a, 'days')
      const length = diff + 1
      const newArray: number[] = Array.from({ length }, (_, index) => index)
      newArray.map((val) => {
        const eventData: any = {}
        const newobj: any = {}
        const eventDay = moment(ev.start.dateTime).add(val, 'day').format('ddd M/D');
        const checkDateIfExist = newData.find((item) => item.day === eventDay)
        if (checkDateIfExist) {
          eventData.name = ev.subject
          eventData.bodyPreview = ev.bodyPreview
          eventData.type = ev.type
          checkDateIfExist.eventList.push(eventData)
        } else {
          newobj.day = eventDay
          delete newobj.start
          delete newobj.end
          newobj.eventList = []
          eventData.name = ev.subject
          eventData.bodyPreview = ev.bodyPreview
          eventData.type = ev.type
          newobj.eventList.push(eventData)
          newData.push(newobj)
        }
      })

    })
    setEventList(newData)
  }, [])

  const showCreateEventModal = () => {
    // setEditRecord(data)
    setCreateEventModalOpen(true)
  }

  const createTeamSave = () => {
    setCreateEventModalOpen(false)
  }
  const handleCreateTeamModalCancel = () => {
    createEventModalOpen && setCreateEventModalOpen(false)
  }

  const eventContent = (event) => {
    return (
      <div>
        <div className='popover-item'>
          <ClockCircleOutlined size={16} className='popover-icons' />
          <p className='popover-item-content'> Fri 15/09/2023 (All Day)</p>
        </div>
        <div className='popover-item'>
          <ProfileOutlined className='popover-icons' size={16} />
          <p className='popover-item-content'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. The printing and typesetting industry, the printing and typesetting industry
          </p>
        </div>
        <div className='event-popover-footer'>
          <Button> <EditOutlined /> Edit</Button>
          <Button> <DeleteOutlined />Delete</Button>
        </div>
      </div>
    )
  }
  return (
    <Layout>
      <Content className="dashboard-wrapper" style={{ padding: '70px 50px 60px' }}>
        <Row>
          <Col
            span={4}
            className="news-wrapper"
            style={{ backgroundColor: token.colorItemBg, padding: 20, borderRadius: 2 }}
          >
            <Row justify={'space-between'}>
              <Col>
                <Typography.Title level={5}>From The Board</Typography.Title>
              </Col>
              <Col>
                <Typography style={{ fontSize: 16 }}>
                  <PushpinFilled />
                </Typography>
              </Col>
            </Row>
            <Row style={{ padding: 3 }}>
              <Col span={24}>
                <Typography.Title level={5} style={{ padding: 0, color: token.colorInfo }}>
                  Last Weeks Leak
                </Typography.Title>
              </Col>
              <Col span={24}>
                <Paragraph style={{ marginTop: '-8px', fontSize: 12 }}>Graeme Grant</Paragraph>
              </Col>
              <Col span={24}>
                <Paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer scelerisque porta justo, in placerat
                  dolor ultrices eu. Lorem ipsum dolor sit amet...
                </Paragraph>
              </Col>
            </Row>
            <Row style={{ padding: 3 }}>
              <Col span={24}>
                <Typography.Title level={5} style={{ padding: 0, color: token.colorInfo }}>
                  ATTN: Guardian Admins
                </Typography.Title>
              </Col>
              <Col span={24}>
                <Paragraph style={{ marginTop: '-8px', fontSize: 12 }}>Matt Conlon</Paragraph>
              </Col>
              <Col span={24}>
                <Paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer scelerisque porta...
                </Paragraph>
              </Col>
            </Row>
            <Row style={{ padding: 3 }}>
              <Col span={24}>
                <Typography.Title level={5} style={{ padding: 0, color: token.colorInfo }}>
                  First Seen Automation
                </Typography.Title>
              </Col>
              <Col span={24}>
                <Paragraph style={{ marginTop: '-8px', fontSize: 12 }}>Jason Miller</Paragraph>
              </Col>
              <Col span={24}>
                <Paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer scelerisque porta justo, in placerat
                  dolor ultrices eu. Lorem ipsum dolor sit amet...
                </Paragraph>
              </Col>
            </Row>
          </Col>
          <Col span={20}>
            <Row justify="space-between">
              <Col span={12} style={{ paddingLeft: 50 }}>
                <div style={{ backgroundColor: token.colorItemBg, borderRadius: 2 }}>
                  <ChartContainer
                    title="Guardian Projects"
                    labels={[
                      { text: 'Submitted', color: '#01579B' },
                      { text: 'Published', color: '#85D305' },
                      { text: 'In Progress', color: '#F5FA20' },
                    ]}
                    isDoughnutChart={false}
                  >
                    <BarChart />
                  </ChartContainer>
                </div>
              </Col>
              <Col span={12} style={{ paddingLeft: 50 }}>
                <div style={{ backgroundColor: token.colorItemBg, borderRadius: 2 }}>
                  <ChartContainer
                    title="CP3 New Records"
                    labels={[
                      { text: 'First Seen', color: '#01579B' },
                      { text: 'CP3 Entries', color: '#85D305' },
                      { text: 'Greenlisting', color: '#F5FA20' },
                    ]}
                    isDoughnutChart={true}
                  >
                    <DoughnutChart />
                  </ChartContainer>
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 50 }} className="upcoming-release">
              <Col span={8} style={{ paddingLeft: 50 }}>
                <div style={{ backgroundColor: token.colorItemBg, borderRadius: 2, padding: 5 }}>
                  <Typography.Title level={5} style={{ padding: '10px 14px 0px' }}>
                    <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />
                    Upcoming Releases
                  </Typography.Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                      <List.Item
                        key={index}
                        style={{
                          backgroundColor: token.colorListItem,
                          margin: 10,
                          borderRadius: 4,
                          padding: '0px 12px',
                        }}
                      >
                        <Typography>{item.rate}</Typography>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{ borderRadius: 0 }}
                              size={48}
                              shape="square"
                              src={`https://joesch.moe/api/v1/random?key=${index}`}
                            />
                          }
                          title={<a href="https://ant.design">{item.title}</a>}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
              <Col span={16} style={{ paddingLeft: 50 }}>
                <div style={{ backgroundColor: token.colorItemBg, borderRadius: 2 }}>
                  <Space style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}>
                    <Typography.Title level={5} style={{ padding: '10px 14px 10px' }}>
                      <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />
                      Team Calendar
                    </Typography.Title>
                    <Space>
                      <Select
                        defaultValue="1"
                        style={{
                          width: 150,
                        }}
                        options={[
                          {
                            value: '1',
                            label: 'Week of 1/1 - 1/7',
                          },
                        ]}
                      />
                      <Select
                        defaultValue="1"
                        style={{
                          width: 120,
                        }}
                        options={[
                          {
                            value: '1',
                            label: 'January 2023',
                          },
                        ]}
                      />
                    </Space>
                  </Space>
                  <Row>
                    <Col span={24}>
                      {eventList.map((item) => {
                        const length = 3 - Number(item.eventList.length)
                        const newArray: number[] = Array.from({ length }, (_, index) => index)
                        return (
                          <Row
                            justify={'space-between'}
                            align={'middle'}
                            style={{ color: token.colorTextBase, textAlign: 'center', margin: 10 }}
                          >
                            <Col span={3} style={{ textAlign: 'left', paddingLeft: 30 }}>
                              {item.day}
                            </Col>
                            <Col span={21} style={{ overflow: 'auto' }}>
                              <div style={{ overflowX: 'auto' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                                  {item.eventList.map((event) => (
                                    <>
                                      <div
                                        id="notifymsg"
                                        className={`event-border-${event.type}`}
                                        style={{
                                          backgroundColor: token.colorListItem,
                                          padding: '25px 10px',
                                          borderRadius: 4,
                                          minHeight: 70,
                                          width: '32%',
                                          flexShrink: 0,
                                          marginRight: 10,
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center'
                                        }}
                                      >
                                        <Popover overlayClassName='event-popover' placement="right" content={eventContent(event)} title={event.name} trigger="click">
                                          <span>{event.name}</span>

                                        </Popover>
                                        {/* <PlusCircleOutlined className="plusIcon" style={{ float: 'right' }} /> */}
                                      </div>
                                    </>
                                  ))}
                                  {newArray.map((item) => (
                                    <>
                                      <div
                                        id="notifymsg"
                                        style={{
                                          backgroundColor: token.colorListItem,
                                          padding: '25px 10px',
                                          borderRadius: 4,
                                          height: 70,
                                          width: '32%',
                                          flexShrink: 0,
                                          marginRight: 10,
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center'
                                        }}
                                      >
                                        <PlusCircleOutlined
                                          onClick={showCreateEventModal}
                                          className="plusIcon"
                                          style={{ float: 'right' }}
                                        />
                                      </div>
                                    </>
                                  ))}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        )
                      })}
                    </Col>
                    {createEventModalOpen && (
                      <EventModal
                        isModalOpen={createEventModalOpen}
                        handleOk={createTeamSave}
                        handleCancel={handleCreateTeamModalCancel}
                      />
                    )}
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
