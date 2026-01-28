import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usersRepository from "../repositories/usersRepository";
import { NextFunction, Request, Response } from "express";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const register = async (email: string, username: string, password: string) => {
  if (email == null || username == null || password == null) {
    throw new Error("Params not valid");
  }

  const existingEmail = await usersRepository.findByEmail(email);
  if (existingEmail) {
    throw new Error("Email is already in use");
  }

  const existingUsername = await usersRepository.findByUsername(username);
  if (existingUsername) {
    throw new Error("Username is already taken");
  }

  const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const user = await usersRepository.addUser({
  email,
  username,
  password: hashedPassword,
});

return user;
};


  const generateToken = (userId: string): Tokens | null => {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) return null;

  const random = Math.random().toString();

  const accessOptions = { expiresIn: (process.env.TOKEN_EXPIRES ?? "15m") } as jwt.SignOptions;

  const refreshOptions = { expiresIn: (process.env.REFRESH_TOKEN_EXPIRES ?? "7d") } as jwt.SignOptions;

  const accessToken = jwt.sign(
    { _id: userId, random }, secret, accessOptions
  );

  const refreshToken = jwt.sign(
    { _id: userId, random }, secret, refreshOptions
  );

  return { accessToken, refreshToken };
};

const login = async (email: string, password: string) => {
  if (email == null || password == null) {
    throw new Error("Bad email or password");
  }

  const user: any = await usersRepository.findByEmail(email);
  if (!user) throw new Error("Wrong username or password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Wrong username or password");

  if (!process.env.TOKEN_SECRET) throw new Error("Server Error");

  const tokens = generateToken(user._id.toString());
  if (!tokens) throw new Error("Server Error");

  if (!user.refreshToken) user.refreshToken = [];
  user.refreshToken.push(tokens.refreshToken);
  await usersRepository.saveUser(user);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    _id: user._id,
  };
};

const verifyRefreshToken = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("Invalid refresh token");
  if (!process.env.TOKEN_SECRET) throw new Error("Invalid refresh token");

  try {
    const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET) as { _id: string };

    const user: any = await usersRepository.getUserById(decoded._id);
    if (!user || !user.refreshToken?.includes(refreshToken)) {
      throw new Error("Invalid refresh token");
    }

    const newTokens = generateToken(user._id.toString());
    if (!newTokens) throw new Error("Invalid refresh token");

    return { user, newTokens };
  } catch {
    throw new Error("Invalid refresh token");
  }
};

const refresh = async (refreshToken: string) => {
  const { user, newTokens } = await verifyRefreshToken(refreshToken);

  if (!user.refreshToken) user.refreshToken = [];
  user.refreshToken.push(newTokens.refreshToken);

  await usersRepository.saveUser(user);

  return {
    accessToken: newTokens.accessToken,
    refreshToken: newTokens.refreshToken,
    _id: user._id,
  };
};

const logout = async (refreshToken: string) => {
  const { user } = await verifyRefreshToken(refreshToken);

  user.refreshToken = (user.refreshToken || []).filter((t: string) => t !== refreshToken);
  await usersRepository.saveUser(user);
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header("authorization");
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    res.status(401).send("Access Denied");
    return;
  }

  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("Server Error");
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload: any) => {
    if (err) {
      res.status(401).send("Access Denied");
      return;
    }
    req.params.userId = payload._id;
    next();
  });
};

export default {
  register,
  login,
  refresh,
  logout,
  authMiddleware,
};