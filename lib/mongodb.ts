import { MongoClient, Db, Collection } from 'mongodb';
import { Gallery } from '@/types/gallery';

// MongoDB connection string
const MONGODB_URI = "mongodb+srv://saifalimz:897689@Sakmz@cluster0.cso7q.mongodb.net/";
const DATABASE_NAME = "hentaijin";
const COLLECTION_NAME = "galleries";

// Global variable to cache the MongoDB client
let client: MongoClient | null = null;
let db: Db | null = null;

// Connect to MongoDB
export async function connectToDatabase(): Promise<{ db: Db; collection: Collection<Gallery> }> {
  if (!client) {
    try {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw new Error('Database connection failed');
    }
  }

  if (!db) {
    db = client.db(DATABASE_NAME);
  }

  const collection = db.collection<Gallery>(COLLECTION_NAME);
  return { db, collection };
}

// Initialize sample data if collection is empty
export async function initializeSampleData(): Promise<void> {
  try {
    const { collection } = await connectToDatabase();
    
    // Check if collection already has data
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`Collection already has ${count} documents`);
      return;
    }

    console.log('Initializing sample data...');
    
    // Sample gallery data
    const sampleGalleries: Omit<Gallery, 'id'>[] = [
      {
        hentai_id: "100001",
        title: "Love Live! School Idol Paradise",
        characters: ["Honoka Kousaka", "Kotori Minami", "Umi Sonoda"],
        categories: ["Doujinshi"],
        tags: ["schoolgirl", "vanilla", "big breasts", "yuri"],
        pages: 24,
        artists: ["Yukiko Horiguchi"],
        languages: ["english"],
        uploaded: Date.now() - 86400000,
        thumbnail: "https://cdn.hentaijin.com/100001/01.webp",
        popularity: 1500,
        favorites: 230
      },
      {
        hentai_id: "100002", 
        title: "Demon Slayer: Nezuko's Secret",
        characters: ["Nezuko Kamado", "Tanjiro Kamado"],
        categories: ["Manga"],
        tags: ["demon", "family", "wholesome", "vanilla"],
        pages: 18,
        artists: ["Koyoharu Gotouge"],
        languages: ["japanese"],
        uploaded: Date.now() - 172800000,
        thumbnail: "https://cdn.hentaijin.com/100002/01.webp",
        popularity: 2100,
        favorites: 350
      },
      {
        hentai_id: "100003",
        title: "My Hero Academia: Ochako Training",
        characters: ["Ochako Uraraka", "Izuku Midoriya"],
        categories: ["Artist CG"],
        tags: ["hero", "schoolgirl", "romance", "vanilla"],
        pages: 32,
        artists: ["Kohei Horikoshi"],
        languages: ["english"],
        uploaded: Date.now() - 259200000,
        thumbnail: "https://cdn.hentaijin.com/100003/01.webp",
        popularity: 890,
        favorites: 120
      },
      {
        hentai_id: "100004",
        title: "Naruto: Hinata's Confession",
        characters: ["Hinata Hyuga", "Naruto Uzumaki"],
        categories: ["Doujinshi"],
        tags: ["ninja", "romance", "vanilla", "big breasts"],
        pages: 28,
        artists: ["Masashi Kishimoto"],
        languages: ["english"],
        uploaded: Date.now() - 345600000,
        thumbnail: "https://cdn.hentaijin.com/100004/01.webp",
        popularity: 1800,
        favorites: 280
      },
      {
        hentai_id: "100005",
        title: "Attack on Titan: Mikasa's Desire",
        characters: ["Mikasa Ackerman", "Eren Yeager"],
        categories: ["Manga"],
        tags: ["action", "romance", "military", "vanilla"],
        pages: 20,
        artists: ["Hajime Isayama"],
        languages: ["japanese"],
        uploaded: Date.now() - 432000000,
        thumbnail: "https://cdn.hentaijin.com/100005/01.webp",
        popularity: 2300,
        favorites: 400
      },
      {
        hentai_id: "100006",
        title: "One Piece: Nami's Treasure",
        characters: ["Nami", "Monkey D. Luffy"],
        categories: ["Artist CG"],
        tags: ["pirate", "adventure", "big breasts", "vanilla"],
        pages: 35,
        artists: ["Eiichiro Oda"],
        languages: ["english"],
        uploaded: Date.now() - 518400000,
        thumbnail: "https://cdn.hentaijin.com/100006/01.webp",
        popularity: 1650,
        favorites: 195
      },
      {
        hentai_id: "100007",
        title: "Dragon Ball: Bulma's Invention",
        characters: ["Bulma", "Vegeta"],
        categories: ["Doujinshi"],
        tags: ["sci-fi", "milf", "vanilla", "romance"],
        pages: 22,
        artists: ["Akira Toriyama"],
        languages: ["english"],
        uploaded: Date.now() - 604800000,
        thumbnail: "https://cdn.hentaijin.com/100007/01.webp",
        popularity: 1200,
        favorites: 150
      },
      {
        hentai_id: "100008",
        title: "Sailor Moon: Usagi's Dream",
        characters: ["Usagi Tsukino", "Mamoru Chiba"],
        categories: ["Manga"],
        tags: ["magical girl", "romance", "vanilla", "blonde"],
        pages: 26,
        artists: ["Naoko Takeuchi"],
        languages: ["japanese"],
        uploaded: Date.now() - 691200000,
        thumbnail: "https://cdn.hentaijin.com/100008/01.webp",
        popularity: 1400,
        favorites: 180
      },
      {
        hentai_id: "100009",
        title: "Pokemon: Misty's Adventure",
        characters: ["Misty", "Ash Ketchum"],
        categories: ["Artist CG"],
        tags: ["pokemon", "adventure", "redhead", "vanilla"],
        pages: 30,
        artists: ["Satoshi Tajiri"],
        languages: ["english"],
        uploaded: Date.now() - 777600000,
        thumbnail: "https://cdn.hentaijin.com/100009/01.webp",
        popularity: 1750,
        favorites: 220
      },
      {
        hentai_id: "100010",
        title: "Death Note: Misa's Devotion",
        characters: ["Misa Amane", "Light Yagami"],
        categories: ["Doujinshi"],
        tags: ["gothic", "romance", "blonde", "vanilla"],
        pages: 19,
        artists: ["Tsugumi Ohba"],
        languages: ["english"],
        uploaded: Date.now() - 864000000,
        thumbnail: "https://cdn.hentaijin.com/100010/01.webp",
        popularity: 980,
        favorites: 110
      },
      {
        hentai_id: "100011",
        title: "Bleach: Orihime's Healing",
        characters: ["Orihime Inoue", "Ichigo Kurosaki"],
        categories: ["Manga"],
        tags: ["supernatural", "healing", "big breasts", "vanilla"],
        pages: 25,
        artists: ["Tite Kubo"],
        languages: ["japanese"],
        uploaded: Date.now() - 950400000,
        thumbnail: "https://cdn.hentaijin.com/100011/01.webp",
        popularity: 1550,
        favorites: 210
      },
      {
        hentai_id: "100012",
        title: "Fairy Tail: Lucy's Magic",
        characters: ["Lucy Heartfilia", "Natsu Dragneel"],
        categories: ["Artist CG"],
        tags: ["magic", "adventure", "blonde", "vanilla"],
        pages: 28,
        artists: ["Hiro Mashima"],
        languages: ["english"],
        uploaded: Date.now() - 1036800000,
        thumbnail: "https://cdn.hentaijin.com/100012/01.webp",
        popularity: 1320,
        favorites: 165
      },
      {
        hentai_id: "100013",
        title: "Evangelion: Rei's Awakening",
        characters: ["Rei Ayanami", "Shinji Ikari"],
        categories: ["Doujinshi"],
        tags: ["mecha", "sci-fi", "blue hair", "vanilla"],
        pages: 21,
        artists: ["Hideaki Anno"],
        languages: ["english"],
        uploaded: Date.now() - 1123200000,
        thumbnail: "https://cdn.hentaijin.com/100013/01.webp",
        popularity: 1880,
        favorites: 290
      },
      {
        hentai_id: "100014",
        title: "Cowboy Bebop: Faye's Gamble",
        characters: ["Faye Valentine", "Spike Spiegel"],
        categories: ["Manga"],
        tags: ["space", "bounty hunter", "mature", "vanilla"],
        pages: 24,
        artists: ["Shinichiro Watanabe"],
        languages: ["japanese"],
        uploaded: Date.now() - 1209600000,
        thumbnail: "https://cdn.hentaijin.com/100014/01.webp",
        popularity: 1150,
        favorites: 140
      },
      {
        hentai_id: "100015",
        title: "Fullmetal Alchemist: Winry's Workshop",
        characters: ["Winry Rockbell", "Edward Elric"],
        categories: ["Artist CG"],
        tags: ["alchemy", "mechanic", "blonde", "vanilla"],
        pages: 27,
        artists: ["Hiromu Arakawa"],
        languages: ["english"],
        uploaded: Date.now() - 1296000000,
        thumbnail: "https://cdn.hentaijin.com/100015/01.webp",
        popularity: 1420,
        favorites: 175
      },
      {
        hentai_id: "100016",
        title: "Hunter x Hunter: Killua's Training",
        characters: ["Killua Zoldyck", "Gon Freecss"],
        categories: ["Doujinshi"],
        tags: ["hunter", "adventure", "friendship", "yaoi"],
        pages: 23,
        artists: ["Yoshihiro Togashi"],
        languages: ["english"],
        uploaded: Date.now() - 1382400000,
        thumbnail: "https://cdn.hentaijin.com/100016/01.webp",
        popularity: 890,
        favorites: 95
      },
      {
        hentai_id: "100017",
        title: "Inuyasha: Kagome's Journey",
        characters: ["Kagome Higurashi", "Inuyasha"],
        categories: ["Manga"],
        tags: ["time travel", "demon", "priestess", "vanilla"],
        pages: 29,
        artists: ["Rumiko Takahashi"],
        languages: ["japanese"],
        uploaded: Date.now() - 1468800000,
        thumbnail: "https://cdn.hentaijin.com/100017/01.webp",
        popularity: 1680,
        favorites: 225
      },
      {
        hentai_id: "100018",
        title: "Yu-Gi-Oh!: Mai's Duel",
        characters: ["Mai Valentine", "Joey Wheeler"],
        categories: ["Artist CG"],
        tags: ["card game", "tournament", "blonde", "vanilla"],
        pages: 31,
        artists: ["Kazuki Takahashi"],
        languages: ["english"],
        uploaded: Date.now() - 1555200000,
        thumbnail: "https://cdn.hentaijin.com/100018/01.webp",
        popularity: 1250,
        favorites: 160
      },
      {
        hentai_id: "100019",
        title: "Code Geass: C.C.'s Contract",
        characters: ["C.C.", "Lelouch Lamperouge"],
        categories: ["Doujinshi"],
        tags: ["mecha", "strategy", "green hair", "vanilla"],
        pages: 26,
        artists: ["Clamp"],
        languages: ["english"],
        uploaded: Date.now() - 1641600000,
        thumbnail: "https://cdn.hentaijin.com/100019/01.webp",
        popularity: 1590,
        favorites: 200
      },
      {
        hentai_id: "100020",
        title: "Jujutsu Kaisen: Nobara's Technique",
        characters: ["Nobara Kugisaki", "Yuji Itadori"],
        categories: ["Manga"],
        tags: ["curse", "exorcist", "modern", "vanilla"],
        pages: 22,
        artists: ["Gege Akutami"],
        languages: ["japanese"],
        uploaded: Date.now() - 1728000000,
        thumbnail: "https://cdn.hentaijin.com/100020/01.webp",
        popularity: 2200,
        favorites: 380
      }
    ];

    // Insert sample data
    await collection.insertMany(sampleGalleries as any[]);
    console.log(`Inserted ${sampleGalleries.length} sample galleries`);
    
  } catch (error) {
    console.error('Failed to initialize sample data:', error);
  }
}

// Utility function to get all unique values for a field
export async function getUniqueFieldValues(field: keyof Pick<Gallery, 'categories' | 'tags' | 'artists' | 'languages' | 'characters'>): Promise<string[]> {
  try {
    const { collection } = await connectToDatabase();
    const values = await collection.distinct(field);
    return values.filter(Boolean).sort();
  } catch (error) {
    console.error(`Failed to get unique ${field} values:`, error);
    return [];
  }
}

// Close MongoDB connection
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}