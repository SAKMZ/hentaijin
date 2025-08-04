# Hetaijin

A modern, mobile-first hentai gallery site built with Next.js 14+ App Router and Tailwind CSS.

## Features

- 🎨 Modern, clean UI with dark theme
- 📱 Mobile-first responsive design
- ⚡ Fast loading with lazy loading and skeleton loaders
- 🔍 Advanced search with filters
- 📄 Pagination for large galleries
- 🏷️ Tag-based browsing
- 🖼️ Optimized image handling with Next.js Image
- ♿ Accessibility features
- 🔧 TypeScript for type safety

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Image Optimization:** Next.js Image component
- **Icons:** Emoji-based (for simplicity)

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

Update `lib/config.ts` to configure:

- API endpoints
- CDN URLs
- Site metadata
- Galleries per page
- Available tags and categories

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
