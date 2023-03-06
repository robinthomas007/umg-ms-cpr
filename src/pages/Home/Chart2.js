import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
}

export const data = {
  labels: ['First Seen', 'CP3 Entries', 'Greenlisted'],
  datasets: [
    {
      label: 'No. of tracks',
      data: [12, 19, 8, 3],
      backgroundColor: ['#01579B', '#85D305', '#F5FA20'],
      borderWidth: 0,
      cutout: 90,
    },
  ],
}

export default function Chart2() {
  return <Doughnut data={data} options={options} />
}
