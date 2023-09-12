import React from 'react'
import { Button, Typography, Space, Layout, Row, Col, List, Select, theme, Avatar, Table } from 'antd'
import {
  PushpinFilled,
  HolderOutlined,
} from '@ant-design/icons'
import { Content } from 'antd/es/layout/layout'
import './dashboard.css'
import ChartContainer from './Charts/ChartContainer'
import BarChart from './Charts/BarChart'
import DoughnutChart from './Charts/Doughnut'

const { Paragraph, Text } = Typography

const columns = [
  {
    dataIndex: 'day',
  },
  {
    dataIndex: '1',
  },
  {
    dataIndex: '2',
  },
  {
    dataIndex: '3',
  },
]

const tableData1 = [
  {
    key: '1',
    day: 'Sun 1/1',
    eventList: [{ name: 'New Years Day', type: "1" }],
  },
  {
    key: '2',
    day: 'Mon 1/2',
    eventList: [{ name: 'Matt, Anna, Jason & Graeme on Vacation', type: "0" }],
  },
  {
    key: '3',
    day: 'Tue 1/3',
    eventList: [{ name: 'Matt &  Anna on Vacation', type: "0" }],
  },
  {
    key: '4',
    day: 'Wed 1/4',
    eventList: [{ name: 'Matt &  Anna on Vacation', type: "0" }, { name: 'New Project Published:Justin Beiber / New Guy', type: "2" }],
  },
  {
    key: '4',
    day: 'Thurs 1/5',
    eventList: [{ name: 'New Release:SZA / SOS', type: "2" }, { name: 'Matt on Vacation', type: "0" }],
  },
  {
    key: '4',
    day: 'Fri 1/6',
    eventList: [{ name: 'New Release:French Montana / DJ Dr...', type: "2" }],
    type: "1"
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

export default function Search() {
  const { useToken }: { useToken: any } = theme;
  const { token }: { token: any } = useToken();

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
            <Row style={{ marginTop: 50 }} className='upcoming-release'>
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
                      <List.Item key={index} style={{ backgroundColor: token.colorListItem, margin: 10, borderRadius: 4, padding: '0px 12px' }}>
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
                      {tableData1.map((item) => {
                        const length = 3 - Number(item.eventList.length)
                        const newArray: number[] = Array.from({ length }, (_, index) => index);
                        return (
                          <Row justify={'space-between'} align={'middle'} style={{ color: token.colorTextBase, textAlign: 'center', margin: 10 }}>
                            <Col span={3} style={{ textAlign: 'left', paddingLeft: 30 }}>{item.day}</Col>
                            <Col span={21} style={{ overflow: 'auto' }}>
                              <div style={{ overflowX: 'auto' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                                  {item.eventList.map((event) => (
                                    <div className={`event-border-${event.type}`} style={{ backgroundColor: token.colorListItem, padding: "25px 10px", borderRadius: 4, minHeight: 60, width: '32%', flexShrink: 0, marginRight: 10 }}>
                                      {event.name}
                                    </div>
                                  ))}
                                  {newArray.map((item) => (
                                    <div style={{ backgroundColor: token.colorListItem, padding: "25px 10px", borderRadius: 4, minHeight: 60, width: '32%', flexShrink: 0, marginRight: 10 }}>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        )
                      })}
                    </Col>
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
