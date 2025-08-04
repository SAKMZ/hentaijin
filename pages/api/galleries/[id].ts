import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { generateImageUrl } from '@/lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Gallery ID is required' });
  }

  try {
    const { collection } = await connectToDatabase();
    
    const gallery = await collection.findOne({ 
      $or: [
        { hentai_id: id },
        { id: id },
        { _id: id as any }
      ]
    });

    if (!gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }

    // Generate image URLs based on pages count
    const images = Array.from({ length: gallery.pages }, (_, index) =>
      generateImageUrl(gallery.hentai_id || gallery.id, index + 1)
    );

    const transformedGallery = {
      ...gallery,
      id: gallery._id?.toString() || gallery.id,
      hentai_id: gallery.hentai_id || gallery.id || gallery._id?.toString() || '',
      images,
    };

    res.status(200).json(transformedGallery);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}