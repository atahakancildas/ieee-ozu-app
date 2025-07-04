import express from "express";
import morgan from "morgan";
import cors from "cors";
import requestsRouter from "./routes/requestsRoutes";
import { config } from "dotenv";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

config({ path: ".env" });

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Global middlewares
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Routes
app.use("/api/requests", requestsRouter);

// 404 handler - must be after all other routes
app.use(notFoundHandler);

// Global error handler - must be after all other middleware
app.use(errorHandler);

export default app;
