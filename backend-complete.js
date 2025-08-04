require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const { MongoClient } = require('mongodb');
// const cors = require('cors'); // Install with: npm install cors

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend (install cors: npm install cors)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());

// Setup iDrive E2 S3-compatible storage
const s3 = new AWS.S3({
  endpoint: process.env.E2_ENDPOINT,
  accessKeyId: process.env.E2_KEY,
  secretAccessKey: process.env.E2_SECRET,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

const bucket = process.env.E2_BUCKET;

// Setup MongoDB
let db, galleries;
(async () => {
  try {
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    db = mongoClient.db(process.env.MONGO_DB);
    galleries = db.collection('galleries');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
})();

// ============= GALLERY METADATA API ROUTES =============

// GET /api/galleries - List all galleries with pagination
app.get('/api/galleries', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalItems = await galleries.countDocuments();
    const galleryList = await galleries.find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const formattedGalleries = galleryList.map(g => ({
      id: g.hentai_id,
      title: g.title || `Gallery ${g.hentai_id}`,
      tags: g.tags || [],
      language: g.language || 'unknown',
      totalImages: g.total_images || g.image_count || 20,
      thumbnail: `${req.protocol}://${req.get('host')}/api/${g.hentai_id}/01.jpg`
    }));

    res.json({
      galleries: formattedGalleries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        hasNext: page < Math.ceil(totalItems / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('❌ Error fetching galleries:', err);
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
});

// GET /api/gallery/:id - Get specific gallery metadata
app.get('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await galleries.findOne({ hentai_id: id });
    
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    res.json({
      id: gallery.hentai_id,
      title: gallery.title || `Gallery ${gallery.hentai_id}`,
      tags: gallery.tags || [],
      language: gallery.language || 'unknown',
      totalImages: gallery.total_images || gallery.image_count || 20,
      thumbnail: `${req.protocol}://${req.get('host')}/api/${gallery.hentai_id}/01.jpg`
    });
  } catch (err) {
    console.error('❌ Error fetching gallery:', err);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// GET /api/search?q=term - Search galleries by title and tags
app.get('/api/search', async (req, res) => {
  try {
    const { q: searchTerm, page = 1, limit = 20 } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term required' });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Search in title and tags (case-insensitive)
    const searchQuery = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { tags: { $elemMatch: { $regex: searchTerm, $options: 'i' } } }
      ]
    };

    const totalItems = await galleries.countDocuments(searchQuery);
    const searchResults = await galleries.find(searchQuery)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const formattedGalleries = searchResults.map(g => ({
      id: g.hentai_id,
      title: g.title || `Gallery ${g.hentai_id}`,
      tags: g.tags || [],
      language: g.language || 'unknown',
      totalImages: g.total_images || g.image_count || 20,
      thumbnail: `${req.protocol}://${req.get('host')}/api/${g.hentai_id}/01.jpg`
    }));

    res.json({
      galleries: formattedGalleries,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        totalItems,
        hasNext: pageNum < Math.ceil(totalItems / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (err) {
    console.error('❌ Error searching galleries:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ============= IMAGE SERVING ROUTE (Your Original) =============

// API route to serve image
app.get('/api/:galleryId/:imageName', async (req, res) => {
  const { galleryId, imageName } = req.params;

  try {
    // Step 1: Check if gallery exists in DB
    const found = await galleries.findOne({ hentai_id: galleryId });
    if (!found) {
      return res.status(404).send('Gallery not found in database');
    }

    // Step 2: Try to fetch image from iDrive
    const key = `${galleryId}/${imageName}`;
    const stream = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();

    stream.on('error', err => {
      console.error(`[S3] ${key}:`, err.message);
      res.status(404).send('Image not found in storage');
    });

    stream.pipe(res);
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    res.status(500).send('Internal server error');
  }
});

// ============= HEALTH CHECK =============

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Proxy server running on port ${port}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET /api/galleries - List galleries`);
  console.log(`   GET /api/gallery/:id - Get gallery metadata`);
  console.log(`   GET /api/search?q=term - Search galleries`);
  console.log(`   GET /api/:galleryId/:imageName - Serve images`);
  console.log(`   GET /health - Health check`);
});