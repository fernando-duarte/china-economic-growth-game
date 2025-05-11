import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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

// Define chart colors for different variables
const chartColors = [
  { borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)' },
  { borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
  { borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)' },
  { borderColor: 'rgb(255, 206, 86)', backgroundColor: 'rgba(255, 206, 86, 0.5)' },
  { borderColor: 'rgb(153, 102, 255)', backgroundColor: 'rgba(153, 102, 255, 0.5)' },
  { borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.5)' },
  { borderColor: 'rgb(75, 192, 75)', backgroundColor: 'rgba(75, 192, 75, 0.5)' },
  { borderColor: 'rgb(192, 75, 75)', backgroundColor: 'rgba(192, 75, 75, 0.5)' }
];

// Variable categories and their display names
const variableCategories = {
  economicIndicators: {
    title: 'Economic Indicators',
    variables: {
      Y: 'GDP (Y)',
      C: 'Consumption (C)',
      I: 'Investment (I)',
      X: 'Exports (X)',
      M: 'Imports (M)',
      NX: 'Net Exports (NX)',
      e: 'Exchange Rate (CNY/USD)'
    }
  },
  productionFactors: {
    title: 'Production Factors',
    variables: {
      K: 'Capital (K)',
      L: 'Labor (L)',
      H: 'Human Capital (H)',
      A: 'TFP (A)',
      K_next: 'Next Period Capital (K_next)',
      A_next: 'Next Period TFP (A_next)',
      L_next: 'Next Period Labor (L_next)'
    }
  },
  policyAndExogenous: {
    title: 'Policy and Exogenous Variables',
    variables: {
      s: 'Saving Rate (s)',
      fdi_ratio: 'FDI Ratio',
      Y_star: 'Foreign Income (Y_star)',
      G: 'Government Spending (G)',
      openness: 'Trade Openness'
    }
  }
};

// Chart component for a single variable
const VariableChart = ({ simulationResults, variable, variableName, colorIndex = 0 }) => {
  // Extract years and variable values from simulation results
  const years = simulationResults.map(result => result.year);
  const values = simulationResults.map(result => result[variable]);

  // Determine if we need more decimal places for small values
  const needsMoreDecimals = Math.max(...values.map(v => Math.abs(v))) < 1;
  const decimalPlaces = needsMoreDecimals ? 4 : 2;

  // Prepare data for the chart
  const data = {
    labels: years,
    datasets: [
      {
        label: variableName,
        data: values,
        borderColor: chartColors[colorIndex % chartColors.length].borderColor,
        backgroundColor: chartColors[colorIndex % chartColors.length].backgroundColor,
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
        text: `${variableName} (1980-2025)`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${variableName}: ${context.parsed.y.toFixed(decimalPlaces)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: variableName
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
    <Box sx={{ height: 250, mb: 2 }}>
      <Line data={data} options={options} />
    </Box>
  );
};

// Component for comparing multiple variables in one chart
const ComparisonChart = ({ simulationResults, variables }) => {
  // Extract years from simulation results
  const years = simulationResults.map(result => result.year);

  // Prepare datasets for each variable
  const datasets = variables.map((variable, index) => {
    const values = simulationResults.map(result => result[variable.key]);
    return {
      label: variable.name,
      data: values,
      borderColor: chartColors[index % chartColors.length].borderColor,
      backgroundColor: chartColors[index % chartColors.length].backgroundColor,
      tension: 0.3,
    };
  });

  // Prepare data for the chart
  const data = {
    labels: years,
    datasets: datasets,
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
        text: 'Variable Comparison (1980-2025)',
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Value'
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
    <Box sx={{ height: 300, mb: 2 }}>
      <Line data={data} options={options} />
    </Box>
  );
};

const SimulationCharts = ({ simulationResults }) => {
  // If there are no simulation results, return null
  if (!simulationResults || simulationResults.length === 0) {
    return null;
  }

  // State for the active tab
  const [activeTab, setActiveTab] = useState(0);

  // State for comparison chart variables
  const [comparisonVariables, setComparisonVariables] = useState([
    { key: 'Y', name: 'GDP (Y)' },
    { key: 'C', name: 'Consumption (C)' }
  ]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Get all available variables for comparison
  const allVariables = Object.entries(variableCategories).flatMap(([categoryKey, category]) =>
    Object.entries(category.variables).map(([key, name]) => ({ key, name }))
  );

  // Handle adding a variable to comparison
  const handleAddVariable = (index, variableKey) => {
    const newComparisonVariables = [...comparisonVariables];
    const selectedVariable = allVariables.find(v => v.key === variableKey);
    if (selectedVariable) {
      newComparisonVariables[index] = selectedVariable;
      setComparisonVariables(newComparisonVariables);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Simulation Charts
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="chart tabs">
          <Tab label="Economic Indicators" />
          <Tab label="Production Factors" />
          <Tab label="Policy & Exogenous" />
          <Tab label="Compare Variables" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={2}>
          {Object.entries(variableCategories.economicIndicators.variables).map(([key, name], index) => (
            <Grid xs={12} sm={6} key={key}>
              <VariableChart
                simulationResults={simulationResults}
                variable={key}
                variableName={name}
                colorIndex={index}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={2}>
          {Object.entries(variableCategories.productionFactors.variables).map(([key, name], index) => (
            <Grid xs={12} sm={6} key={key}>
              <VariableChart
                simulationResults={simulationResults}
                variable={key}
                variableName={name}
                colorIndex={index}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={2}>
          {Object.entries(variableCategories.policyAndExogenous.variables).map(([key, name], index) => (
            <Grid xs={12} sm={6} key={key}>
              <VariableChart
                simulationResults={simulationResults}
                variable={key}
                variableName={name}
                colorIndex={index}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 3 && (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Compare Variables
            </Typography>
            <Typography variant="body2" paragraph>
              Select variables to compare their trends over time.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {comparisonVariables.map((variable, index) => (
                <Grid xs={12} sm={6} md={4} key={index}>
                  <FormControl fullWidth>
                    <InputLabel>Variable {index + 1}</InputLabel>
                    <Select
                      value={variable.key}
                      label={`Variable ${index + 1}`}
                      onChange={(e) => handleAddVariable(index, e.target.value)}
                    >
                      {allVariables.map(v => (
                        <MenuItem key={v.key} value={v.key}>{v.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
          </Box>

          <ComparisonChart
            simulationResults={simulationResults}
            variables={comparisonVariables}
          />
        </>
      )}
    </Paper>
  );
};

export default SimulationCharts;
