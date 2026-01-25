import { User } from "../models/usersModel";
import crypto from "crypto";

const users: User[] = [];

export function createUser(username: string, email: string, passwordHash: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash,
    createdAt: new Date(),
  };
  users.push(user);
  return user;
}

export function getUsers(): Omit<User, "passwordHash">[] {
  return users.map(({ passwordHash, ...u }) => u);
}

export function getUserById(id: string): Omit<User, "passwordHash"> | null {
  const u = users.find((u) => u.id === id);
  if (!u) return null;
  const { passwordHash, ...safe } = u;
  return safe;
}
