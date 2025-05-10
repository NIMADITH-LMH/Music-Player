import React from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';

const Player = ({ currentTrack, isPlaying, setIsPlaying }) => {
  return (
    <Box
      sx={{
        height: 90,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      {/* Track Info */}
      <Box sx={{ width: 200 }}>
        {currentTrack ? (
          <>
            <Typography variant="subtitle1" noWrap>
              {currentTrack.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {currentTrack.artist}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">
            No track selected
          </Typography>
        )}
      </Box>

      {/* Player Controls */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small">
            <ShuffleIcon fontSize="small" />
          </IconButton>
          <IconButton>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton 
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton>
            <SkipNextIcon />
          </IconButton>
          <IconButton size="small">
            <RepeatIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', maxWidth: 600 }}>
          <Typography variant="caption" color="text.secondary">0:00</Typography>
          <Slider
            size="small"
            sx={{ mx: 1 }}
          />
          <Typography variant="caption" color="text.secondary">0:00</Typography>
        </Box>
      </Box>

      {/* Volume Control */}
      <Box sx={{ width: 200, display: 'flex', alignItems: 'center', gap: 1 }}>
        <VolumeUpIcon fontSize="small" />
        <Slider size="small" defaultValue={70} />
      </Box>
    </Box>
  );
};

export default Player;
