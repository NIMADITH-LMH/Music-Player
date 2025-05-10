const { contextBridge, ipcRenderer } = require('electron');

// Set of active subscriptions for cleanup
const activeSubscriptions = new Set();

// Helper function to create a subscription that can be cleaned up
function createSubscription(channel, callback) {
  ipcRenderer.on(channel, callback);
  const subscription = { channel, callback };
  activeSubscriptions.add(subscription);
  
  return () => {
    ipcRenderer.removeListener(channel, callback);
    activeSubscriptions.delete(subscription);
  };
}

// Clean up subscriptions when window unloads
window.addEventListener('unload', () => {
  for (const { channel, callback } of activeSubscriptions) {
    ipcRenderer.removeListener(channel, callback);
  }
  activeSubscriptions.clear();
});

// Expose protected methods that allow the renderer process to use IPC
contextBridge.exposeInMainWorld('api', {
  // Window control functions
  windowControl: async (command) => {
    try {
      await ipcRenderer.invoke('window-control', command);
    } catch (error) {
      console.error('Error in window control:', error);
    }
  },

  // Get window state
  isMaximized: async () => {
    try {
      return await ipcRenderer.invoke('window-is-maximized');
    } catch (error) {
      console.error('Error checking window state:', error);
      return false;
    }
  },

  // Music library functions
  selectMusicFolders: async () => {
    try {
      const result = await ipcRenderer.invoke('select-multiple-music-folders');
      return result;
    } catch (error) {
      console.error('Error selecting music folders:', error);
      return { success: false, error: error.message };
    }
  },

  importProjectMusic: async () => {
    try {
      const result = await ipcRenderer.invoke('import-project-music');
      return result;
    } catch (error) {
      console.error('Error importing project music:', error);
      return { success: false, error: error.message };
    }
  },

  clearLibrary: async () => {
    try {
      const result = await ipcRenderer.invoke('clear-music-library');
      return result;
    } catch (error) {
      console.error('Error clearing library:', error);
      return { success: false, error: error.message };
    }
  },

  removeMusicFolder: async (folderName) => {
    try {
      const result = await ipcRenderer.invoke('remove-music-folder', folderName);
      return result;
    } catch (error) {
      console.error('Error removing folder:', error);
      return { success: false, error: error.message };
    }
  },

  loadMusicLibrary: async () => {
    try {
      const result = await ipcRenderer.invoke('load-music-library');
      return result;
    } catch (error) {
      console.error('Error loading music library:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Add send method for splash screen
  send: (channel, data) => {
    // Whitelist channels for security
    const validChannels = ['splash-screen-ready'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    } else {
      console.error(`Unauthorized IPC channel: ${channel}`);
    }
  },

  // Event subscriptions
  onMusicFilesUpdated: (callback) => {
    return createSubscription('music-files-updated', (event, data) => callback(data));
  },

  // Window state change subscription
  onWindowStateChange: (callback) => {
    return createSubscription('window-state-change', (event, isMaximized) => {
      callback(isMaximized);
    });
  }
}); 