# Music Player



A beautiful, feature-rich desktop music player application built with Electron and React. Organize and enjoy your local music collection with a modern, responsive interface.

## ✨ Features

- **Elegant UI/UX** - Modern Material UI design with intuitive navigation
- **Library Management** - Organize and browse your music by folders, artists, and albums
- **Playback Controls** - Play, pause, skip tracks, adjust volume, and more
- **Media Info Display** - View track metadata including title, artist, and album
- **Music Discovery** - Browse music by mood and create personalized playlists
- **Responsive Design** - Adaptable interface that works at different window sizes
- **Cross-Platform** - Works on Windows, macOS, and Linux

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** - Version 16 or higher
- **npm** or **yarn** - For package management
- **Git** - For cloning the repository (optional)

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/music-player.git
cd music-player
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Development Mode

Run the application in development mode with hot reloading:

```bash
npm start
# or
yarn start
```

### Build for Production

```bash
npm run build
# or
yarn build
```

## 🎮 Usage

### Adding Music to Your Library

1. Launch the application
2. Navigate to "My Library" in the sidebar
3. Click the "Add Music" button and select a folder containing your music files
4. The application will scan and import your music collection

### Playing Music

1. Browse your music library by folders, artists, or albums
2. Click on a track to start playback
3. Use the player controls at the bottom to:
   - Play/Pause
   - Skip to next/previous track
   - Adjust volume
   - Toggle shuffle and repeat modes

### Browsing by Mood

1. Navigate to the "Discover Music" section
2. Select a mood category (Relax, Sleep, Energize, etc.)
3. Browse and play curated tracks matching your selected mood

## 🛠️ Tech Stack

This application is built with the following technologies:

- **Electron** - Cross-platform desktop app framework
- **React** - UI library for building the interface
- **Material UI** - Component library for modern design
- **Webpack** - Module bundler for application building
- **Babel** - JavaScript compiler

## 📁 Project Structure

```
├── build.js              # Build configuration
├── main.js               # Electron main process
├── preload.js            # Preload script for security
├── index.html            # Main application HTML
├── webpack.config.js     # Webpack configuration
├── public/               # Static public assets
└── src/
    ├── index.js          # Application entry point
    ├── components/       # React components
    │   ├── App.js        # Main App component
    │   ├── MainContent.js # Main content area
    │   ├── Player.js     # Music player controls
    │   └── Sidebar.js    # Application sidebar
    └── styles/           # CSS stylesheets
```

## 🔄 Development Workflow

1. Make changes to the code
2. Run `npm run dev` to watch for changes
3. Test your changes in the running application
4. Build the application with `npm run build`

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request


## 📞 Contact

If you have any questions or feedback, please open an issue on GitHub.

---

Made with ❤️ by [Your Name]

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

