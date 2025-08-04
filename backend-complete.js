require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors());
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

// NEW: Get gallery metadata by ID
app.get('/api/gallery/:id', async (req, res) => {
  try {
    const galleryId = req.params.id;
    const gallery = await galleries.findOne({ hentai_id: galleryId });
    
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    // Format for frontend
    const formattedGallery = {
      id: gallery.hentai_id,
      title: gallery.title || `Gallery ${gallery.hentai_id}`,
      tags: gallery.tags || [],
      language: gallery.language || 'unknown',
      totalImages: gallery.total_images || gallery.pages || 1,
      thumbnail: `${req.protocol}://${req.get('host')}/api/${gallery.hentai_id}/01.jpg`
    };

    res.json(formattedGallery);
  } catch (err) {
    console.error('❌ Error fetching gallery:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// NEW: List all galleries with pagination
app.get('/api/galleries', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalGalleries = await galleries.countDocuments();
    const galleryList = await galleries.find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const formattedGalleries = galleryList.map(gallery => ({
      id: gallery.hentai_id,
      title: gallery.title || `Gallery ${gallery.hentai_id}`,
      tags: gallery.tags || [],
      language: gallery.language || 'unknown',
      totalImages: gallery.total_images || gallery.pages || 1,
      thumbnail: `${req.protocol}://${req.get('host')}/api/${gallery.hentai_id}/01.jpg`
    }));

    res.json({
      galleries: formattedGalleries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalGalleries / limit),
        totalItems: totalGalleries,
        hasNext: page < Math.ceil(totalGalleries / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('❌ Error listing galleries:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// NEW: Search galleries
app.get('/api/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term required' });
    }

    // Search in title and tags
    const searchQuery = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    const totalResults = await galleries.countDocuments(searchQuery);
    const searchResults = await galleries.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .toArray();

    const formattedResults = searchResults.map(gallery => ({
      id: gallery.hentai_id,
      title: gallery.title || `Gallery ${gallery.hentai_id}`,
      tags: gallery.tags || [],
      language: gallery.language || 'unknown',
      totalImages: gallery.total_images || gallery.pages || 1,
      thumbnail: `${req.protocol}://${req.get('host')}/api/${gallery.hentai_id}/01.jpg`
    }));

    res.json({
      galleries: formattedResults,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalResults / limit),
        totalItems: totalResults,
        hasNext: page < Math.ceil(totalResults / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('❌ Error searching galleries:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Proxy server running on port ${port}`);
});