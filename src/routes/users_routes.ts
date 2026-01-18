import { Router } from "express";
import { createUser, getUsers, getUserById } from "../services/users_service";

const router = Router();

router.post("/", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const user = createUser(username, email, password);
  res.status(201).json({ id: user.id, username, email });
});

router.get("/", (_req, res) => {
  res.json(getUsers());
});

router.get("/:id", (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export default router;
