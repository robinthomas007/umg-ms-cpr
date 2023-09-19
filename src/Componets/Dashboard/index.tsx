import React, { useEffect, useState } from 'react'
import { Button, Typography, Space, Layout, Row, Col, List, Select, theme, Avatar, Popover } from 'antd'
import {
  PushpinFilled,
  HolderOutlined,
  PlusCircleOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { Content } from 'antd/es/layout/layout'
import './dashboard.css'
import ChartContainer from './Charts/ChartContainer'
import BarChart from './Charts/BarChart'
import DoughnutChart from './Charts/Doughnut'
import EventModal from './Modal/EventModal'
import moment from 'moment'
import { getApi, postApi } from '../../Api/Api'
import { monthCalendar, weekCalendar, getWeekNumber, calculateWeekDates } from './../Common/Utils'
const { Paragraph, Text } = Typography

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
  const [week, setWeek] = useState<any>(weekCalendar()[(getWeekNumber(moment().format('DD')) || 1) - 1])
  const [month, setMonth] = useState<any>(monthCalendar()[moment().month() || 0])

  React.useEffect(() => {
    const { startDate, endDate } = calculateWeekDates(week.value, month.value)
    getApi({ startDate, endDate }, '/Calendar/GetEvents')
      .then((res) => {
        if (res.value) {
          getEmptyRecordIfNoEvent(res.value)
        } else {
          getEmptyRecordIfNoEvent()
        }
      })
      .catch((error) => {
        console.log('error feching data', error)
        getEmptyRecordIfNoEvent()
      })
  }, [week])


  const getEmptyRecordIfNoEvent = (records?) => {
    const newData: any = []
    let { startDate, endDate } = calculateWeekDates(week.value, month.value)
    const a = moment(startDate)
    const b = moment(endDate)
    const diff = b.diff(a, 'days')
    const length = diff + 1
    const newArray: number[] = Array.from({ length }, (_, index) => index)
    newArray.map((val) => {
      const newobj: any = {}
      const eventDay = moment(startDate).add(val, 'day').format('ddd M/D')
      let eventsInDay: any = []
      if (records) {
        eventsInDay = records.filter((data) => {
          const categories = ['Holiday', 'Release', 'Absense']
          data.categories = categories[Math.floor(Math.random() * categories.length)]
          const diffInDays = moment(data.end.dateTime).diff(moment(data.start.dateTime), 'days');
          if ((diffInDays === 1) || moment(data.start.dateTime).format('DD/MM/YYYY') === moment(data.end.dateTime).format('DD/MM/YYYY')) {
            if (moment(startDate).add(val, 'day').format('DD/MM/YYYY') === moment(data.start.dateTime).format('DD/MM/YYYY')) {
              return data
            }
          } else {
            const momentDate1 = moment(data.start.dateTime);
            const momentDate2 = moment(data.end.dateTime);
            const momentDate3 = moment(moment(startDate).add(val, 'day'));
            const isEqualToDate1 = momentDate3.isSame(momentDate1, 'day');
            const isEqualToDate2 = momentDate3.isSame(momentDate2, 'day');
            const isBetweenDate1AndDate2 = momentDate3.isBetween(momentDate1, momentDate2, 'day', '[]');
            if (isEqualToDate1 || isEqualToDate2 || isBetweenDate1AndDate2) {
              return data
            }
          }
        })
      }
      newobj.day = eventDay
      delete newobj.start
      delete newobj.end
      newobj.eventList = eventsInDay
      newData.push(newobj)
      setEventList(newData)
    })
  }

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
        <div className="popover-item">
          <ClockCircleOutlined size={16} className="popover-icons" />
          <p className="popover-item-content"> Fri 15/09/2023 (All Day)</p>
        </div>
        <div className="popover-item">
          <ProfileOutlined className="popover-icons" size={16} />
          <p className="popover-item-content">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. The printing and typesetting
            industry, the printing and typesetting industry
          </p>
        </div>
        <div className="event-popover-footer">
          <Button>
            {' '}
            <EditOutlined /> Edit
          </Button>
          <Button>
            {' '}
            <DeleteOutlined />
            Delete
          </Button>
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
                        value={week}
                        style={{
                          width: 150,
                        }}
                        options={weekCalendar(month.value)}
                        onChange={(id, data) => setWeek(data)}
                      />
                      <Select
                        value={month}
                        style={{
                          width: 120,
                        }}
                        options={monthCalendar()}
                        onChange={(id, data) => {
                          setMonth(data)
                          setWeek(weekCalendar(id)[0])
                        }}
                      />
                    </Space>
                  </Space>
                  <Row>
                    <Col span={24}>
                      {eventList.map((item) => {
                        const length = 3 - Number(item.eventList.length) === 0 ? 1 : 3 - Number(item.eventList.length)
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
                              <div className='event-scroller' style={{ overflowX: 'auto' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                                  {item.eventList.map((event, i) => (
                                    <div
                                      key={i}
                                      id="notifymsg"
                                      className={`event-border-${event.categories}`}
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
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Popover
                                        overlayClassName="event-popover"
                                        placement="right"
                                        content={eventContent(event)}
                                        title={event.subject}
                                        trigger="click"
                                      >
                                        <span>
                                          {event.subject} {event.bodyPreview}
                                        </span>
                                      </Popover>
                                      {!event && <PlusCircleOutlined
                                        onClick={showCreateEventModal}
                                        className="plusIcon add-event-icon"
                                        style={{ float: 'right' }}
                                      />}
                                    </div>
                                  ))}
                                  {newArray.map((item, i) => (
                                    <div
                                      key={i}
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
                                        alignItems: 'center',
                                      }}
                                    >
                                      <PlusCircleOutlined
                                        onClick={showCreateEventModal}
                                        className="plusIcon add-event-icon"
                                        style={{ float: 'right' }}
                                      />
                                    </div>
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
