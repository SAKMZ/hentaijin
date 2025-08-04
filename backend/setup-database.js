require('dotenv').config();
const { MongoClient } = require('mongodb');

async function setupDatabase() {
  try {
    // Connect to MongoDB
    const mongoClient = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017');
    await mongoClient.connect();
    const db = mongoClient.db(process.env.MONGO_DB || 'hentaijin');
    const galleries = db.collection('galleries');

    console.log('🔄 Setting up test data...');

    // Sample gallery data
    const testGalleries = [
      {
        hentai_id: "100",
        title: "Test Gallery 1",
        tags: ["big breasts", "schoolgirl", "vanilla"],
        language: "english",
        total_images: 20,
        createdAt: new Date()
      },
      {
        hentai_id: "101", 
        title: "Test Gallery 2",
        tags: ["milf", "office", "romance"],
        language: "japanese",
        total_images: 15,
        createdAt: new Date()
      },
      {
        hentai_id: "102",
        title: "Test Gallery 3", 
        tags: ["yuri", "school", "cute"],
        language: "english",
        total_images: 25,
        createdAt: new Date()
      }
    ];

    // Clear existing data and insert test data
    await galleries.deleteMany({});
    const result = await galleries.insertMany(testGalleries);
    
    console.log(`✅ Inserted ${result.insertedCount} test galleries`);
    console.log('📋 Test galleries created:');
    testGalleries.forEach(g => {
      console.log(`   - ID: ${g.hentai_id} | Title: ${g.title} | Images: ${g.total_images}`);
    });

    // Test the queries
    console.log('\n🔍 Testing database queries...');
    const gallery100 = await galleries.findOne({ hentai_id: "100" });
    console.log('Query result for hentai_id "100":', gallery100 ? '✅ Found' : '❌ Not found');

    await mongoClient.close();
    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();