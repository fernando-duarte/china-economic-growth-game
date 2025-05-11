import React, { useState } from 'react';
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
  Select,
  MenuItem,
  TextField,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { ROUND_TO_YEAR } from '../model/EconomicModel';

const PolicyPlanner = ({ initialPolicies, onPoliciesSubmit }) => {
  // Initialize policies for all periods
  const [policies, setPolicies] = useState(initialPolicies);

  // Policy descriptions for tooltips
  const policyDescriptions = {
    exchangeRate: "Nominal exchange rate in CNY per USD. Higher values represent a weaker yuan (more CNY per USD), making exports cheaper and imports more expensive. Lower values represent a stronger yuan (fewer CNY per USD), making exports more expensive and imports cheaper.",
    savingRate: "Saving rate determines what fraction of GDP is saved and available for investment. Higher values increase investment but reduce consumption."
  };

  // Handle exchange rate change
  const handleExchangeRateChange = (year, value) => {
    const numValue = parseFloat(value);

    // Validate input (must be positive)
    if (isNaN(numValue) || numValue <= 0) {
      return;
    }

    setPolicies(prevPolicies => ({
      ...prevPolicies,
      [year]: {
        ...prevPolicies[year],
        exchangeRate: numValue
      }
    }));
  };

  // Handle saving rate change
  const handleSavingRateChange = (year, value) => {
    const numValue = parseFloat(value);

    // Validate input (must be between 0 and 1)
    if (isNaN(numValue) || numValue < 0 || numValue > 1) {
      return;
    }

    setPolicies(prevPolicies => ({
      ...prevPolicies,
      [year]: {
        ...prevPolicies[year],
        savingRate: numValue
      }
    }));
  };

  // Handle submit
  const handleSubmit = () => {
    onPoliciesSubmit(policies);
  };

  // Get years in chronological order
  const years = Object.keys(policies)
    .map(year => parseInt(year))
    .sort((a, b) => a - b);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Policy Planning (1980-2025)
      </Typography>

      <Typography variant="body2" paragraph>
        Set your economic policies for all time periods. The simulation will run through all periods using these policies.
      </Typography>

      <TableContainer sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Year</TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Exchange Rate (CNY/USD)
                  <Tooltip title={policyDescriptions.exchangeRate}>
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Saving Rate
                  <Tooltip title={policyDescriptions.savingRate}>
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {years.map(year => (
              <TableRow key={year}>
                <TableCell component="th" scope="row">
                  {year} {year === 1980 ? '(Start)' : year === 2025 ? '(End)' : ''}
                </TableCell>
                <TableCell align="center">
                  <TextField
                    value={policies[year].exchangeRate}
                    onChange={(e) => handleExchangeRateChange(year, e.target.value)}
                    variant="outlined"
                    size="small"
                    type="number"
                    inputProps={{
                      step: 0.1,
                      min: 0.1,
                      style: { textAlign: 'center' }
                    }}
                    sx={{ width: '100px' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    value={policies[year].savingRate}
                    onChange={(e) => handleSavingRateChange(year, e.target.value)}
                    variant="outlined"
                    size="small"
                    type="number"
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 1,
                      style: { textAlign: 'center' }
                    }}
                    sx={{ width: '100px' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          size="large"
        >
          Run Simulation
        </Button>
      </Box>
    </Paper>
  );
};

export default PolicyPlanner;
