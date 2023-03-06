import { Row, Col } from 'antd'
import Chart1 from './Chart1'
import Chart2 from './Chart2'
import ChartContainer from './ChartContainer'
import Release from './Release'

export default function Home() {
  return (
    <Row gutter={[40, 40]} style={{ marginLeft: 20 }}>
      <Col span={12}>
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
      <Col span={12}>
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
      <Col span={9}>
        <Release />
      </Col>
      <Col span={15}></Col>
    </Row>
  )
}
