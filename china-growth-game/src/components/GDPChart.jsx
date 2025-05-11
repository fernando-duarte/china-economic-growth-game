import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GDPChart = ({ simulationResults }) => {
  // If there are no simulation results, return null
  if (!simulationResults || simulationResults.length === 0) {
    return null;
  }

  // Extract years and GDP values from simulation results
  const years = simulationResults.map(result => result.year);
  const gdpValues = simulationResults.map(result => result.Y);

  // Prepare data for the chart
  const data = {
    labels: years,
    datasets: [
      {
        label: 'GDP (Billion USD)',
        data: gdpValues,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      }
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'GDP Growth Path (1980-2025)',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `GDP: ${context.parsed.y.toFixed(2)} billion USD`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'GDP (Billion USD)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        GDP Growth Path
      </Typography>
      <Box sx={{ height: 300 }}>
        <Line data={data} options={options} />
      </Box>
    </Paper>
  );
};

export default GDPChart;
