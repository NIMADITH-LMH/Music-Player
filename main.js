const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: true,
    backgroundColor: '#121212'
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools in development.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Show window when ready and load music library
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Set up music library update handler
  mainWindow.webContents.on('did-finish-load', async () => {
    const library = await loadMusicLibrary();
    if (library && library.validatedMusicByFolder) {
      mainWindow.webContents.send('music-files-updated', library.validatedMusicByFolder);
    }
  });
};


// Set up IPC handlers for music library management
ipcMain.handle('get-music-library', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const libraryPath = path.join(userDataPath, 'musicLibrary.json');
    
    if (!fs.existsSync(libraryPath)) {
      return {
        success: true,
        musicByFolder: {}
      };
    }

    const data = await fs.promises.readFile(libraryPath, 'utf8');
    const library = JSON.parse(data);
    
    // Validate that each folder and file still exists
    const validatedLibrary = {};
    const accessErrors = [];
    
    for (const [folderName, tracks] of Object.entries(library)) {
      const validTracks = tracks.filter(track => {
        try {
          fs.accessSync(track.path, fs.constants.R_OK);
          return true;
        } catch (err) {
          console.warn(`File not accessible: ${track.path}`);
          return false;
        }
      });
      
      if (validTracks.length > 0) {
        validatedLibrary[folderName] = validTracks;
      } else {
        accessErrors.push(folderName);
      }
    }
    
    // If library was changed, save the updated version
    if (Object.keys(validatedLibrary).length !== Object.keys(library).length) {
      await fs.promises.writeFile(libraryPath, JSON.stringify(validatedLibrary, null, 2));
    }
    
    return {
      success: true,
      musicByFolder: validatedLibrary,
      accessErrors: accessErrors.length > 0 ? accessErrors : undefined
    };
  } catch (error) {
    console.error('Error loading music library:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// Handle import from project folder
ipcMain.handle('import-project-music', async () => {
  try {
    // Ensure the app is fully initialized
    if (!mainWindow) {
      return {
        success: false,
        error: 'Application not fully initialized yet. Please try again in a moment.'
      };
    }

    const projectPath = path.join(__dirname);
    const musicFolderPath = path.join(__dirname, 'music'); // Add specific path to music subfolder
    console.log('Attempting to access project music folder:', musicFolderPath);
    
    // Create music folder if it doesn't exist
    if (!fs.existsSync(musicFolderPath)) {
      try {
        fs.mkdirSync(musicFolderPath, { recursive: true });
        console.log('Created music folder:', musicFolderPath);
      } catch (err) {
        console.error('Failed to create music folder:', err);
        return {
          success: false,
          error: `Could not create music folder: ${err.message}`
        };
      }
    }
    
    // Check if we can access the folder
    try {
      fs.accessSync(musicFolderPath, fs.constants.R_OK);
    } catch (accessErr) {
      console.error('Cannot access music folder:', accessErr);
      return {
        success: false,
        error: `Cannot access music folder: ${accessErr.message}. Please ensure the folder has proper permissions.`
      };
    }
      
      console.log('Successfully accessed music folder, scanning for audio files...');
      const supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];
      
      // Get all music files from the project directory
      let musicFiles = [];
      
      // Function to recursively process directories
      const processDirectory = (dirPath, isRootDir = false) => {
        console.log('Processing directory:', dirPath);
        try {
          const files = fs.readdirSync(dirPath);
          
          for (const file of files) {
            try {
              const filePath = path.join(dirPath, file);
              const stats = fs.statSync(filePath);
              
              if (stats.isDirectory() && !isRootDir) {
                // Only scan subdirectories of the music folder, not the entire project
                processDirectory(filePath, false);
              } else if (stats.isFile()) {
                const ext = path.extname(file).toLowerCase();
                if (supportedFormats.includes(ext)) {
                  const relativePath = path.relative(musicFolderPath, filePath);
                  musicFiles.push({
                    title: path.parse(file).name,
                    path: filePath,
                    fileName: file,
                    folderName: 'Project Music',
                    format: ext.substring(1).toUpperCase(),
                    size: stats.size
                  });
                  console.log('Found music file:', file);
                }
              }
            } catch (fileErr) {
              console.warn(`Skipping file/folder access issue: ${file}`, fileErr);
            }
          }
        } catch (dirErr) {
          console.error(`Error reading directory ${dirPath}:`, dirErr);
          throw dirErr;
        }
      };
      
      try {
        // Process music folder
        processDirectory(musicFolderPath, false);
        
        console.log(`Found ${musicFiles.length} music files in project folder`);
        
        if (musicFiles.length === 0) {
          return {
            success: false,
            error: 'No music files found in the project folder. Please add some music files to the "music" folder.'
          };
        }
        
        // Save to library
        try {
          const userDataPath = app.getPath('userData');
          const libraryPath = path.join(userDataPath, 'musicLibrary.json');
          
          // Load existing library
          let existingLibrary = {};
          if (fs.existsSync(libraryPath)) {
            try {
              const data = fs.readFileSync(libraryPath, 'utf8');
              existingLibrary = JSON.parse(data);
            } catch (err) {
              console.warn('Could not parse existing library:', err);
            }
          }
          
          // Add or update the Project Music in library
          existingLibrary['Project Music'] = musicFiles;
          
          // Save updated library
          fs.writeFileSync(libraryPath, JSON.stringify(existingLibrary, null, 2));
          console.log('Saved project music to library');
          
          return {
            success: true,
            musicByFolder: existingLibrary
          };
        } catch (saveErr) {
          console.error('Error saving library:', saveErr);
          return {
            success: false,
            error: `Error saving music library: ${saveErr.message}`
          };
        }
      } catch (err) {
        console.error('Error processing project music:', err);
        return {
          success: false,
          error: `Error processing music files: ${err.message}`
        };
      }
    } catch (error) {
      console.error('Error in import-project-music:', error);
      return {
        success: false,
        error: `Error importing project music: ${error.message}`
      };
    }
  });

  // Handle clear library
  ipcMain.handle('clear-music-library', async () => {
    try {
      const userDataPath = app.getPath('userData');
      const libraryPath = path.join(userDataPath, 'musicLibrary.json');
      
      // Delete the library file if it exists
      if (fs.existsSync(libraryPath)) {
        fs.unlinkSync(libraryPath);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing library:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // Handle remove folder
  ipcMain.handle('remove-music-folder', async (event, folderName) => {
    try {
      const userDataPath = app.getPath('userData');
      const libraryPath = path.join(userDataPath, 'musicLibrary.json');
      
      if (!fs.existsSync(libraryPath)) {
        return {
          success: false,
          error: 'Library file not found'
        };
      }
      
      let musicByFolder;
      try {
        const data = fs.readFileSync(libraryPath, 'utf8');
        musicByFolder = JSON.parse(data);
      } catch (err) {
        console.error('Error reading library file:', err);
        return {
          success: false,
          error: 'Error reading library file: ' + err.message
        };
      }
      
      if (musicByFolder && musicByFolder[folderName]) {
        delete musicByFolder[folderName];
        fs.writeFileSync(libraryPath, JSON.stringify(musicByFolder, null, 2));
        return {
          success: true,
          musicByFolder
        };
      } else {
        return {
          success: false,
          error: 'Folder not found in library'
        };
      }
    } catch (error) {
      console.error('Error removing folder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // Handle load library
  ipcMain.handle('load-library', async () => {
    try {
      const userDataPath = app.getPath('userData');
      const libraryPath = path.join(userDataPath, 'musicLibrary.json');
      
      if (!fs.existsSync(libraryPath)) {
        return {
          success: true,
          musicByFolder: {}
        };
      }

      const libraryData = fs.readFileSync(libraryPath, 'utf8');
      let musicByFolder = JSON.parse(libraryData);
      let accessErrors = [];
      let validatedMusicByFolder = {};

      // Validate each folder and its files exist and are accessible
      for (const [folderName, musicFiles] of Object.entries(musicByFolder)) {
        let validMusicFiles = [];
        let folderAccessible = false;
        
        // First check if at least one file is accessible to determine if folder is accessible
        if (musicFiles && musicFiles.length > 0) {
          for (const musicFile of musicFiles) {
            try {
              // Only check if the file exists, don't try to read it yet
              if (fs.existsSync(musicFile.path)) {
                folderAccessible = true;
                validMusicFiles.push(musicFile);
              }
            } catch (err) {
              console.warn(`File access error: ${musicFile.path}`, err.message);
            }
          }
        }
        
        if (folderAccessible && validMusicFiles.length > 0) {
          validatedMusicByFolder[folderName] = validMusicFiles;
        } else {
          accessErrors.push(folderName);
        }
      }
      
      // If any folders were inaccessible, save the updated library
      if (accessErrors.length > 0) {
        console.warn('Removed inaccessible folders:', accessErrors);
        fs.writeFileSync(libraryPath, JSON.stringify(validatedMusicByFolder));
      }

      return {
        success: true,
        musicByFolder: validatedMusicByFolder,
        accessErrors: accessErrors.length > 0 ? accessErrors : undefined
      };
    } catch (error) {
      console.error('Error loading library:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // Handle load music library request
  ipcMain.handle('load-music-library', async () => {
    try {
      const userDataPath = app.getPath('userData');
      const libraryPath = path.join(userDataPath, 'musicLibrary.json');
      
      if (fs.existsSync(libraryPath)) {
        try {
          const data = fs.readFileSync(libraryPath, 'utf8');
          const library = JSON.parse(data);
          
          // Validate that each folder and file still exists
          const accessErrors = [];
          const validatedLibrary = {};
          
          for (const [folderName, tracks] of Object.entries(library)) {
            const validTracks = tracks.filter(track => {
              try {
                // Check if file exists and is readable
                fs.accessSync(track.path, fs.constants.R_OK);
                return true;
              } catch (err) {
                console.warn(`File not accessible: ${track.path}`);
                return false;
              }
            });
            
            if (validTracks.length > 0) {
              validatedLibrary[folderName] = validTracks;
            } else {
              accessErrors.push(folderName);
            }
          }
          
          // If library was changed, save the updated version
          if (Object.keys(validatedLibrary).length !== Object.keys(library).length ||
              accessErrors.length > 0) {
            fs.writeFileSync(libraryPath, JSON.stringify(validatedLibrary, null, 2));
          }
          
          return {
            success: true,
            musicByFolder: validatedLibrary,
            accessErrors: accessErrors.length > 0 ? accessErrors : undefined
          };
        } catch (err) {
          console.error('Error parsing music library:', err);
          return { 
            success: false,
            error: 'Could not parse music library file.' 
          };
        }
      } else {
        console.log('No existing music library found');
        return { 
          success: true, 
          musicByFolder: {} 
        };
      }
    } catch (error) {
      console.error('Error loading music library:', error);
      return { 
        success: false, 
        error: `Error loading music library: ${error.message}` 
      };
    }
  });

  // Load saved music library on startup with validation
  try {
    const userDataPath = app.getPath('userData');
    const libraryPath = path.join(userDataPath, 'musicLibrary.json');
    
    if (fs.existsSync(libraryPath)) {
      const libraryData = fs.readFileSync(libraryPath, 'utf8');
      let musicByFolder = JSON.parse(libraryData);
      let validatedMusicByFolder = {};
      let accessErrors = [];
      
      // Validate each folder and its files
      for (const [folderName, musicFiles] of Object.entries(musicByFolder)) {
        let validMusicFiles = [];
        let folderAccessible = false;
        
        // Check if at least one file is accessible
        if (musicFiles && musicFiles.length > 0) {
          for (const musicFile of musicFiles) {
            try {
              if (fs.existsSync(musicFile.path)) {
                folderAccessible = true;
                validMusicFiles.push(musicFile);
              }
            } catch (err) {
              console.warn(`File access error on startup: ${musicFile.path}`, err.message);
            }
          }
        }
        
        if (folderAccessible && validMusicFiles.length > 0) {
          validatedMusicByFolder[folderName] = validMusicFiles;
        } else {
          accessErrors.push(folderName);
        }
      }
      
      // If any folders were inaccessible, save the updated library
      if (accessErrors.length > 0) {
        console.warn('Removed inaccessible folders on startup:', accessErrors);
        fs.writeFileSync(libraryPath, JSON.stringify(validatedMusicByFolder));
      }
    }
  } catch (error) {
    console.error('Error loading music library:', error);
  }
};

// Function to load music library on startup
const loadMusicLibrary = async () => {
  try {
    const userDataPath = app.getPath('userData');
    const libraryPath = path.join(userDataPath, 'musicLibrary.json');
    let validatedMusicByFolder = {};
    
    if (fs.existsSync(libraryPath)) {
      const libraryData = fs.readFileSync(libraryPath, 'utf8');
      let musicByFolder = JSON.parse(libraryData);
      let accessErrors = [];
      
      // Validate each folder and its files
      for (const [folderName, musicFiles] of Object.entries(musicByFolder)) {
        let validMusicFiles = [];
        let folderAccessible = false;
        
        // Check if at least one file is accessible
        if (musicFiles && musicFiles.length > 0) {
          for (const musicFile of musicFiles) {
            try {
              if (fs.existsSync(musicFile.path)) {
                folderAccessible = true;
                validMusicFiles.push(musicFile);
              }
            } catch (err) {
              console.warn(`File access error on startup: ${musicFile.path}`, err.message);
            }
          }
        }
        
        if (folderAccessible && validMusicFiles.length > 0) {
          validatedMusicByFolder[folderName] = validMusicFiles;
        } else {
          accessErrors.push(folderName);
        }
      }
      
      // If any folders were inaccessible, save the updated library
      if (accessErrors.length > 0) {
        console.warn('Removed inaccessible folders on startup:', accessErrors);
        fs.writeFileSync(libraryPath, JSON.stringify(validatedMusicByFolder));
      }
    }
    
    return { validatedMusicByFolder };
  } catch (error) {
    console.error('Error loading music library:', error);
    return { error: error.message };
  }
};

// Set up IPC handlers for file operations
ipcMain.handle('select-music-files', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'] }
      ]
    });

    if (result.canceled) {
      return { success: false, error: 'No files selected' };
    }

    return { success: true, files: result.filePaths };
  } catch (error) {
    console.error('Error selecting music files:', error);
    return { success: false, error: error.message };
  }
});

// Initialize app
app.whenReady().then(async () => {
  createWindow();
  await loadMusicLibrary();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, re-create window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
