import { Layout } from 'antd'
import React from 'react'
import styles from './index.module.css'
import Navbar from '../Navbar'
import SideNav from '../SideNav'
const { Content } = Layout

const LayOut = ({ children }) => {
  return (
    <Layout>
      <Navbar />
      <Layout className={styles.main}>
        <SideNav />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  )
}
export default LayOut
