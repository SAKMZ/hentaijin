# Backend Testing Guide

## Fixed Issues ✅

1. **WebP to JPG Fallback**: Backend now automatically tries JPG when WebP is not available
2. **Proper Headers**: Added content-type and cache-control headers for images
3. **URL Configuration**: Fixed CDN_BASE_URL to match backend port (3000)
4. **Enhanced Error Handling**: Better logging and error responses

## Testing Dynamic Image Loading

### 1. Start the Backend Server

```bash
cd backend
node backend-complete.js
```

Expected output should show:

```
🚀 Proxy server running on port 3000
📋 Available endpoints:
   GET /api/galleries - List galleries
   GET /api/gallery/:id - Get gallery metadata
   GET /api/search?q=term - Search galleries
   GET /api/:galleryId/:imageName - Serve images (with WebP→JPG fallback)
   GET /debug/image/:galleryId/:imageName - Debug image availability
   GET /health - Health check

🖼️  Image serving: WebP first, JPG fallback
🌐 Frontend should connect to: http://localhost:3000 or http://128.140.78.75:3000
```

### 2. Test Endpoints

**Health Check:**

```bash
curl http://128.140.78.75:3000/health
```

**Gallery Metadata:**

```bash
curl http://128.140.78.75:3000/api/gallery/100
```

**Debug Image Availability:**

```bash
curl http://128.140.78.75:3000/debug/image/100/01.webp
curl http://128.140.78.75:3000/debug/image/100/01.jpg
```

**Direct Image Loading:**

```bash
curl -I http://128.140.78.75:3000/api/100/01.webp
curl -I http://128.140.78.75:3000/api/100/01.jpg
```

### 3. Frontend Testing

1. Start your Next.js frontend
2. Navigate to a gallery page: `/g/100`
3. Check browser developer tools:
   - Network tab should show image requests to `http://128.140.78.75:3000/api/`
   - WebP images should load first, with JPG fallback if needed
   - Proper cache headers should be present

### 4. Expected Image Loading Flow

```
Frontend Request: /api/100/01.webp
      ↓
Backend checks: 100/01.webp exists in S3?
      ↓
If YES: Serve WebP with proper headers
If NO:  Try 100/01.jpg as fallback
      ↓
If JPG exists: Serve JPG with proper headers
If not found: Return 404
```

## Configuration

Make sure your `.env` file contains:

```
MONGO_URI=mongodb://username:password@host:port/database
MONGO_DB=your_database_name
E2_ENDPOINT=your_s3_endpoint
E2_KEY=your_access_key
E2_SECRET=your_secret_key
E2_BUCKET=your_bucket_name
```

## Frontend Configuration

The frontend should use these URLs:

- API calls: `http://128.140.78.75:3000`
- CDN images: `http://128.140.78.75:3000`

Both are now configured to use port 3000.

## Troubleshooting

1. **Images not loading**: Check the debug endpoint to see if images exist in S3
2. **CORS errors**: Backend has CORS enabled with `Access-Control-Allow-Origin: *`
3. **MongoDB errors**: Backend continues to work without MongoDB for image serving
4. **WebP not supported**: Backend automatically falls back to JPG

## Key Backend Improvements Made

- ✅ WebP → JPG automatic fallback
- ✅ Proper image content-type headers
- ✅ Cache-Control headers (1 year cache)
- ✅ ETag support for better caching
- ✅ Enhanced error logging
- ✅ Debug endpoint for troubleshooting
- ✅ S3 existence check before streaming
- ✅ Better error handling for streams
