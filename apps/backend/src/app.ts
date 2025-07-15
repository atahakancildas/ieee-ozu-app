import express from "express";
import morgan from "morgan";
import cors from "cors";
import requestsRouter from "./routes/requestsRoutes";
import membersRouter from "./routes/membersRoutes";
import adminsRouter from "./routes/adminsRoutes";
import clubSettingsRouter from "./routes/clubSettingsRoutes";
import { config } from "dotenv";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

config({ path: ".env" });

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// TODO: Add security middlewares
// Global middlewares
// app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Routes
app.use("/api/requests", requestsRouter);
app.use("/api/members", membersRouter);
app.use("/api/admins", adminsRouter);
app.use("/api/club-settings", clubSettingsRouter);

// 404 handler - must be after all other routes
app.use(notFoundHandler);

// Global error handler - must be after all other middleware
app.use(errorHandler);

export default app;
