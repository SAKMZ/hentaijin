# Complete Deployment Guide

## Overview

This project has been completely restructured to use external APIs and a Flask backend proxy. The system now consists of:

1. **Next.js Frontend** - User interface and server-side rendering
2. **Flask Backend** - Database operations and external API proxy
3. **External APIs** - `api.hentaijin.com` for metadata
4. **CDN** - `cdn.hentaijin.com` for images

## ✅ Completed Features

### 🔄 **API Integration**

- ✅ Updated to use `api.hentaijin.com/{id}/metadata` for gallery metadata
- ✅ Updated to use `cdn.hentaijin.com/{id}/image?page={number}` for images
- ✅ Flask backend proxy handles database operations
- ✅ Automatic fallback to local database if external API fails

### 🔍 **Advanced Search**

- ✅ Advanced search component with multiple filters
- ✅ Include any/all tags, exclude tags
- ✅ Page count, rating, favorites filters
- ✅ Date range filtering
- ✅ Multiple sort options
- ✅ Search suggestions with real-time API calls
- ✅ Query parsing and validation

### 🐍 **Flask Backend**

- ✅ Complete Flask API with MongoDB integration
- ✅ Advanced search with MongoDB queries
- ✅ Collection browsing (categories, tags, artists, characters)
- ✅ Search suggestions endpoint
- ✅ Site statistics endpoint
- ✅ Health check endpoint
- ✅ 20 sample galleries with realistic data

### 🎨 **Frontend Improvements**

- ✅ Enhanced gallery cards with ratings
- ✅ Dynamic navigation menu
- ✅ Advanced search component
- ✅ Search suggestions component
- ✅ Updated image generation with new CDN format
- ✅ Consistent error handling

### 🧹 **Code Cleanup**

- ✅ Removed MongoDB direct integration from frontend
- ✅ Removed old API endpoints
- ✅ Updated all imports and dependencies
- ✅ Consistent typing throughout
- ✅ Clean separation of concerns

## 🚀 Deployment Instructions

### 1. Flask Backend Deployment

#### Option A: Local Development

```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Option B: Production with Gunicorn

```bash
cd backend
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Option C: Docker Deployment

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### 2. Next.js Frontend Deployment

#### Environment Variables (Netlify/Vercel)

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.hentaijin.com
NEXT_PUBLIC_CDN_BASE_URL=https://cdn.hentaijin.com
NEXT_PUBLIC_DOMAIN_URL=https://your-domain.com
FLASK_BACKEND_URL=https://your-flask-backend-url.com
```

#### Netlify Deployment

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables above
5. Deploy

### 3. Database Setup

The Flask backend automatically:

- Connects to MongoDB Atlas
- Initializes 20 sample galleries on first run
- Creates proper indexes for searching

## 📁 New File Structure

```
ProjectHJIN/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── AdvancedSearch.tsx  # NEW: Advanced search form
│   └── SearchSuggestions.tsx # NEW: Search suggestions
├── lib/
│   ├── client-api.ts       # API calls to Flask backend
│   ├── collections.ts      # Collection utilities
│   ├── utils.ts           # Image URL generation
│   ├── config.ts          # Updated configuration
│   └── advanced-search.ts  # NEW: Advanced search utilities
├── pages/api/             # Next.js API routes (proxy to Flask)
│   ├── galleries/         # Gallery endpoints
│   ├── collections/       # Collection endpoints
│   ├── search/           # Search endpoints
│   └── stats.ts          # Statistics endpoint
├── types/
│   └── gallery.ts         # Updated with rating field
└── backend/               # NEW: Flask backend
    ├── app.py            # Main Flask application
    ├── requirements.txt  # Python dependencies
    └── README.md         # Backend documentation
```

## 🔄 API Flow

```
Frontend → Next.js API Routes → Flask Backend → MongoDB/External API
```

**Example Request Flow:**

1. User searches for galleries
2. Frontend calls `/api/galleries` (Next.js)
3. Next.js forwards to Flask backend
4. Flask queries MongoDB and/or external API
5. Results returned through the chain

## 🧪 Testing

### Test Flask Backend

```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/stats
curl -X POST http://localhost:5000/api/galleries -H "Content-Type: application/json" -d '{"search":"vanilla"}'
```

### Test Frontend

```bash
npm run dev
# Visit http://localhost:3000
# Try advanced search at /search
```

## 📊 Key Features

### Advanced Search Operators

- `tag1 tag2` - Include any of these tags
- `"exact phrase"` - Exact match
- `!exclude` - Exclude tag
- `pages:10-50` - Page range
- `rating:>=8` - Rating filter
- `category:Doujinshi` - Category filter
- `artist:ArtistName` - Artist filter

### External API Integration

- Primary: `api.hentaijin.com/{id}/metadata`
- Fallback: Local MongoDB database
- Images: `cdn.hentaijin.com/{id}/image?page={num}`

### Performance Features

- Search suggestions with debouncing
- Pagination for all endpoints
- MongoDB indexing for fast queries
- Fallback mechanisms for reliability

## 🔧 Troubleshooting

### Common Issues

1. **Flask backend not starting**

   - Check MongoDB connection string
   - Ensure Python dependencies installed
   - Check port 5000 availability

2. **No search results**

   - Verify Flask backend is running
   - Check sample data initialization
   - Test MongoDB connection

3. **Images not loading**
   - Verify CDN URLs are correct
   - Check external API availability
   - Test image generation functions

### Environment Variables

Make sure these are set correctly:

- `FLASK_BACKEND_URL` - Points to your Flask backend
- `MONGODB_URI` - Valid MongoDB connection string
- `NEXT_PUBLIC_CDN_BASE_URL` - CDN base URL

## 🎯 Production Checklist

- [ ] Flask backend deployed and accessible
- [ ] MongoDB Atlas connection working
- [ ] Environment variables configured
- [ ] External API endpoints tested
- [ ] CDN image loading verified
- [ ] Advanced search functionality tested
- [ ] Sample data initialized
- [ ] Error handling working
- [ ] Performance optimized

The system is now ready for production deployment with full advanced search capabilities and external API integration!
