import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import postRoutes from "./routes/postRouter";
import usersRoutes from "./routes/usersRoutes";
import authRoutes from "./routes/authRoute";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.use("/posts", postRoutes);
  app.use("/users", usersRoutes);
  app.use("/auth", authRoutes);

  app.get("/debug/new-user-id", (_req, res) => {
    res.json({ userId: new mongoose.Types.ObjectId().toString() });
  });

  // Swagger
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "API documentation for the application",
      },
      servers: [{ url: `http://localhost:${PORT}`, description: "Local server" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: ["./src/routes/*.ts"],
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.get("/", (_req, res) => {
    res.send("API is running");
  });

  return app;
};


export const connectDb = async (mongoUri: string) => {
  await mongoose.connect(mongoUri);
};
