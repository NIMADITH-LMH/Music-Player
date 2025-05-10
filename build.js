const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy index.html to dist
fs.copyFileSync(
  path.join(__dirname, 'public', 'index.html'),
  path.join(distDir, 'index.html')
);

// Create a simple bundle.js
const bundle = `
// Simple bundle for demonstration
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  root.innerHTML = '<div style="padding: 20px;"><h1>Music Player</h1><p>Welcome to your Music Player app!</p><p>This is a simplified starter. For the full experience, build the app with webpack.</p></div>';
});
`;

fs.writeFileSync(path.join(distDir, 'renderer.js'), bundle);

console.log('Simple build completed. Files created in dist/ directory.'); 