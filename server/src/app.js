import express from "express";
import cors from "cors";
import recommendationsRoutes from "./routes/htmlroutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recommendations", recommendationsRoutes);

export default app;
