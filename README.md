# Music Player

A desktop music player application that allows you to play local music files and search/download music from YouTube.

## Features

- Play local music files
- Create and manage playlists
- Search and download music from YouTube
- Modern and responsive UI with dark/light mode
- Control playback (play, pause, skip, volume, etc.)
- Sort and filter your music library

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v16+)
- npm or yarn
- A YouTube Data API key (for YouTube search functionality)

## Installation

1. Clone or download this repository
2. Install dependencies:
```
npm install
```
3. Run the development server:
```
npm run dev
```

## Building for Production

To build the application for production, run:
```
npm run build
```

This will create a distributable package in the `dist` folder.

## Usage

### Adding Local Music

1. Go to the "Library" tab
2. Click the "Import" button to select a folder containing your music files

### Searching YouTube

1. Go to the "Search" tab
2. Enter your search query
3. Click on a result to play it directly or download it to your local library

### Settings

Configure various aspects of the app in the Settings tab:
- Playback options
- Audio quality
- YouTube API key
- And more!

## Technologies Used

- Electron - Desktop application framework
- React - UI framework
- Material-UI - Component library
- Howler.js - Audio library
- YouTube API - For searching and downloading music

## License

This project is licensed under the ISC License. 