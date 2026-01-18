import { Router } from "express";

const router = Router();

/**
 * POST /auth/register
 * TODO: create user, hash password, return tokens
 */
router.post("/register", (_req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

/**
 * POST /auth/login
 * TODO: validate credentials, return access & refresh tokens
 */
router.post("/login", (_req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

/**
 * POST /auth/refresh
 * TODO: validate refresh token and issue new access token
 */
router.post("/refresh", (_req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

/**
 * POST /auth/logout
 * TODO: revoke refresh token
 */
router.post("/logout", (_req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

export default router;
