import crypto from "crypto";

type UserDTO = {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
};

const users: UserDTO[] = [];

export function createUser(
  username: string,
  email: string,
  password: string
): UserDTO {
  const user: UserDTO = {
    id: crypto.randomUUID(),
    username,
    email,
    password,
    createdAt: new Date(),
  };
  users.push(user);
  return user;
}

export function getUsers(): Omit<UserDTO, "password">[] {
  return users.map(({ password, ...u }) => u);
}

export function getUserById(id: string): Omit<UserDTO, "password"> | null {
  const u = users.find((u) => u.id === id);
  if (!u) return null;
  const { password, ...safe } = u;
  return safe;
}

export function updateUser(
  id: string,
  data: { username?: string; email?: string; password?: string }
): Omit<UserDTO, "password"> | null {
  const u = users.find((u) => u.id === id);
  if (!u) return null;

  if (data.username) u.username = data.username;
  if (data.email) u.email = data.email;
  if (data.password) u.password = data.password;

  const { password, ...safe } = u;
  return safe;
}

export function deleteUser(id: string): boolean {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;

  users.splice(idx, 1);
  return true;
}

