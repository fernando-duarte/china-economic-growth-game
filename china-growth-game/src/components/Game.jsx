import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import {
  calculateRound,
  initializeGame,
  advanceRound,
  getParameters,
  updateParameters,
  getExogenousVariables,
  updateExogenousVariables,
  ROUND_TO_YEAR
} from '../model/EconomicModel';

import ParameterSettings from './ParameterSettings';
import ExogenousVariables from './ExogenousVariables';
import PolicyPlanner from './PolicyPlanner';
import GDPChart from './GDPChart';

const Game = () => {
  // Game state
  const [gameState, setGameState] = useState(initializeGame());
  const [simulationResults, setSimulationResults] = useState([]);
  const [isSimulationRun, setIsSimulationRun] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [modelParameters, setModelParameters] = useState(getParameters());
  const [exogenousVariables, setExogenousVariables] = useState(getExogenousVariables());
  const [restartDialogOpen, setRestartDialogOpen] = useState(false);

  // Initialize policies for all periods
  const [policies, setPolicies] = useState(() => {
    const years = Object.keys(ROUND_TO_YEAR).map(round => ROUND_TO_YEAR[round]);
    const initialPolicies = {};

    years.forEach(year => {
      // Set default exchange rate based on historical data
      let defaultExchangeRate;
      let defaultSavingRate;

      if (year === 1980) {
        defaultExchangeRate = 1.50;
        defaultSavingRate = 0.34;
      }
      else if (year === 1985) {
        defaultExchangeRate = 2.94;
        defaultSavingRate = 0.35;
      }
      else if (year === 1990) {
        defaultExchangeRate = 4.78;
        defaultSavingRate = 0.37;
      }
      else if (year === 1995) {
        defaultExchangeRate = 8.35;
        defaultSavingRate = 0.41;
      }
      else if (year === 2000) {
        defaultExchangeRate = 8.28;
        defaultSavingRate = 0.36;
      }
      else if (year === 2005) {
        defaultExchangeRate = 8.19;
        defaultSavingRate = 0.46;
      }
      else if (year === 2010) {
        defaultExchangeRate = 6.77;
        defaultSavingRate = 0.51;
      }
      else if (year === 2015) {
        defaultExchangeRate = 6.23;
        defaultSavingRate = 0.46;
      }
      else if (year === 2020) {
        defaultExchangeRate = 6.90;
        defaultSavingRate = 0.45;
      }
      else if (year === 2025) {
        defaultExchangeRate = 7.00; // Using 2024 value
        defaultSavingRate = 0.43;   // Using 2024 value
      }

      initialPolicies[year] = {
        exchangeRate: defaultExchangeRate,
        savingRate: defaultSavingRate
      };
    });

    return initialPolicies;
  });

  // Calculate initial simulation if needed
  useEffect(() => {
    if (gameState.round === 0 && !isSimulationRun) {
      // We'll handle this in the runSimulation function
    }
  }, [gameState, isSimulationRun]);

  // Run the full simulation with the provided policies
  const runSimulation = (submittedPolicies) => {
    // Reset the game state
    const initialState = initializeGame();
    let currentState = { ...initialState };
    const results = [];

    // Run through all rounds (0 to 9)
    for (let round = 0; round <= 9; round++) {
      const year = ROUND_TO_YEAR[round];
      const policy = submittedPolicies[year];

      // Calculate the results for this round
      const roundResult = calculateRound(
        round,
        currentState,
        policy.exchangeRate, // Now passing the direct exchange rate
        policy.savingRate
      );

      // Save the results
      results.push(roundResult);

      // Advance to the next round if not the last round
      if (round < 9) {
        currentState = advanceRound(currentState, roundResult);
      }
    }

    // Update the state with the simulation results
    setSimulationResults(results);
    setIsSimulationRun(true);
  };

  // Handle policies submission
  const handlePoliciesSubmit = (submittedPolicies) => {
    setPolicies(submittedPolicies);
    runSimulation(submittedPolicies);
  };

  // Handle opening the restart dialog
  const handleOpenRestartDialog = () => {
    setRestartDialogOpen(true);
  };

  // Handle closing the restart dialog
  const handleCloseRestartDialog = () => {
    setRestartDialogOpen(false);
  };

  // Handle starting a new game
  const handleNewGame = () => {
    const newState = initializeGame();
    setGameState(newState);
    setSimulationResults([]);
    setIsSimulationRun(false);

    // Reset policies to default
    const years = Object.keys(ROUND_TO_YEAR).map(round => ROUND_TO_YEAR[round]);
    const initialPolicies = {};

    years.forEach(year => {
      // Set default exchange rate based on historical data
      let defaultExchangeRate;
      let defaultSavingRate;

      if (year === 1980) {
        defaultExchangeRate = 1.50;
        defaultSavingRate = 0.34;
      }
      else if (year === 1985) {
        defaultExchangeRate = 2.94;
        defaultSavingRate = 0.35;
      }
      else if (year === 1990) {
        defaultExchangeRate = 4.78;
        defaultSavingRate = 0.37;
      }
      else if (year === 1995) {
        defaultExchangeRate = 8.35;
        defaultSavingRate = 0.41;
      }
      else if (year === 2000) {
        defaultExchangeRate = 8.28;
        defaultSavingRate = 0.36;
      }
      else if (year === 2005) {
        defaultExchangeRate = 8.19;
        defaultSavingRate = 0.46;
      }
      else if (year === 2010) {
        defaultExchangeRate = 6.77;
        defaultSavingRate = 0.51;
      }
      else if (year === 2015) {
        defaultExchangeRate = 6.23;
        defaultSavingRate = 0.46;
      }
      else if (year === 2020) {
        defaultExchangeRate = 6.90;
        defaultSavingRate = 0.45;
      }
      else if (year === 2025) {
        defaultExchangeRate = 7.00; // Using 2024 value
        defaultSavingRate = 0.43;   // Using 2024 value
      }

      initialPolicies[year] = {
        exchangeRate: defaultExchangeRate,
        savingRate: defaultSavingRate
      };
    });

    setPolicies(initialPolicies);

    // Close the dialog if it's open
    setRestartDialogOpen(false);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle parameter changes
  const handleParametersChange = (newParameters) => {
    const updatedParameters = updateParameters(newParameters);
    setModelParameters(updatedParameters);

    // Note: Changes will be applied when the simulation is run again
  };

  // Handle exogenous variables changes
  const handleExogenousVariablesChange = (newExogenousVariables) => {
    const updatedExogenousVariables = updateExogenousVariables(newExogenousVariables);
    setExogenousVariables(updatedExogenousVariables);

    // Note: Changes will be applied when the simulation is run again
  };

  return (
    <Box>
      {/* Restart Confirmation Dialog */}
      <Dialog
        open={restartDialogOpen}
        onClose={handleCloseRestartDialog}
        aria-labelledby="restart-dialog-title"
        aria-describedby="restart-dialog-description"
      >
        <DialogTitle id="restart-dialog-title">
          Restart Game?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="restart-dialog-description">
            Are you sure you want to restart the game? All current progress will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRestartDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewGame} color="secondary" autoFocus>
            Restart
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            China Economic Growth Model (1980-2025)
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleOpenRestartDialog}
            size="small"
          >
            Restart Game
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="game tabs">
            <Tab label="Policy Planning" />
            <Tab label="Simulation Results" />
            <Tab label="Model Parameters" />
            <Tab label="Exogenous Variables" />
          </Tabs>
        </Box>

        {activeTab === 0 ? (
          <>
            <PolicyPlanner
              initialPolicies={policies}
              onPoliciesSubmit={handlePoliciesSubmit}
            />
          </>
        ) : activeTab === 1 ? (
          <>
            {isSimulationRun ? (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Simulation Results (1980-2025)
                </Typography>

                <Typography variant="body2" paragraph>
                  These are the economic outcomes based on your policy decisions.
                </Typography>

                <TableContainer sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell align="right">GDP (Y)</TableCell>
                        <TableCell align="right">Consumption (C)</TableCell>
                        <TableCell align="right">Investment (I)</TableCell>
                        <TableCell align="right">Exports (X)</TableCell>
                        <TableCell align="right">Imports (M)</TableCell>
                        <TableCell align="right">Net Exports (NX)</TableCell>
                        <TableCell align="right">Exchange Rate (CNY/USD)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {simulationResults.map((result, index) => (
                        <TableRow key={result.year}>
                          <TableCell component="th" scope="row">
                            {result.year} {result.year === 1980 ? '(Start)' : result.year === 2025 ? '(End)' : ''}
                          </TableCell>
                          <TableCell align="right">{result.Y.toFixed(2)}</TableCell>
                          <TableCell align="right">{result.C.toFixed(2)}</TableCell>
                          <TableCell align="right">{result.I.toFixed(2)}</TableCell>
                          <TableCell align="right">{result.X.toFixed(2)}</TableCell>
                          <TableCell align="right">{result.M.toFixed(2)}</TableCell>
                          <TableCell align="right">{result.NX.toFixed(2)}</TableCell>
                          <TableCell align="right">{result.e.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {simulationResults.length > 0 && (
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Final Results
                    </Typography>
                    <Typography variant="body1">
                      Final GDP: {simulationResults[simulationResults.length - 1].Y.toFixed(2)} billion USD
                    </Typography>
                    <Typography variant="body1">
                      GDP Growth: {((simulationResults[simulationResults.length - 1].Y / 191.15) * 100 - 100).toFixed(2)}% since 1980
                    </Typography>
                  </Box>
                )}
              </Paper>
            ) : (
              <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  No Simulation Results Yet
                </Typography>
                <Typography variant="body1" paragraph>
                  Go to the Policy Planning tab to set your policies and run the simulation.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveTab(0)}
                >
                  Go to Policy Planning
                </Button>
              </Paper>
            )}
          </>
        ) : activeTab === 2 ? (
          <ParameterSettings
            parameters={modelParameters}
            onParametersChange={handleParametersChange}
          />
        ) : (
          <ExogenousVariables
            exogenousVariables={exogenousVariables}
            onExogenousVariablesChange={handleExogenousVariablesChange}
          />
        )}
      </Paper>

      {/* GDP Chart - Always visible regardless of active tab */}
      {isSimulationRun && (
        <GDPChart simulationResults={simulationResults} />
      )}
    </Box>
  );
};

export default Game;
