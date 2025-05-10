# Vanilla JavaScript Music Player

This music player is implemented using pure HTML, CSS, and JavaScript without any JSX or React components.

## Project Structure

- `static.html`: The main application HTML file with embedded JavaScript
- `styles/`: CSS styles for the application
- `index.js`: Simple entry point for webpack (just imports CSS)
- `main.js`: Electron main process code
- `preload.js`: Script to safely expose APIs to the renderer process

## Building and Running

The application can be built and run using:

```
npm run build   # Build the application
npm start       # Run the application
```

For development:

```
npm run dev
```

## Features

- Play local MP3 files
- Import music from various folders
- Control playback (play, pause, skip, etc.)
- Modern UI with dark/light mode
- Library management 