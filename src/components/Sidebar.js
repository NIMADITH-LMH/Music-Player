import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = () => {
  return (
    <Box sx={{ 
      width: 240, 
      bgcolor: 'background.paper',
      borderRight: 1,
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Music Player
        </Typography>
      </Box>
      <List>
        <ListItem button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <LibraryMusicIcon />
          </ListItemIcon>
          <ListItemText primary="My Library" />
        </ListItem>
      </List>
      <Box sx={{ mt: 'auto' }}>
        <List>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
