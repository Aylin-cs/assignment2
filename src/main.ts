import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/postRouter";
import usersRoutes from "./routes/usersRoutes";
import authRoutes from "./routes/authRoute";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


dotenv.config();

const app = express();
app.use(express.json());
app.use("/posts", postRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.get("/debug/new-user-id", (_req, res) => {
  res.json({ userId: new mongoose.Types.ObjectId().toString() });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the application",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});