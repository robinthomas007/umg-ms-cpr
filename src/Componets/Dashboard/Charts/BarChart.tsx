import React from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 2,
        // suggestedMin: 2
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const labels: string[] = ['2/28 - 3/7', '3/8 - 3/15', '3/16 - 3/23', '3/23 - 3/30'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Submitted',
      data: [6, 4, 6, 6],
      backgroundColor: '#01579B',
    },
    {
      label: 'Published',
      data: [10, 8, 10, 10],
      backgroundColor: '#85D305',
    },
    {
      label: 'In Progress',
      data: [4, 6, 8, 8],
      backgroundColor: '#F5FA20',
    },
  ],
};

export default function BarChart() {
  return <Bar options={options} data={data} />;
}