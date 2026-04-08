import "dotenv/config";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/v1/authRoutes.ts";
import { connectDB, disconnectDB } from "./config/db.ts";

let server: any;

const gracefulShutdown = async (signal: string, err?: any) => {
  console.error(`${signal} received`, err || "");
  server?.close(() => {
    disconnectDB()
      .then(() => process.exit(1))
      .catch((e) => {
        console.error("Error disconnecting DB:", e);
        process.exit(1);
      });
  });
};

const start = async () => {
  await connectDB();

  const app = express();
  const PORT: number = Number(process.env.PORT) || 1000;
  // body parsing middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("combined"));

  // API routes
  app.use("/api/v1/auth", authRoutes);

  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("unhandledRejection", (err) =>
  gracefulShutdown("Unhandled Rejection", err),
);
process.on("uncaughtException", (err) =>
  gracefulShutdown("Uncaught Exception", err),
);

// disconnect from the database

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("unhandledRejection", (err) =>
  gracefulShutdown("Unhandled Rejection", err),
);
process.on("uncaughtException", (err) =>
  gracefulShutdown("Uncaught Exception", err),
);
