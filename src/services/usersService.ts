import bcrypt from "bcrypt";
import usersRepository from "../repositories/usersRepository";
import { IUser } from "../models/usersModel";

type SafeUser = {
  id: string;
  username: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const toSafeUser = (u: IUser): SafeUser => ({
  id: String(u._id),
  username: u.username,
  email: u.email,
  createdAt: (u as any).createdAt,
  updatedAt: (u as any).updatedAt,
});

export async function createUser(username: string, email: string, password: string): Promise<SafeUser> {
  if (!username || !email || !password) throw new Error("Missing fields");

  const existingEmail = await usersRepository.findByEmail(email);
  if (existingEmail) throw new Error("Email is already in use");

  const existingUsername = await usersRepository.findByUsername(username);
  if (existingUsername) throw new Error("Username is already taken");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await usersRepository.addUser({
    username,
    email,
    password: hashedPassword,
  });

  return toSafeUser(user as any);
}

export async function getUsers(): Promise<SafeUser[]> {
  const users = await usersRepository.getAllUsers();
  return users.map(toSafeUser);
}

export async function getUserById(id: string): Promise<SafeUser | null> {
  const user = await usersRepository.getUserById(id);
  return user ? toSafeUser(user) : null;
}

export async function updateUser(
  id: string,
  data: { username?: string; email?: string; password?: string }
): Promise<SafeUser | null> {
  const update: Partial<IUser> = {};

  if (data.username) (update as any).username = data.username;
  if (data.email) (update as any).email = data.email;

  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    (update as any).password = await bcrypt.hash(data.password, salt);
  }

  const updated = await usersRepository.updateUser(id, update);
  return updated ? toSafeUser(updated) : null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const existing = await usersRepository.getUserById(id);
  if (!existing) return false;
  await usersRepository.deleteUser(id);
  return true;
}
