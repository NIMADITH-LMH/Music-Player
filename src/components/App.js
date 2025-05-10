import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Player from './Player';

const App = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <MainContent setCurrentTrack={setCurrentTrack} />
      </Box>
      <Player 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </Box>
  );
};

export default App;
