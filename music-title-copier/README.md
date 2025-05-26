# Music Title Copier

A Next.js web application that extracts song titles and artist names from music streaming URLs (YouTube Music, Spotify, etc.) for easy copying and pasting into search engines.

## Features

- **Two-column layout** for easy workflow
- **URL extraction** from pasted text blobs
- **Metadata fetching** from music streaming services
- **Artist-Title formatting** for clean search queries
- **One-click copying** to clipboard
- **Support for multiple platforms** (YouTube Music, Spotify, Apple Music, etc.)

## How to Use

1. **Paste URLs**: In the left column, paste any text containing music URLs
2. **Extract Titles**: Click the "Extract Titles" button to process the URLs
3. **Copy Titles**: Use the "Copy" button next to each extracted title to copy it to your clipboard
4. **Search**: Paste the copied title into your preferred search engine

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Clone the repository or download the files
2. Navigate to the project directory:

   ```bash
   cd music-title-copier
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technical Details

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Metadata Extraction**: Custom API route using node-html-parser
- **Browser API**: Clipboard API for copying functionality

## Supported Platforms

- YouTube Music
- Spotify
- Apple Music
- Generic websites with Open Graph metadata

## Building for Production

```bash
npm run build
npm start
```

## License

This project is for educational and personal use.
