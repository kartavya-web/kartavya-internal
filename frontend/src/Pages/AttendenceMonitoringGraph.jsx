import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceMonitoringGraph = ({ attendanceData = {} }) => {
  const months = Object.keys(attendanceData);

  const labels = [];
  const totalDaysData = [];
  const absentDaysData = [];

  months.forEach((month) => {
    const { totalDays, presentDays } = attendanceData[month];

    labels.push(month);
    totalDaysData.push(parseFloat(presentDays)); // Present days
    absentDaysData.push(parseFloat(totalDays) - parseFloat(presentDays)); // Absent days
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Present Days',
        data: totalDaysData,
        backgroundColor: '#21526E', // Blue for present days
      },
      {
        label: 'Absent Days',
        data: absentDaysData,
        backgroundColor: '#FF6384', // Red for absent days
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
        text: 'Student Attendance (Present vs Absent Days)',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            const monthIndex = tooltipItems[0].dataIndex;
            return `${labels[monthIndex]}`;
          },
          afterBody: (tooltipItems) => {
            const monthIndex = tooltipItems[0].dataIndex;
            const totalDays = attendanceData[labels[monthIndex]].totalDays;
            return `Total Days: ${totalDays}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true, // Stack bars on x-axis
      },
      y: {
        beginAtZero: true,
        stacked: true, // Stack on y-axis
        title: {
          display: true,
          text: 'Number of Days',
        },
        ticks: {
          stepSize: 5,
        },
        max: 30,
      },
    },
  };

  return (
    <div className="p-4 w-full h-full flex justify-center bg-white rounded-lg shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
};

export default AttendanceMonitoringGraph;
