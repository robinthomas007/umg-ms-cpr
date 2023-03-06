import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
}

const labels = ['January', 'February', 'March', 'April']

export const data = {
  labels,
  datasets: [
    {
      label: 'Submitted',
      data: [400, 300, 100, 200],
      backgroundColor: '#01579B',
    },
    {
      label: 'Published',
      data: [300, 200, 300, 400],
      backgroundColor: '#85D305',
    },
    {
      label: 'In Progress',
      data: [150, 300, 250, 200],
      backgroundColor: '#F5FA20',
    },
  ],
}

export default function Chart1() {
  return <Bar options={options} data={data} />
}
