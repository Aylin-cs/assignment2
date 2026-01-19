import express from "express";
import usersRoutes from "./routes/users_routes";
// בהמשך:
// import authRoutes from "./routes/auth.routes";
// import postsRoutes from "./routes/posts.routes";
// import commentsRoutes from "./routes/comments.routes";

const app = express();

// Middleware לקריאת JSON
app.use(express.json());

// Route בדיקה
app.get("/", (_req, res) => {
  res.send("API is running");
});

// Routes
app.use("/users", usersRoutes);
// app.use("/auth", authRoutes);
// app.use("/posts", postsRoutes);
// app.use("/comments", commentsRoutes);

export default app;
