import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentProgressGraph = ({ results = {} }) => {
  const sessions = Object.keys(results);

  const labels = [];
  const combinedData = [];

  sessions.forEach((session) => {
    // Check if midTerm is available
    if (results[session].midTerm) {
      labels.push(`${session} Mid-Term`);
      combinedData.push(parseFloat(results[session].midTerm));
    }

    // Check if endTerm is available
    if (results[session].endTerm) {
      labels.push(`${session} End-Term`);
      combinedData.push(parseFloat(results[session].endTerm));
    }
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Percentage',
        data: combinedData,
        borderColor: '#21526E',
        backgroundColor: '#21526E',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Student Performance Progress (Mid-Term and End-Term)',
      },
      tooltip: {
        intersect: false,
        mode: 'nearest',
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 15,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
        display: true,
        title: {
          display: true,
          text: 'Marks (in %)',
        },
        max: 100,
        min: 0,
      },
    },
    hover: {
      intersect: false,
      mode: 'nearest',
    },
  };

  return (
    <div className="p-4 w-full h-full flex justify-center bg-white rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default StudentProgressGraph;
