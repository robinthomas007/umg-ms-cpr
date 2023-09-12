import React from 'react';
import { Typography, Select, Space, Divider } from 'antd';
import { HolderOutlined, SettingFilled, FundFilled } from '@ant-design/icons';
import styles from './ChartContainer.module.css';

interface Label {
  text: string;
  color: string;
}

interface Props {
  title: string;
  children: React.ReactNode;
  labels: Label[];
  isDoughnutChart: boolean;
}

const ChartContainer: React.FC<Props> = ({ title, children, labels, isDoughnutChart }) => {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <Typography.Title level={5}>
          <HolderOutlined style={{ fontSize: 18, marginRight: 8 }} />
          {title}
        </Typography.Title>
        <Select
          defaultValue="lucy"
          style={{
            width: 120,
          }}
          options={[
            {
              value: 'jack',
              label: '15 days',
            },
            {
              value: 'lucy',
              label: '30 days',
            },
            {
              value: 'Yiminghe',
              label: '60 days',
            },
            {
              value: 'disabled',
              label: '90 days',
            },
          ]}
        />
      </div>
      {isDoughnutChart ? (
        <div className="cpr-chart-container">
          <div className={styles.chart}>{children}</div>
          <div style={{ width: 200 }}>
            <Divider orientation="right" style={{ color: '#01579B' }}>
              48 CP3 Entries
            </Divider>
            <Divider orientation="right" style={{ color: '#85D305' }}>
              48 CP3 Entries
            </Divider>
            <Divider orientation="right" style={{ color: '#F5FA20' }}>
              48 CP3 Entries
            </Divider>
          </div>
        </div>
      ) : (
        <div className={styles.chart}>{children}</div>
      )}
      <div className={styles.chartFooter}>
        <Space size={'large'}>
          {labels.map((label) => (
            <Space key={label.text}>
              <FundFilled style={{ color: label.color }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{label.text}</span>
            </Space>
          ))}
        </Space>
      </div>
      <SettingFilled className={styles.footerSettings} />
    </div>
  );
}

export default ChartContainer;