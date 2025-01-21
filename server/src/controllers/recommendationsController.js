import { getRecommendations } from "../services/tastediveService.js";

export const fetchRecommendations = async (req, res) => {
  const { query, type } = req.query;

  if (!query || !type) {
    return res.status(400).json({ message: "Query and type are required." });
  }

  try {
    const recommendations = await getRecommendations(query, type);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Failed to fetch recommendations." });
  }
};
