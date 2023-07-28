import React from 'react'
import { Typography } from 'antd'
import styles from './Release.module.css'
import { HolderOutlined } from '@ant-design/icons'
import releseImage1 from '../../images/release_img1.png'
import releseImage2 from '../../images/release_img2.png'
import releseImage3 from '../../images/release_img3.png'
import releseImage4 from '../../images/release_img4.png'

import { Avatar, List, Card, Row, Col } from 'antd'
const { Meta } = Card
const release_img = {
  float: 'left',
  marginRight: '20px',
  width: '45px',
  objectFit: 'cover',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
}

const data = [
  {
    title: 'SOS- Digital Album',
    calNum: '1/5',
    label: 'SZA',
    releaseImg: releseImage1,
  },
  {
    title: 'French Montana & DJ Drama',
    calNum: '1/6',
    label: 'Coke Boys',
    releaseImg: releseImage2,
  },
  {
    title: '03 Greedo & Mike Free',
    calNum: '1/9',
    label: 'Free 03',
    releaseImg: releseImage3,
  },
  {
    title: 'Naz',
    calNum: '1/9',
    label: 'Never Have I Ever',
    releaseImg: releseImage4,
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
      {/* <List
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
      /> */}
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <Card>
              <Meta
                avatar={
                  <Row style={{ width: 500, textAlign: 'left' }}>
                    <Col span={8} style={{ margin: 'auto' }} push={4}>
                      <h4>{item.calNum}</h4>
                    </Col>
                    <Col span={16} pull={2}>
                      <img src={item.releaseImg} alt="sample" style={release_img} />
                      <h4>{item.title}</h4>
                      <h4>{item.label} </h4>
                    </Col>
                  </Row>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}
