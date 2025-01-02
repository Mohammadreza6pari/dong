import Prisma from "@prisma/client";
import bcrypt from "bcryptjs";
import db from "./db";

// TODO: the omitting should be done by Prisma in a future version, remove it then.
export type User = Omit<Prisma.User, "passwordHash">;

export async function createUser(
  name: string,
  phoneNumber: string,
  password: string
) {
  const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());
  return db.user.create({
    data: { name, phoneNumber, passwordHash },
  });
}

export async function update(id: number, data: Partial<Omit<User, "id">>) {
  try {
    const res = await db.user.update({ where: { id }, data });
    return { success: true, updatedUser: res };
  } catch {
    return { success: false, message: "Failed to update user information" };
  }
}

export async function findByPhoneNumber(phoneNumber: string) {
  return db.user.findUnique({ where: { phoneNumber } });
}

export async function login(phoneNumber: string, password: string) {
  const user = await db.user.findUnique({
    where: { phoneNumber },
  });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;
  return user;
}

export async function getUserInfo(userId: number) {
  const user = await db.user.findUnique({ where: { id: userId } });

  const debt = await db.transaction.aggregate({
    _sum: { amount: true },
    where: { receiverId: userId },
  });

  const withdraw = await db.transaction.aggregate({
    _sum: { amount: true },
    where: { senderId: userId },
  });

  return {
    name: user?.name,
    debt: debt._sum.amount ?? 0,
    withdraw: withdraw._sum.amount ?? 0,
    total: (withdraw._sum.amount ?? 0) - (debt._sum.amount ?? 0),
  };
}
