import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const MainContent = ({ setCurrentTrack }) => {
  const moods = [
    { name: 'Relax', icon: <MoodIcon /> },
    { name: 'Sleep', icon: <NightlifeIcon /> },
    { name: 'Sad', icon: <SentimentSatisfiedIcon /> },
    { name: 'Energize', icon: <LocalFireDepartmentIcon /> },
    { name: 'Party', icon: <CelebrationIcon /> },
    { name: 'Focus', icon: <AutoAwesomeIcon /> }
  ];

  return (
    <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
      <Container>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Discover Music
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Search for songs, artists, or albums
          </Typography>
          <Box
            component="input"
            sx={{
              width: '100%',
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              color: 'text.primary',
              '&:focus': {
                outline: 'none',
                borderColor: 'primary.main',
              },
            }}
            placeholder="Search for songs, artists, or albums"
          />
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Browse by Mood
        </Typography>
        <Grid container spacing={2}>
          {moods.map((mood) => (
            <Grid item xs={6} sm={4} md={2} key={mood.name}>
              <Button
                variant="contained"
                sx={{
                  width: '100%',
                  height: '100px',
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                }}
              >
                {mood.icon}
                {mood.name}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Recently Played
        </Typography>
        <Box sx={{ height: 200, bgcolor: 'background.paper', borderRadius: 1, p: 2 }}>
          <Typography color="text.secondary">
            Your recently played tracks will appear here
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default MainContent;
