import { getUniqueFieldValues } from './mongodb';

// API functions for getting collection data
export async function getCategories(): Promise<string[]> {
  return await getUniqueFieldValues('categories');
}

export async function getTags(): Promise<string[]> {
  return await getUniqueFieldValues('tags');
}

export async function getArtists(): Promise<string[]> {
  return await getUniqueFieldValues('artists');
}

export async function getCharacters(): Promise<string[]> {
  return await getUniqueFieldValues('characters');
}

export async function getLanguages(): Promise<string[]> {
  return await getUniqueFieldValues('languages');
}

// Get galleries by specific field value
export async function getGalleriesByField(
  field: 'categories' | 'tags' | 'artists' | 'characters' | 'languages',
  value: string,
  page: number = 1,
  limit: number = 25
) {
  const { connectToDatabase } = await import('./mongodb');
  const { collection } = await connectToDatabase();
  
  const skip = (page - 1) * limit;
  
  // Create query based on field
  const query = { [field]: value };
  
  const galleries = await collection
    .find(query)
    .skip(skip)
    .limit(limit)
    .toArray();
    
  const totalCount = await collection.countDocuments(query);
  
  return {
    galleries: galleries.map(gallery => ({
      ...gallery,
      id: gallery._id?.toString() || gallery.id,
      hentai_id: gallery.hentai_id || gallery.id || gallery._id?.toString() || '',
      thumbnail: gallery.thumbnail || `https://cdn.hentaijin.com/${gallery.hentai_id || gallery.id}/01.webp`
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      hasNext: skip + limit < totalCount,
      hasPrev: page > 1,
    }
  };
}