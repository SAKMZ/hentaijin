#!/usr/bin/env node

// Quick test script to verify image loading works
const fetch = require("node-fetch");

const SERVER_URL = process.env.SERVER_URL || "http://128.140.78.75:3000";
const TEST_GALLERY_ID = process.env.TEST_GALLERY_ID || "100";

async function testImageLoading() {
  console.log("🧪 Testing dynamic image loading...\n");

  try {
    // Test 1: Health check
    console.log("1️⃣ Testing health endpoint...");
    const healthResponse = await fetch(`${SERVER_URL}/health`);
    const health = await healthResponse.json();
    console.log("✅ Health check passed:", health.status);
    console.log("   MongoDB:", health.mongodb);
    console.log(
      "   Environment variables set:",
      Object.values(health.environment).every(Boolean) ? "✅" : "❌"
    );

    // Test 2: Gallery metadata
    console.log("\n2️⃣ Testing gallery metadata...");
    const galleryResponse = await fetch(
      `${SERVER_URL}/api/gallery/${TEST_GALLERY_ID}`
    );
    if (galleryResponse.ok) {
      const gallery = await galleryResponse.json();
      console.log("✅ Gallery metadata loaded:", gallery.title);
      console.log("   Total images:", gallery.totalImages);
      console.log("   Thumbnail URL:", gallery.thumbnail);
    } else {
      console.log("❌ Gallery metadata failed:", galleryResponse.status);
    }

    // Test 3: Image debug check
    console.log("\n3️⃣ Testing image availability...");
    const imageTests = [
      `${TEST_GALLERY_ID}/01.webp`,
      `${TEST_GALLERY_ID}/01.jpg`,
      `${TEST_GALLERY_ID}/02.webp`,
      `${TEST_GALLERY_ID}/02.jpg`,
    ];

    for (const imageTest of imageTests) {
      const [galleryId, imageName] = imageTest.split("/");
      const debugResponse = await fetch(
        `${SERVER_URL}/debug/image/${galleryId}/${imageName}`
      );
      const debug = await debugResponse.json();

      const statusIcon =
        debug.status === "found"
          ? "✅"
          : debug.status === "found_fallback"
          ? "🔄"
          : "❌";
      console.log(`   ${statusIcon} ${imageTest}: ${debug.status}`);

      if (debug.status === "found_fallback") {
        console.log(`      → Fallback to: ${debug.served.imageName}`);
      }
    }

    // Test 4: Direct image loading
    console.log("\n4️⃣ Testing direct image loading...");
    const directImageResponse = await fetch(
      `${SERVER_URL}/api/${TEST_GALLERY_ID}/01.webp`
    );
    console.log(
      `   ${directImageResponse.ok ? "✅" : "❌"} Direct WebP load: ${
        directImageResponse.status
      }`
    );
    console.log(
      "   Content-Type:",
      directImageResponse.headers.get("content-type")
    );
    console.log(
      "   Cache-Control:",
      directImageResponse.headers.get("cache-control")
    );

    console.log("\n🎉 Test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testImageLoading();
}

module.exports = testImageLoading;
