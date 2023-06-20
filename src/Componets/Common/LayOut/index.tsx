import { Layout } from 'antd'
import React, { FC } from 'react'
import styles from './index.module.css'

import Navbar from '../Navbar'
import SideNav from '../SideNav'
const { Content } = Layout

type Props = {
  children?: React.ReactNode
}
const LayOut = ({ children }: Props) => {
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
