import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const Instructions = () => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Game Instructions
      </Typography>

      <Typography variant="body1" paragraph>
        Welcome to the China Economic Growth Model simulation! In this game, you will guide China's economic development from 1980 to 2025 by making key policy decisions.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Game Overview
      </Typography>
      <Typography variant="body2" paragraph>
        This simulation is based on an open-economy growth model for China from 1980 to 2025. You will make decisions in 5-year intervals, controlling two key policy variables:
      </Typography>
      <Typography variant="body2" component="ol">
        <li>Exchange Rate Policy: Whether to keep the yuan undervalued, at market value, or overvalued</li>
        <li>Saving Rate: What fraction of GDP should be saved (and thus available for investment)</li>
      </Typography>
      <Typography variant="body2" paragraph>
        Your decisions will affect economic indicators like GDP, consumption, investment, exports, and imports. The goal is to maximize China's economic growth while balancing various economic factors.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Policy Controls
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Exchange Rate Policy:</strong>
      </Typography>
      <Typography variant="body2" component="ul">
        <li><strong>Undervalued (1.2):</strong> Makes exports cheaper and imports more expensive. Boosts export growth but reduces consumption of imports.</li>
        <li><strong>Market Value (1.0):</strong> Neutral policy, letting the exchange rate float at its natural level.</li>
        <li><strong>Overvalued (0.8):</strong> Makes exports more expensive and imports cheaper. Can increase consumption but may hurt export competitiveness.</li>
      </Typography>

      <Typography variant="body2" paragraph sx={{ mt: 2 }}>
        <strong>Saving Rate:</strong> Controls what fraction of GDP is saved (between 0 and 1).
      </Typography>
      <Typography variant="body2" component="ul">
        <li>Higher saving rates increase funds available for investment, which builds capital stock and future production capacity.</li>
        <li>Lower saving rates allow more consumption in the current period, which may improve living standards but reduce future growth.</li>
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Economic Model
      </Typography>
      <Typography variant="body2" paragraph>
        The model includes these key components:
      </Typography>
      <Typography variant="body2" paragraph>
        - <strong>Production:</strong> Output depends on capital, labor, and productivity<br />
        - <strong>Capital Accumulation:</strong> Capital grows through investment<br />
        - <strong>TFP Growth:</strong> Productivity increases with openness to trade<br />
        - <strong>Exports and Imports:</strong> Affected by exchange rate policy<br />
        - <strong>Investment:</strong> Determined by saving rate and trade balance
      </Typography>
      <Typography variant="body2" paragraph>
        The model captures how openness to trade and foreign direct investment can boost productivity growth through technology transfer and competition.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Strategy Tips
      </Typography>
      <Typography variant="body2" paragraph>
        Consider these strategies as you play:
      </Typography>
      <Typography variant="body2" component="ul">
        <li>In early stages, an undervalued exchange rate can boost exports and help build industrial capacity.</li>
        <li>A high saving rate can accelerate capital accumulation but may suppress consumption.</li>
        <li>As the economy matures, you might want to shift toward more balanced policies.</li>
        <li>Watch the openness ratio - higher trade openness can boost TFP growth through technology transfer.</li>
        <li>Balance investment for future growth with consumption for current welfare.</li>
      </Typography>
    </Paper>
  );
};

export default Instructions;
