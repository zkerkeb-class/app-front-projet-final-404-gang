# Spotify Clone Application

A modern web application that replicates core Spotify features using React and modern web technologies.

## Features

### Authentication
- User registration with email verification
- Login system with "Remember Me" functionality
- Password recovery option

### Core Music Player Features
- Full-screen player with waveform visualization
- Play/Pause functionality
- Next/Previous track controls
- Shuffle mode
- Repeat modes (Off/All/One)
- Progress bar with seek functionality
- Volume control
- High-quality audio playback

### UI Components
- Responsive sidebar navigation
- Dark/Light theme support
- Now Playing bar with minimized controls
- Horizontal scrolling lists for playlists and tracks
- Beautiful image loading with format fallbacks (avif/webp/jpg)

### Playlist Management
- Create and manage playlists
- Add/Remove tracks from playlists
- "Liked Songs" playlist
- Playlist shuffle functionality

## Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v7
- **Styling**: TailwindCSS
- **State Management**: Context API
- **Icons**: Heroicons
- **Internationalization**: i18next
- **Audio Processing**: Web Audio API

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone https://github.com/zkerkeb-class/app-front-projet-final-404-gang.git
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

## Project Structure

- `/src`
  - `/components` - Reusable UI components
  - `/contexts` - React Context providers
  - `/hooks` - Custom React hooks
  - `/pages` - Main application pages
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions

## Custom Hooks

- \`useAudioPlayer\` - Manages audio playback state and controls
- \`useWaveform\` - Generates and manages audio waveform visualization
- \`useTheme\` - Handles theme switching functionality

## Context Providers

- \`ThemeContext\` - Manages application-wide theme state
- \`PlaylistContext\` - Handles playlist and track management

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## Security Notes

- Secure authentication system with token-based access
- Environment variables for sensitive data
- Input validation and sanitization
- Secure password handling

## License

This project is part of a coding course and is used for educational purposes.
