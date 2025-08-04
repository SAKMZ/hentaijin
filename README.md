# Hetaijin

A modern, mobile-first hentai gallery site built with Next.js 14+ App Router and Tailwind CSS.

## Features

- 🎨 Modern, clean UI with dark theme (like Hitomi.la)
- 📱 Mobile-first responsive design
- ⚡ **Fast ZIP-based gallery loading** - Extract webp images client-side
- 🗜️ **Client-side ZIP extraction** using fflate (lightweight, ~20KB)
- 🖼️ **WebP image support** with vertical scrolling gallery viewer
- 🔍 Advanced search with filters
- 📄 Pagination for large galleries
- 🏷️ Tag-based browsing
- ♿ Accessibility features
- 🔧 TypeScript for type safety
- 🚀 **Minimal dependencies** for fast load times

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **ZIP Extraction:** fflate (lightweight, client-side)
- **Image Format:** WebP (optimized for web)
- **CDN:** Configurable via environment variables

## Pages

- **Homepage (`/`)** - Paginated gallery grid with stats
- **Gallery Page (`/g/[id]`)** - Individual gallery with all images
- **Search Page (`/search`)** - Advanced search with filters
- **Tag Page (`/tag/[tagName]`)** - Galleries filtered by tag
- **404 Page** - Custom not found page

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# CDN Configuration (required)
NEXT_PUBLIC_CDN_BASE_URL=https://your-cdn-domain.com

# Optional API endpoint
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### CDN Structure Expected

Your CDN should serve files in this structure:

```
https://your-cdn-domain.com/
├── galleries/
│   ├── 1.zip          # ZIP file containing webp images (1.webp, 2.webp, etc.)
│   ├── 2.zip
│   └── ...
└── thumbnails/
    ├── 1.webp         # Thumbnail for gallery 1
    ├── 2.webp
    └── ...
```

### ZIP File Format

Each gallery ZIP should contain:
- **WebP images** named numerically (1.webp, 2.webp, 3.webp, etc.)
- Images should be **optimized for web** (recommended: 800-1200px width)
- **No subdirectories** - all images in the root of the ZIP

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── g/[id]/            # Gallery detail pages
│   ├── search/            # Search page
│   ├── tag/[tagName]/     # Tag pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── GalleryCard.tsx   # Gallery card component
│   └── SearchBar.tsx     # Search component
├── lib/                  # Utilities and configuration
│   ├── config.ts         # Site configuration
│   ├── mockData.ts       # Mock data for development
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
    └── gallery.ts        # Gallery-related types
```

## Customization

### Theme Colors

Edit the CSS variables in `app/globals.css` to customize the color scheme.

### Mock Data

Replace the mock data in `lib/mockData.ts` with real API calls to your backend.

### Configuration

Update `lib/config.ts` with your actual API endpoints and site settings.

## Deployment

This project can be deployed on any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Docker**

Make sure to set your environment variables in your deployment platform.

## License

This project is for educational purposes. Please ensure you comply with all applicable laws and regulations when deploying.
