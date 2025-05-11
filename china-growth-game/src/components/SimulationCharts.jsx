import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
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

// Historical data from China Economic Data (1980-2024)
const historicalData = {
  // Years with data
  years: [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2021, 2022, 2023, 2024],

  // Economic indicators
  Y: [191.15, 309.49, 360.85, 734.55, 1211.35, 2285.97, 6086.00, 11061.00, 14723.00, 17734.10, 17882.00, 18273.00, 19530.00], // GDP (bn USD)
  X: [19.41, 25.80, 49.13, 131.86, 253.09, 773.34, 1654.82, 2362.10, 2729.88, 3554.11, 3717.89, 3513.24, 3580.00], // Exports (bn USD)
  M: [21.84, 38.30, 38.46, 119.90, 224.31, 648.71, 1432.42, 2003.26, 2374.74, 3093.28, 3140.04, 3127.20, 2590.00], // Imports (bn USD)
  C: [123.65, 201.39, 229.68, 433.84, 770.06, 1243.21, 2977.44, 5972.23, 8071.33, 9420.00, 10000.00, 10500.00, 11250.00], // Consumption (bn USD)
  I: [66.15, 120.90, 123.26, 285.28, 406.69, 922.30, 2833.95, 4782.44, 6370.00, 6840.00, 7520.00, 7270.00, 7500.00], // Investment (bn USD)
  e: [1.50, 2.94, 4.78, 8.35, 8.28, 8.19, 6.77, 6.23, 6.90, 6.45, 6.73, 7.07, 7.00], // FX Rate (CNY/USD)

  // Production factors
  K: [2050.10, 3062.30, 4507.30, 7287.10, 12185.20, 21265.50, 39311.20, 68791.70, 100000.00, 102500.00, 105000.00, 107500.00, 110000.00], // Capital Stock (2017 USD bn)
  L: [428.30, 496.80, 550.80, 629.00, 679.50, 748.70, 783.00, 797.00, 787.10, 786.00, 783.00, 780.00, 778.00], // Labor Force (million)
  H: [1.58, 1.77, 1.80, 2.02, 2.24, 2.43, 2.61, 2.60, 6.71, 6.52, 6.49, null, null], // Human Capital Index
  A: [0.832, 0.878, 0.805, 0.869, 0.810, 0.895, 1.031, 1.019, 0.936, 0.951, 0.961, 0.971, 0.979], // TFP (2017 = 1)

  // Policy and exogenous variables
  s: [0.34, 0.35, 0.37, 0.41, 0.36, 0.46, 0.51, 0.46, 0.45, 0.44, 0.45, 0.42, 0.43], // Saving Rate
  G: [3.78, -0.30, -2.76, 3.47, 5.82, -4.17, 52.21, -52.51, -73.47, 1013.27, -215.85, 116.96, -210.00], // Government Spending (bn USD)

  // Derived variables
  NX: [-2.43, -12.50, 10.67, 11.96, 28.78, 124.63, 222.40, 358.84, 355.14, 460.83, 577.85, 386.04, 990.00], // Net Exports (bn USD) (calculated as X - M)
  openness: [(19.41 + 21.84) / 191.15, (25.80 + 38.30) / 309.49, (49.13 + 38.46) / 360.85, (131.86 + 119.90) / 734.55,
             (253.09 + 224.31) / 1211.35, (773.34 + 648.71) / 2285.97, (1654.82 + 1432.42) / 6086.00,
             (2362.10 + 2003.26) / 11061.00, (2729.88 + 2374.74) / 14723.00, (3554.11 + 3093.28) / 17734.10,
             (3717.89 + 3140.04) / 17882.00, (3513.24 + 3127.20) / 18273.00, (3580.00 + 2590.00) / 19530.00] // Trade Openness (calculated as (X + M) / Y)
};

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

  // Check if we have historical data for this variable
  const hasHistoricalData = historicalData[variable] !== undefined;

  // Filter historical data to match the simulation years (1980-2025)
  let historicalYears = [];
  let historicalValues = [];

  if (hasHistoricalData) {
    // Filter historical data to only include years that match our simulation years
    historicalYears = historicalData.years.filter(year => year <= 2025);
    historicalValues = historicalData[variable].slice(0, historicalYears.length);
  }

  // Prepare datasets for the chart
  const datasets = [
    {
      label: `${variableName} (Model)`,
      data: values,
      borderColor: chartColors[colorIndex % chartColors.length].borderColor,
      backgroundColor: chartColors[colorIndex % chartColors.length].backgroundColor,
      tension: 0.3,
    }
  ];

  // Add historical data if available
  if (hasHistoricalData) {
    datasets.push({
      label: `${variableName} (Historical)`,
      data: historicalValues,
      borderColor: 'rgb(128, 128, 128)',
      backgroundColor: 'rgba(128, 128, 128, 0.5)',
      borderDash: [5, 5],
      tension: 0.3,
      pointStyle: 'triangle',
    });
  }

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
  const datasets = [];

  // Add model data for each variable
  variables.forEach((variable, index) => {
    const values = simulationResults.map(result => result[variable.key]);
    datasets.push({
      label: `${variable.name} (Model)`,
      data: values,
      borderColor: chartColors[index % chartColors.length].borderColor,
      backgroundColor: chartColors[index % chartColors.length].backgroundColor,
      tension: 0.3,
    });

    // Add historical data if available
    if (historicalData[variable.key] !== undefined) {
      // Filter historical data to only include years that match our simulation years
      const historicalYears = historicalData.years.filter(year => year <= 2025);
      const historicalValues = historicalData[variable.key].slice(0, historicalYears.length);

      datasets.push({
        label: `${variable.name} (Historical)`,
        data: historicalValues,
        borderColor: chartColors[index % chartColors.length].borderColor,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderDash: [5, 5],
        tension: 0.3,
        pointStyle: 'triangle',
      });
    }
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {Object.entries(variableCategories.economicIndicators.variables).map(([key, name], index) => (
            <Box key={key} sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}>
              <VariableChart
                simulationResults={simulationResults}
                variable={key}
                variableName={name}
                colorIndex={index}
              />
            </Box>
          ))}
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {Object.entries(variableCategories.productionFactors.variables).map(([key, name], index) => (
            <Box key={key} sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}>
              <VariableChart
                simulationResults={simulationResults}
                variable={key}
                variableName={name}
                colorIndex={index}
              />
            </Box>
          ))}
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {Object.entries(variableCategories.policyAndExogenous.variables).map(([key, name], index) => (
            <Box key={key} sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}>
              <VariableChart
                simulationResults={simulationResults}
                variable={key}
                variableName={name}
                colorIndex={index}
              />
            </Box>
          ))}
        </Box>
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

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {comparisonVariables.map((variable, index) => (
                <Box key={index} sx={{ width: { xs: '100%', sm: '48%', md: '31%' } }}>
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
                </Box>
              ))}
            </Box>
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
