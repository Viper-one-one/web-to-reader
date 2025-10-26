# WebToReader Frontend

A modern Next.js 15 frontend application for converting web novels into downloadable eBook formats (PDF and EPUB). This application provides an intuitive interface for selecting and downloading web novel content from supported websites.

## Features

- 🎨 **Modern UI**: Clean, responsive design with light/dark theme support
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **Two-Step Process**:
  1. Enter URL and select format
  2. Choose specific volumes to download
- 📦 **Batch Downloads**: Select multiple volumes for combined download
- ⚡ **Real-time Validation**: Instant feedback on form inputs
- 🎯 **User-Friendly**: Clear error messages and loading states
- 🌐 **Backend Integration**: Connects to Flask backend API for processing

## Tech Stack

- **Framework**: [Next.js 15.5.3](https://nextjs.org) with App Router
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Build Tool**: Turbopack (Next.js native bundler)
- **Linting**: ESLint 9.x with Next.js config

## Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager
- WebToReader Backend running on `http://localhost:5000`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Viper-one-one/WebToReader.git
cd WebToReader/web-to-reader
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
web-to-reader/
├── src/
│   └── app/
│       ├── page.tsx                 # Main entry point
│       ├── layout.tsx               # Root layout with metadata
│       ├── globals.css              # Global styles
│       ├── page-components/
│       │   ├── home-page.tsx        # URL input and format selection
│       │   └── selection-page.tsx   # Volume selection and download
│       └── book-selection/
│           └── page.tsx             # Book selection route
├── public/                          # Static assets
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── eslint.config.mjs                # ESLint configuration
└── package.json                     # Dependencies and scripts
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with Turbopack at `http://localhost:3000`

### Production Build
```bash
npm run build
```
Creates an optimized production build with Turbopack

### Production Server
```bash
npm run start
```
Starts the production server (requires `npm run build` first)

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality

## Usage

### Step 1: Enter URL and Format
1. Navigate to the home page
2. Enter the URL of the web novel page (e.g., `https://example.com/novel`)
3. Select the desired format (PDF or EPUB)
4. Click "Submit" to fetch available volumes

### Step 2: Select Volumes
1. Review the list of available volumes
2. Check the boxes for volumes you want to download
3. Click "Download Selected Books"
4. The file will automatically download to your browser's download folder

### Download Behavior
- **Single Volume**: Downloads as a single PDF/EPUB file
- **Multiple Volumes**: Downloads as a ZIP file containing individual PDFs

## API Integration

The frontend communicates with the Flask backend through two main endpoints:

### POST `/process`
Validates URL and retrieves available volumes
```typescript
fetch('http://localhost:5000/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url, format })
})
```

### POST `/download`
Downloads selected volumes in specified format
```typescript
fetch('http://localhost:5000/download', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ selectedBooks, format, url })
})
```

## Components

### HomePage Component (`home-page.tsx`)
- **Purpose**: Initial form for URL and format input
- **State Management**:
  - `formData`: URL and format values
  - `loading`: Loading state during API calls
  - `error`: Error message display
  - `theme`: Light/dark theme toggle
- **Features**:
  - Form validation
  - Error handling
  - Navigation to selection page with state

### SelectionPage Component (`selection-page.tsx`)
- **Purpose**: Volume selection and download interface
- **Props**:
  - `books`: Array of available volumes
  - `format`: Selected format (PDF/EPUB)
  - `url`: Original URL
- **Features**:
  - Multi-select volume checkboxes
  - Batch download handling
  - File download with proper MIME types
  - Error handling for failed downloads

## Styling

The project uses Tailwind CSS 4.x for styling with:
- Responsive design utilities
- Custom color schemes
- Theme support (light/dark)
- Utility-first CSS approach

## Configuration

### Next.js Config (`next.config.ts`)
```typescript
const nextConfig = {
  // Turbopack enabled by default
}
```

### TypeScript Config (`tsconfig.json`)
- Strict mode enabled
- Path aliases configured
- App Router support

### Tailwind Config
- Custom theme extensions
- PostCSS integration
- Content paths configured

## Error Handling

The application includes comprehensive error handling:
- **Network Errors**: Clear messages when backend is unreachable
- **Validation Errors**: Client-side form validation
- **API Errors**: Proper error messages from backend responses
- **Download Errors**: Handles failed downloads gracefully

## Development Tips

1. **Auto-reload**: The development server auto-updates when you edit files
2. **Type Safety**: TypeScript provides compile-time type checking
3. **Component Editing**: Start by modifying components in `src/app/page-components/`
4. **Styling**: Edit `globals.css` for global styles or use Tailwind utilities

## Backend Dependency

This frontend requires the WebToReaderBackend Flask application to be running:
```bash
# In a separate terminal, start the backend
cd ../WebToReaderBackend/web-to-reader-backend
flask run --debug
```

The backend should be accessible at `http://localhost:5000`

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Performance

- **Turbopack**: Ultra-fast bundling and hot module replacement
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component for optimized images
- **Font Optimization**: Automatic font optimization with `next/font`

## Deployment

### Vercel (Recommended)
The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy with one click

### Other Platforms
```bash
npm run build
npm run start
```

Ensure environment variables point to your production backend URL.

## Environment Variables

Create a `.env.local` file for environment-specific configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Troubleshooting

### Backend Connection Error
**Error**: "Failed to connect to server"
**Solution**: Ensure Flask backend is running on port 5000

### CORS Issues
**Error**: CORS policy blocking requests
**Solution**: Verify CORS is properly configured in Flask backend

### Build Errors
**Error**: TypeScript compilation errors
**Solution**: Run `npm run lint` and fix type errors

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub](https://github.com/vercel/next.js) - Feedback and contributions welcome

### Related Projects
- [WebToReaderBackend](https://github.com/Viper-one-one/WebToReaderBackend) - Flask backend API

## License

This project is provided as-is for educational purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org) by Vercel
- Styled with [Tailwind CSS](https://tailwindcss.com)
- TypeScript for type safety

---

**Note**: This application is designed for personal use with content you have the right to download. Please respect copyright laws and website terms of service.
