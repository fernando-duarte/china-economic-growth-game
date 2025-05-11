import { useState } from 'react'
import { CssBaseline, Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material'
import './App.css'
import Game from './components/Game'
import Instructions from './components/Instructions'

function App() {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            China Economic Growth Model
          </Typography>
          <Button
            color="inherit"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ my: 4 }}>
          {showInstructions && <Instructions />}
          <Game />
        </Box>
      </Container>
    </>
  )
}

export default App
