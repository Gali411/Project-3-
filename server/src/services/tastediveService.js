// import axios from "axios";

// const TASTE_DIVE_BASE_URL = "https://tastedive.com/api/similar";
// const API_KEY = process.env.TASTEDIVE_API_KEY;

// export const getRecommendations = async (query, type) => {
//   try {
//     const response = await axios.get(TASTE_DIVE_BASE_URL, {
//       params: {
//         q: query,
//         type: type,
//         info: 1,
//         k: API_KEY,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching recommendations:", error);
//     throw new Error("Failed to fetch recommendations.");
//   }
// };
