import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { resetParameters } from '../model/EconomicModel';

const ParameterSettings = ({ parameters, onParametersChange }) => {
  const [localParameters, setLocalParameters] = useState({ ...parameters });

  // Update local state when props change
  useEffect(() => {
    setLocalParameters({ ...parameters });
  }, [parameters]);

  const handleSliderChange = (param) => (event, newValue) => {
    setLocalParameters({
      ...localParameters,
      [param]: newValue
    });
  };

  // Define parameter ranges
  const paramRanges = {
    alpha: { min: 0.1, max: 0.9 },
    delta: { min: 0.01, max: 0.2 },
    g: { min: 0.001, max: 0.05 },
    theta: { min: 0.01, max: 0.5 },
    phi: { min: 0.01, max: 0.5 },
    epsilon_x: { min: 0.5, max: 3.0 },
    epsilon_m: { min: 0.5, max: 3.0 },
    mu_x: { min: 0.5, max: 2.0 },
    mu_m: { min: 0.5, max: 2.0 }
  };

  const handleInputChange = (param) => (event) => {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    const { min, max } = paramRanges[param];

    if (value === '' || (value >= min && value <= max)) {
      setLocalParameters({
        ...localParameters,
        [param]: value
      });
    }
  };

  const handleApplyChanges = () => {
    onParametersChange(localParameters);
  };

  const handleResetDefaults = () => {
    // Reset the parameters to their default values
    const defaultParameters = resetParameters();

    // Update the local state
    setLocalParameters({ ...defaultParameters });

    // Update the parent component's state
    onParametersChange(defaultParameters);
  };

  // Group parameters by category
  const productionParams = ['alpha'];
  const capitalParams = ['delta'];
  const growthParams = ['g', 'theta', 'phi'];
  const tradeParams = ['epsilon_x', 'epsilon_m', 'mu_x', 'mu_m'];

  const renderParameterSlider = (param, label, min, max, step, description) => {
    // Update the paramRanges object with the current min/max values
    paramRanges[param] = { min, max };

    return (
      <Box sx={{ mb: 2 }}>
        <Typography id={`${param}-slider`} gutterBottom>
          {label}: {localParameters[param].toFixed(4)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Slider
            value={typeof localParameters[param] === 'number' ? localParameters[param] : min}
            onChange={handleSliderChange(param)}
            aria-labelledby={`${param}-slider`}
            valueLabelDisplay="auto"
            step={step}
            min={min}
            max={max}
            sx={{ flexGrow: 1, mr: 2 }}
          />
          <TextField
            value={localParameters[param]}
            onChange={handleInputChange(param)}
            onBlur={() => {
              // Handle empty values on blur
              if (localParameters[param] === '') {
                setLocalParameters({
                  ...localParameters,
                  [param]: min
                });
              }
            }}
            inputProps={{
              step,
              min,
              max,
              type: 'number',
              'aria-labelledby': `${param}-slider`,
            }}
            sx={{ width: 80 }}
            size="small"
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Model Parameters
      </Typography>

      <Typography variant="body2" paragraph>
        Adjust the parameters to explore different economic scenarios. Changes will apply to the next round.
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Production Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderParameterSlider(
            'alpha',
            'Capital Share (α)',
            0.1,
            0.9,
            0.01,
            'Share of capital in production function. Higher values give more weight to capital in determining output.'
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Capital Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderParameterSlider(
            'delta',
            'Depreciation Rate (δ)',
            0.01,
            0.2,
            0.01,
            'Rate at which capital depreciates each period. Higher values mean capital wears out faster.'
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Growth Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderParameterSlider(
              'g',
              'Baseline TFP Growth (g)',
              0.001,
              0.05,
              0.001,
              'Baseline growth rate of total factor productivity. Higher values mean faster technological progress.'
            )}


            {renderParameterSlider(
              'theta',
              'Openness Contribution (θ)',
              0.01,
              0.5,
              0.01,
              'Contribution of trade openness to TFP growth. Higher values mean trade has a stronger effect on productivity.'
            )}

            {renderParameterSlider(
              'phi',
              'FDI Contribution (φ)',
              0.01,
              0.5,
              0.01,
              'Contribution of foreign direct investment to TFP growth. Higher values mean FDI has a stronger effect on productivity.'
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Trade Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderParameterSlider(
              'epsilon_x',
              'Export Exchange Rate Elasticity (εx)',
              0.5,
              3.0,
              0.1,
              'Sensitivity of exports to exchange rate changes. Higher values mean exports respond more strongly to currency changes.'
            )}

            {renderParameterSlider(
              'epsilon_m',
              'Import Exchange Rate Elasticity (εm)',
              0.5,
              3.0,
              0.1,
              'Sensitivity of imports to exchange rate changes. Higher values mean imports respond more strongly to currency changes.'
            )}

            {renderParameterSlider(
              'mu_x',
              'Export Income Elasticity (μx)',
              0.5,
              2.0,
              0.1,
              'Sensitivity of exports to foreign income changes. Higher values mean exports respond more strongly to foreign growth.'
            )}

            {renderParameterSlider(
              'mu_m',
              'Import Income Elasticity (μm)',
              0.5,
              2.0,
              0.1,
              'Sensitivity of imports to domestic income changes. Higher values mean imports respond more strongly to domestic growth.'
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResetDefaults}
        >
          Reset to Defaults
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

export default ParameterSettings;
