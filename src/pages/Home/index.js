import { Row, Col } from 'antd'
import Chart1 from './Chart1'
import Chart2 from './Chart2'

export default function Home() {
  return (
    <Row gutter={[40, 40]}>
      <Col span={12}>
        <Chart1 />
      </Col>
      <Col span={12}>
        <Chart2 />
      </Col>
    </Row>
  )
}
