import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { YEAR_TO_ROUND, resetExogenousVariables } from '../model/EconomicModel';

const ExogenousVariables = ({ exogenousVariables, onExogenousVariablesChange }) => {
  const [localExogenousVariables, setLocalExogenousVariables] = useState(
    JSON.parse(JSON.stringify(exogenousVariables))
  );

  // Update local state when props change
  useEffect(() => {
    setLocalExogenousVariables(JSON.parse(JSON.stringify(exogenousVariables)));
  }, [exogenousVariables]);

  // Variable descriptions for tooltips
  const variableDescriptions = {
    fdi_ratio: "Foreign Direct Investment inflows as a fraction of GDP. Higher values indicate more foreign investment.",
    Y_star: "Foreign income index (1980 = 1000). Represents the growth of foreign economies that import Chinese goods.",
    H: "Human capital index. Represents the quality and education level of the labor force.",
    G: "Government Spending (bn USD). Represents the expenditure by the government on goods and services.",
    L: "Labor Force (million). Represents the total number of workers in the economy."
  };

  // Handle input change for a specific year and variable
  const handleInputChange = (year, variable, value) => {
    const newValue = value === '' ? '' : Number(value);

    // Only update if it's a valid number
    if (newValue === '' || !isNaN(newValue)) {
      const updatedVariables = { ...localExogenousVariables };
      updatedVariables[year] = {
        ...updatedVariables[year],
        [variable]: newValue === '' ? '' : newValue
      };
      setLocalExogenousVariables(updatedVariables);
    }
  };

  // Apply changes to the parent component
  const handleApplyChanges = () => {
    // Convert any empty string values to numbers
    const processedVariables = {};
    Object.keys(localExogenousVariables).forEach(year => {
      processedVariables[year] = {};
      Object.keys(localExogenousVariables[year]).forEach(variable => {
        const value = localExogenousVariables[year][variable];
        processedVariables[year][variable] = value === '' ? 0 : value;
      });
    });

    onExogenousVariablesChange(processedVariables);
  };

  // Reset to original values
  const handleResetChanges = () => {
    // Reset the exogenous variables to their default values
    const defaultVariables = resetExogenousVariables();

    // Update the local state
    setLocalExogenousVariables(JSON.parse(JSON.stringify(defaultVariables)));

    // Update the parent component's state
    onExogenousVariablesChange(defaultVariables);
  };

  // Get years in chronological order
  const years = Object.keys(localExogenousVariables)
    .map(year => parseInt(year))
    .sort((a, b) => a - b);

  // Get variable names from the first year (assuming all years have the same variables)
  const firstYear = years[0];
  const variables = firstYear ? Object.keys(localExogenousVariables[firstYear]) : [];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Exogenous Variables (1980-2025)
      </Typography>

      <Typography variant="body2" paragraph>
        These variables represent external factors that affect the Chinese economy but are not directly controlled by policy decisions.
        You can modify these values to create different economic scenarios.
      </Typography>

      <TableContainer sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Year</TableCell>
              {variables.map(variable => (
                <TableCell key={variable} align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {variable === 'fdi_ratio' ? 'FDI Ratio' :
                     variable === 'Y_star' ? 'Foreign Income' :
                     variable === 'H' ? 'Human Capital' :
                     variable === 'G' ? 'Government Spending' :
                     variable === 'L' ? 'Labor Force' : variable}
                    <Tooltip title={variableDescriptions[variable] || ''}>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {years.map(year => (
              <TableRow key={year}>
                <TableCell component="th" scope="row">
                  {year} {year === 1980 ? '(Start)' : year === 2025 ? '(End)' : ''}
                </TableCell>
                {variables.map(variable => (
                  <TableCell key={`${year}-${variable}`} align="center">
                    <TextField
                      value={localExogenousVariables[year][variable]}
                      onChange={(e) => handleInputChange(year, variable, e.target.value)}
                      variant="outlined"
                      size="small"
                      type="number"
                      inputProps={{
                        step: variable === 'fdi_ratio' ? 0.001 : 0.01,
                        min: variable === 'G' ? null : 0, // Allow negative values for Government Spending
                        style: { textAlign: 'center' }
                      }}
                      sx={{ width: '100px' }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResetChanges}
        >
          Reset to Original Values
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApplyChanges}
        >
          Apply Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default ExogenousVariables;
