import { NextApiRequest, NextApiResponse } from "next";
import { SearchParams } from "@/types/gallery";

const FLASK_BACKEND_URL =
  process.env.FLASK_BACKEND_URL || "http://localhost:5000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Forward request to Flask backend
    const response = await fetch(`${FLASK_BACKEND_URL}/api/galleries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        req.method === "POST" ? req.body : convertQueryToBody(req.query)
      ),
    });

    if (!response.ok) {
      throw new Error(`Flask backend error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

function convertQueryToBody(query: any): SearchParams {
  const params: SearchParams = {};

  if (query.search) params.search = query.search as string;
  if (query.page) params.page = parseInt(query.page as string, 10);
  if (query.limit) params.limit = parseInt(query.limit as string, 10);
  if (query.sort) params.sort = query.sort as string;

  if (query.categories) {
    params.categories = Array.isArray(query.categories)
      ? query.categories
      : [query.categories];
  }

  if (query.languages) {
    params.languages = Array.isArray(query.languages)
      ? query.languages
      : [query.languages];
  }

  if (query.tags) {
    params.tags = Array.isArray(query.tags) ? query.tags : [query.tags];
  }

  return params;
}
