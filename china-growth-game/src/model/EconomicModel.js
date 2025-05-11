/**
 * Economic Model for China Growth Game
 * This file contains the logic for the economic model calculations
 */

// Default parameters
const DEFAULT_PARAMETERS = {
  alpha: 0.30,           // Capital share in production
  delta: 0.10,           // Depreciation rate
  g: 0.005,              // Baseline TFP growth rate
  theta: 0.1453,         // Openness contribution to TFP growth
  phi: 0.10,             // FDI contribution to TFP growth
  K0: 2050.10,           // Initial level of physical capital (1980)
  X0: 18.10,             // Initial level of exports (1980)
  M0: 14.50,             // Initial level of imports (1980)
  A0: 0.832,             // Initial level of TFP (1980) - using historical data value
  epsilon_x: 1.5,        // Exchange-rate elasticity (exports)
  epsilon_m: 1.2,        // Exchange-rate elasticity (imports)
  mu_x: 1.0,             // Income elasticity (exports)
  mu_m: 1.0,             // Income elasticity (imports)
  e0: 1.5,               // Initial exchange rate (1980) - now directly set
};

// Current parameters (can be modified by the user)
let PARAMETERS = { ...DEFAULT_PARAMETERS };

// Default exogenous variables by year (5-year intervals)
const DEFAULT_EXOGENOUS_VARIABLES = {
  1980: { fdi_ratio: 0.001, Y_star: 1000.00, H: 1.58, G: 3.78, L: 428.30 },
  1985: { fdi_ratio: 0.001, Y_star: 1159.27, H: 1.77, G: -0.30, L: 496.80 },
  1990: { fdi_ratio: 0.02, Y_star: 1343.92, H: 1.80, G: -2.76, L: 550.80 },
  1995: { fdi_ratio: 0.02, Y_star: 1557.97, H: 2.02, G: 3.47, L: 629.00 },
  2000: { fdi_ratio: 0.02, Y_star: 1806.11, H: 2.24, G: 5.82, L: 679.50 },
  2005: { fdi_ratio: 0.02, Y_star: 2093.78, H: 2.43, G: -4.17, L: 748.70 },
  2010: { fdi_ratio: 0.02, Y_star: 2427.26, H: 2.61, G: 52.21, L: 783.00 },
  2015: { fdi_ratio: 0.02, Y_star: 2813.86, H: 2.60, G: -52.51, L: 797.00 },
  2020: { fdi_ratio: 0.02, Y_star: 3262.04, H: 6.71, G: -73.47, L: 787.10 },
  2025: { fdi_ratio: 0.02, Y_star: 3781.60, H: 6.49, G: -210.00, L: 778.00 }, // Using 2024 value for G and L
};

// Current exogenous variables (can be modified by the user)
let EXOGENOUS_VARIABLES = JSON.parse(JSON.stringify(DEFAULT_EXOGENOUS_VARIABLES));

// Year mapping to round number
const YEAR_TO_ROUND = {
  1980: 0,
  1985: 1,
  1990: 2,
  1995: 3,
  2000: 4,
  2005: 5,
  2010: 6,
  2015: 7,
  2020: 8,
  2025: 9,
};

// Round number to year mapping
const ROUND_TO_YEAR = Object.fromEntries(
  Object.entries(YEAR_TO_ROUND).map(([year, round]) => [round, parseInt(year)])
);

/**
 * Calculate the economic variables for a given round
 * @param {number} round - The current round (0-9)
 * @param {object} state - The current state of the game
 * @param {number} e - Nominal exchange rate (CNY per USD)
 * @param {number} s - Saving rate (0.0 to 1.0)
 * @returns {object} - The calculated economic variables
 */
