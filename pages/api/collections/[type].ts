import { NextApiRequest, NextApiResponse } from 'next';
import { getUniqueFieldValues, connectToDatabase } from '@/lib/mongodb';
import { config } from '@/lib/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type, value, page = '1' } = req.query;

  if (!type || typeof type !== 'string') {
    return res.status(400).json({ message: 'Collection type is required' });
  }

  try {
    // If requesting unique values for a collection type
    if (!value) {
      const validTypes = ['categories', 'tags', 'artists', 'languages', 'characters'];
      
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: 'Invalid collection type' });
      }

      const values = await getUniqueFieldValues(type as any);
      return res.status(200).json({ values });
    }

    // If requesting galleries by collection value
    const { collection } = await connectToDatabase();
    const pageNum = parseInt(page as string, 10);
    const limit = config.GALLERIES_PER_PAGE;
    const skip = (pageNum - 1) * limit;

    // Create query based on type
    const query = { [type]: value };
    
    const galleries = await collection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
      
    const totalCount = await collection.countDocuments(query);
    
    const transformedGalleries = galleries.map((gallery: any) => ({
      ...gallery,
      id: gallery._id?.toString() || gallery.id,
      hentai_id: gallery.hentai_id || gallery.id || gallery._id?.toString() || '',
      thumbnail: gallery.thumbnail || `https://cdn.hentaijin.com/${gallery.hentai_id || gallery.id}/01.webp`
    }));

    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      hasNext: skip + limit < totalCount,
      hasPrev: pageNum > 1,
    };

    res.status(200).json({
      galleries: transformedGalleries,
      pagination
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}