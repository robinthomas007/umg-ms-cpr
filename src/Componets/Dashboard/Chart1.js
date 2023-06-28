import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useAuth } from '../../Context/authContext'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  color: 'red',
}

const labels = ['January', 'February', 'March', 'April']

export const data = {
  labels,
  color: function (context) {
    const index = context.dataIndex
    const value = context.dataset.data[index]
    return value < 0
      ? 'red' // draw negative values in red
      : index % 2
      ? 'blue' // else, alternate values in blue and green
      : 'green'
  },

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
  // const { darkMode } = useAuth()
  return <Bar options={options} data={data} />
}
