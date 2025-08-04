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

  try {
    const response = await fetch(`${FLASK_BACKEND_URL}/api/stats`);

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
