import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase, initializeSampleData } from "@/lib/mongodb";
import { Gallery, SearchParams } from "@/types/gallery";
import { config } from "@/lib/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { collection } = await connectToDatabase();

    // Initialize sample data if collection is empty
    await initializeSampleData();

    // Parse query parameters
    const {
      search,
      page = "1",
      limit = config.GALLERIES_PER_PAGE.toString(),
      sort,
      categories,
      languages,
      tags,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build MongoDB query
    let query: any = {};

    // Search filter
    if (search) {
      const searchTerm = search as string;
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
        { artists: { $regex: searchTerm, $options: "i" } },
        { categories: { $regex: searchTerm, $options: "i" } },
        { characters: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Filter by categories
    if (categories) {
      const categoryArray = Array.isArray(categories)
        ? categories
        : [categories];
      query.categories = { $in: categoryArray };
    }

    // Filter by languages
    if (languages) {
      const languageArray = Array.isArray(languages) ? languages : [languages];
      query.languages = { $in: languageArray };
    }

    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Build sort options
    let sortOptions: any = { uploaded: -1 }; // Default: newest first

    if (sort) {
      switch (sort) {
        case config.SORT_OPTIONS.POPULAR:
          sortOptions = { popularity: -1 };
          break;
        case config.SORT_OPTIONS.NEW:
          sortOptions = { uploaded: -1 };
          break;
        case config.SORT_OPTIONS.HOT:
          // Hot = combination of recent + popular
          sortOptions = { popularity: -1, uploaded: -1 };
          break;
        case config.SORT_OPTIONS.DATE:
          sortOptions = { uploaded: -1 };
          break;
        case config.SORT_OPTIONS.ALPHABETICAL:
          sortOptions = { title: 1 };
          break;
        case config.SORT_OPTIONS.PAGES:
          sortOptions = { pages: -1 };
          break;
      }
    }

    // Get total count for pagination
    const totalItems = await collection.countDocuments(query);

    // Get galleries with pagination
    const galleries = await collection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Transform MongoDB documents to Gallery objects
    const transformedGalleries = galleries.map((gallery: any) => ({
      ...gallery,
      id: gallery._id?.toString() || gallery.id,
      hentai_id:
        gallery.hentai_id || gallery.id || gallery._id?.toString() || "",
      thumbnail:
        gallery.thumbnail ||
        `https://cdn.hentaijin.com/${gallery.hentai_id || gallery.id}/01.webp`,
    }));

    const pagination = {
      currentPage: pageNum,
      totalPages: Math.ceil(totalItems / limitNum),
      totalItems,
      hasNext: skip + limitNum < totalItems,
      hasPrev: pageNum > 1,
    };

    res.status(200).json({
      galleries: transformedGalleries,
      pagination,
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
