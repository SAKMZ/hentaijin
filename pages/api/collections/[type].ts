import { NextApiRequest, NextApiResponse } from "next";

const FLASK_BACKEND_URL =
  process.env.FLASK_BACKEND_URL || "http://localhost:5000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, value, page = "1" } = req.query;

  if (!type || typeof type !== "string") {
    return res.status(400).json({ message: "Collection type is required" });
  }

  try {
    // Build query string
    const params = new URLSearchParams();
    if (value) params.append("value", value as string);
    if (page) params.append("page", page as string);

    const queryString = params.toString();
    const url = `${FLASK_BACKEND_URL}/api/collections/${type}${
      queryString ? `?${queryString}` : ""
    }`;

    // Forward request to Flask backend
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) {
        return res.status(400).json({ message: "Invalid collection type" });
      }
      throw new Error(`Flask backend error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
