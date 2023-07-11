import { Row, Col, Layout } from 'antd'
import Chart1 from './Chart1'
import SideNav from '../Common/SideNav'

import Chart2 from './Chart2'
import ChartContainer from './ChartContainer'
import Release from './Release'
import TeamCalendar from './TeamCalendar'
import { useAuth } from '../../Context/authContext'
import React from 'react'
const { Header, Footer, Sider, Content } = Layout

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: '100vh',
  lineHeight: '120px',
  color: '#fff',
  padding: '10px',
  backgroundColor: '#222222',
}

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
}

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
}

export default function Home() {
  const { darkMode } = useAuth()

  return (
    <>
      <Layout style={{ padding: '10px' }} className="dashboard-layout">
        <Sider style={siderStyle}>
          <SideNav />
        </Sider>
        <Layout>
          <Content
            style={{
              textAlign: 'center',
              minHeight: '100vh',
              lineHeight: '120px',
              color: '#fff',
            }}
          >
            <Row>
              <Col span={11} offset={1} className="background-overlay">
                <ChartContainer
                  title="Guardian Projects"
                  labels={[
                    { text: 'Submitted', color: '#01579B' },
                    { text: 'Published', color: '#85D305' },
                    { text: 'In Progress', color: '#F5FA20' },
                  ]}
                >
                  <Chart1 />
                </ChartContainer>
              </Col>
              <Col span={11} offset={1} className="background-overlay">
                <ChartContainer
                  title="CP3 New Records"
                  labels={[
                    { text: 'First Seen', color: '#01579B' },
                    { text: 'CP3 Entries', color: '#85D305' },
                    { text: 'Greenlisting', color: '#F5FA20' },
                  ]}
                >
                  <Chart2 />
                </ChartContainer>
              </Col>
            </Row>

            <Row style={{ marginTop: '30px' }}>
              <Col span={7} offset={1} className="background-overlay">
                <Release />
              </Col>
              <Col span={15} offset={1} className="background-overlay">
                <TeamCalendar />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}
