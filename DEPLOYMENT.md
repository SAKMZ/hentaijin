# Deployment Guide

## Environment Variables for Netlify

Add these environment variables in your Netlify deployment settings:

```
MONGODB_URI=mongodb+srv://saifalimz:897689@Sakmz@cluster0.cso7q.mongodb.net/
NEXT_PUBLIC_CDN_BASE_URL=https://cdn.hentaijin.com
NEXT_PUBLIC_DOMAIN_URL=https://your-domain.netlify.app
```

## Database Setup

The application will automatically:

- Connect to MongoDB Atlas using the provided connection string
- Initialize 20 sample gallery entries on first run
- Create collections for categories, tags, artists, characters, and languages

## CDN Configuration

Images are served from: `https://cdn.hentaijin.com/{hentai_id}/{paddedIndex}.webp`

Example: `https://cdn.hentaijin.com/100001/01.webp`

## Features Implemented

✅ Removed front page stats section  
✅ MongoDB Atlas integration  
✅ Dynamic navigation menu with Categories, Tags, Artists, Characters  
✅ 20 sample database entries with all required fields  
✅ Enhanced search functionality (title, tags, artists, characters, categories)  
✅ Cleaned up gallery cards (removed non-functional buttons)  
✅ API-based architecture for proper server-side database operations

## Build Notes

The application now uses Next.js API routes for all database operations to avoid client-side MongoDB bundling issues. All database operations are handled server-side through the `/api/` endpoints.