export function calculateRound(round, state, e, s) {
  const year = ROUND_TO_YEAR[round];
  const exogenous = EXOGENOUS_VARIABLES[year];

  // Get current state values
  let { K, A } = state;

  // Use labor force from exogenous variables
  let L = exogenous.L;

  // If it's the first round, use initial values for K and A
  if (round === 0) {
    K = PARAMETERS.K0;
    A = PARAMETERS.A0;
  }

  // Step 4: Compute output/production
  const Y = A * Math.pow(K, PARAMETERS.alpha) * Math.pow(L * exogenous.H, 1 - PARAMETERS.alpha);

  // Step 6: Compute exports
  const X = PARAMETERS.X0 * Math.pow(e / PARAMETERS.e0, PARAMETERS.epsilon_x) *
            Math.pow(exogenous.Y_star / EXOGENOUS_VARIABLES[1980].Y_star, PARAMETERS.mu_x);

  // Step 7: Compute imports
  const M = PARAMETERS.M0 * Math.pow(e / PARAMETERS.e0, -PARAMETERS.epsilon_m) *
            Math.pow(Y / 191.15, PARAMETERS.mu_m); // 191.15 is Y_1980

  // Step 8: Compute net exports
  const NX = X - M;

  // Step 9: Compute openness ratio
  const openness = (X + M) / Y;

  // Step 10: Compute consumption (now accounting for government spending)
  const C = (1 - s) * (Y - exogenous.G);

  // Step 11: Compute investment (now accounting for government spending)
  const I = s * (Y - exogenous.G) - NX;

  // Step 12: Get next period's labor force from exogenous variables
  let L_next = L; // Default to current value

  // If not the last round, get the next period's labor force from exogenous variables
  if (round < 9) {
    const nextYear = ROUND_TO_YEAR[round + 1];
    L_next = EXOGENOUS_VARIABLES[nextYear].L;
  }

  // Step 13: Compute next period's capital
  const K_next = (1 - PARAMETERS.delta) * K + I;

  // Step 14: Compute next period's TFP
  const A_next = A * (1 + PARAMETERS.g + PARAMETERS.theta * openness + PARAMETERS.phi * exogenous.fdi_ratio);

  return {
    year,
    Y,
    K,
    L,
    A,
    X,
    M,
    NX,
    openness,
    C,
    I,
    e,
    fdi_ratio: exogenous.fdi_ratio,
    Y_star: exogenous.Y_star,
    H: exogenous.H,
    G: exogenous.G,
    L_next,
    K_next,
    A_next,
    s
  };
}

/**
 * Initialize a new game
 * @returns {object} - The initial game state
 */
export function initializeGame() {
  return {
    round: 0,
    K: PARAMETERS.K0,
    A: PARAMETERS.A0,
    history: [],
  };
}

/**
 * Advance to the next round
 * @param {object} state - The current game state
 * @param {object} roundResult - The result of the current round
 * @returns {object} - The new game state
 */
export function advanceRound(state, roundResult) {
  const newState = {
    ...state,
    round: state.round + 1,
    K: roundResult.K_next,
    A: roundResult.A_next,
    history: [...state.history, roundResult],
  };

  return newState;
}

/**
 * Update the model parameters
 * @param {object} newParameters - The new parameter values
 */
export function updateParameters(newParameters) {
  PARAMETERS = { ...PARAMETERS, ...newParameters };
  return { ...PARAMETERS };
}

/**
 * Reset parameters to default values
 */
export function resetParameters() {
  PARAMETERS = { ...DEFAULT_PARAMETERS };
  return { ...PARAMETERS };
}

/**
 * Get the current parameters
 */
export function getParameters() {
  return { ...PARAMETERS };
}

/**
 * Update the exogenous variables
 * @param {object} newExogenousVariables - The new exogenous variable values
 */
export function updateExogenousVariables(newExogenousVariables) {
  EXOGENOUS_VARIABLES = JSON.parse(JSON.stringify(newExogenousVariables));
  return JSON.parse(JSON.stringify(EXOGENOUS_VARIABLES));
}

/**
 * Reset exogenous variables to default values
 */
export function resetExogenousVariables() {
  EXOGENOUS_VARIABLES = JSON.parse(JSON.stringify(DEFAULT_EXOGENOUS_VARIABLES));
  return JSON.parse(JSON.stringify(EXOGENOUS_VARIABLES));
}

/**
 * Get the current exogenous variables
 */
export function getExogenousVariables() {
  return JSON.parse(JSON.stringify(EXOGENOUS_VARIABLES));
}

export { DEFAULT_PARAMETERS, DEFAULT_EXOGENOUS_VARIABLES, YEAR_TO_ROUND, ROUND_TO_YEAR };
