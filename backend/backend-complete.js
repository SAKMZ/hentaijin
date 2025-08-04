require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const { MongoClient } = require("mongodb");
// const cors = require('cors'); // Install with: npm install cors

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend (install cors: npm install cors)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());

// Setup iDrive E2 S3-compatible storage
const s3 = new AWS.S3({
  endpoint: process.env.E2_ENDPOINT,
  accessKeyId: process.env.E2_KEY,
  secretAccessKey: process.env.E2_SECRET,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const bucket = process.env.E2_BUCKET;

// Setup MongoDB with proper error handling
let db, galleries;
(async () => {
  try {
    // Check required environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is required");
    }
    if (!process.env.MONGO_DB) {
      throw new Error("MONGO_DB environment variable is required");
    }

    console.log("🔄 Connecting to MongoDB...");
    console.log(
      "MongoDB URI:",
      process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
    ); // Hide credentials

    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    db = mongoClient.db(process.env.MONGO_DB);
    galleries = db.collection("galleries");

    // Test the connection
    await db.admin().ping();
    console.log("✅ Connected to MongoDB successfully");
    console.log(`📁 Using database: ${process.env.MONGO_DB}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("💡 Make sure your .env file contains:");
    console.error(
      "   MONGO_URI=mongodb://username:password@host:port/database"
    );
    console.error("   MONGO_DB=your_database_name");

    // Continue without MongoDB - API will return errors
    db = null;
    galleries = null;
  }
})();

// ============= GALLERY METADATA API ROUTES =============

// GET /api/galleries - List all galleries with pagination
app.get("/api/galleries", async (req, res) => {
  try {
    if (!db || !galleries) {
      return res.status(503).json({
        error: "Database not connected",
        message: "MongoDB connection failed - check server logs",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalItems = await galleries.countDocuments();
    const galleryList = await galleries
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const formattedGalleries = galleryList.map((g) => ({
      id: g.hentai_id,
      title: g.title || `Gallery ${g.hentai_id}`,
      tags: g.tags || [],
      language: g.language || "unknown",
      totalImages: g.total_images || g.image_count || 20,
      thumbnail: `${req.protocol}://${req.get("host")}/api/${
        g.hentai_id
      }/01.jpg`,
    }));

    res.json({
      galleries: formattedGalleries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        hasNext: page < Math.ceil(totalItems / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching galleries:", err);
    res.status(500).json({ error: "Failed to fetch galleries" });
  }
});

// GET /api/gallery/:id - Get specific gallery metadata
app.get("/api/gallery/:id", async (req, res) => {
  try {
    if (!db || !galleries) {
      return res.status(503).json({
        error: "Database not connected",
        message: "MongoDB connection failed - check server logs",
      });
    }

    const { id } = req.params;
    const gallery = await galleries.findOne({ hentai_id: id });

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    res.json({
      id: gallery.hentai_id,
      title: gallery.title || `Gallery ${gallery.hentai_id}`,
      tags: gallery.tags || [],
      language: gallery.language || "unknown",
      totalImages: gallery.total_images || gallery.image_count || 20,
      thumbnail: `${req.protocol}://${req.get("host")}/api/${
        gallery.hentai_id
      }/01.jpg`,
    });
  } catch (err) {
    console.error("❌ Error fetching gallery:", err);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

// GET /api/search?q=term - Search galleries by title and tags
app.get("/api/search", async (req, res) => {
  try {
    if (!db || !galleries) {
      return res.status(503).json({
        error: "Database not connected",
        message: "MongoDB connection failed - check server logs",
      });
    }

    const { q: searchTerm, page = 1, limit = 20 } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ error: "Search term required" });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Search in title and tags (case-insensitive)
    const searchQuery = {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { tags: { $elemMatch: { $regex: searchTerm, $options: "i" } } },
      ],
    };

    const totalItems = await galleries.countDocuments(searchQuery);
    const searchResults = await galleries
      .find(searchQuery)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const formattedGalleries = searchResults.map((g) => ({
      id: g.hentai_id,
      title: g.title || `Gallery ${g.hentai_id}`,
      tags: g.tags || [],
      language: g.language || "unknown",
      totalImages: g.total_images || g.image_count || 20,
      thumbnail: `${req.protocol}://${req.get("host")}/api/${
        g.hentai_id
      }/01.jpg`,
    }));

    res.json({
      galleries: formattedGalleries,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        totalItems,
        hasNext: pageNum < Math.ceil(totalItems / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (err) {
    console.error("❌ Error searching galleries:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// ============= IMAGE SERVING ROUTE (Your Original) =============

// Enhanced API route to serve images with WebP fallback
app.get("/api/:galleryId/:imageName", async (req, res) => {
  const { galleryId, imageName } = req.params;

  try {
    // Step 1: Check if gallery exists in DB (TEMPORARILY DISABLED FOR TESTING)
    if (galleries) {
      const found = await galleries.findOne({ hentai_id: galleryId });
      if (!found) {
        console.log(
          `⚠️  Gallery ${galleryId} not found in database, but serving image anyway (testing mode)`
        );
        // Temporarily disabled: return res.status(404).send("Gallery not found in database");
      } else {
        console.log(`✅ Gallery ${galleryId} found in database`);
      }
    } else {
      console.log("⚠️  Serving image without DB check (MongoDB not connected)");
    }

    // Step 2: Determine content type and try to fetch image from iDrive
    const getContentType = (fileName) => {
      const ext = fileName.split(".").pop().toLowerCase();
      switch (ext) {
        case "webp":
          return "image/webp";
        case "jpg":
        case "jpeg":
          return "image/jpeg";
        case "png":
          return "image/png";
        case "gif":
          return "image/gif";
        default:
          return "image/jpeg";
      }
    };

    const tryServeImage = async (imagePath) => {
      const key = `${galleryId}/${imagePath}`;

      try {
        // Check if object exists first
        await s3.headObject({ Bucket: bucket, Key: key }).promise();

        // Object exists, stream it
        const stream = s3
          .getObject({ Bucket: bucket, Key: key })
          .createReadStream();

        // Set proper headers
        res.setHeader("Content-Type", getContentType(imagePath));
        res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
        res.setHeader("ETag", `"${galleryId}-${imagePath}"`);

        stream.on("error", (err) => {
          console.error(`[S3 Stream] ${key}:`, err.message);
          if (!res.headersSent) {
            res.status(404).send("Image not found in storage");
          }
        });

        stream.pipe(res);
        return true;
      } catch (err) {
        console.log(`[S3] ${key} not found:`, err.message);
        return false;
      }
    };

    // Try to serve the requested image
    const served = await tryServeImage(imageName);

    if (!served) {
      // If WebP was requested and failed, try JPG fallback
      if (imageName.endsWith(".webp")) {
        const jpgName = imageName.replace(".webp", ".jpg");
        console.log(`🔄 Trying JPG fallback: ${jpgName}`);
        const jpgServed = await tryServeImage(jpgName);

        if (!jpgServed) {
          console.error(
            `❌ Both WebP and JPG failed for: ${galleryId}/${imageName}`
          );
          return res.status(404).send("Image not found in storage");
        }
      } else {
        console.error(`❌ Image not found: ${galleryId}/${imageName}`);
        return res.status(404).send("Image not found in storage");
      }
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
    res.status(500).send("Internal server error");
  }
});

// ============= HEALTH CHECK & DEBUG =============

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongodb: db ? "connected" : "disconnected",
    environment: {
      mongo_uri_set: !!process.env.MONGO_URI,
      mongo_db_set: !!process.env.MONGO_DB,
      e2_endpoint_set: !!process.env.E2_ENDPOINT,
      e2_bucket_set: !!process.env.E2_BUCKET,
    },
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to test image availability
app.get("/debug/image/:galleryId/:imageName", async (req, res) => {
  const { galleryId, imageName } = req.params;

  try {
    const key = `${galleryId}/${imageName}`;

    // Test if image exists in S3
    const headResult = await s3
      .headObject({ Bucket: bucket, Key: key })
      .promise();

    res.json({
      status: "found",
      galleryId,
      imageName,
      key,
      contentType: headResult.ContentType,
      contentLength: headResult.ContentLength,
      lastModified: headResult.LastModified,
      etag: headResult.ETag,
    });
  } catch (err) {
    // Try JPG fallback if WebP was requested
    if (imageName.endsWith(".webp")) {
      try {
        const jpgName = imageName.replace(".webp", ".jpg");
        const jpgKey = `${galleryId}/${jpgName}`;
        const jpgHead = await s3
          .headObject({ Bucket: bucket, Key: jpgKey })
          .promise();

        res.json({
          status: "found_fallback",
          requested: { galleryId, imageName },
          served: { galleryId, imageName: jpgName },
          key: jpgKey,
          contentType: jpgHead.ContentType,
          contentLength: jpgHead.ContentLength,
          lastModified: jpgHead.LastModified,
          etag: jpgHead.ETag,
        });
      } catch (jpgErr) {
        res.json({
          status: "not_found",
          galleryId,
          imageName,
          key: `${galleryId}/${imageName}`,
          error: err.message,
          jpgFallbackError: jpgErr.message,
        });
      }
    } else {
      res.json({
        status: "not_found",
        galleryId,
        imageName,
        key: `${galleryId}/${imageName}`,
        error: err.message,
      });
    }
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Proxy server running on port ${port}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET /api/galleries - List galleries`);
  console.log(`   GET /api/gallery/:id - Get gallery metadata`);
  console.log(`   GET /api/search?q=term - Search galleries`);
  console.log(
    `   GET /api/:galleryId/:imageName - Serve images (with WebP→JPG fallback)`
  );
  console.log(
    `   GET /debug/image/:galleryId/:imageName - Debug image availability`
  );
  console.log(`   GET /health - Health check`);
  console.log(`\n💡 Environment check:`);
  console.log(
    `   MONGO_URI: ${process.env.MONGO_URI ? "✅ Set" : "❌ Missing"}`
  );
  console.log(`   MONGO_DB: ${process.env.MONGO_DB ? "✅ Set" : "❌ Missing"}`);
  console.log(
    `   E2_ENDPOINT: ${process.env.E2_ENDPOINT ? "✅ Set" : "❌ Missing"}`
  );
  console.log(
    `   E2_BUCKET: ${process.env.E2_BUCKET ? "✅ Set" : "❌ Missing"}`
  );
  console.log(`\n🖼️  Image serving: WebP first, JPG fallback`);
  console.log(
    `🌐 Frontend should connect to: http://localhost:${port} or http://128.140.78.75:${port}`
  );
});
