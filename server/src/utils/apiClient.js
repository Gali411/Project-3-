import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://tastedive.com/api/similar",
  timeout: 5000,
});

export default apiClient;
