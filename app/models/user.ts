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

export async function findById(id: number) {
  return db.user.findUnique({ where: { id } });
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

  // if amount > 0 user2 owes user1
  const debt = await db.debt.aggregate({
    _sum: { amount: true },
    where: {
      OR: [
        { userId1: userId, amount: { lt: 0 } },
        { userId2: userId, amount: { gt: 0 } },
      ],
    },
  });
  const withdraw = await db.debt.aggregate({
    _sum: { amount: true },
    where: {
      OR: [
        { userId1: userId, amount: { gt: 0 } },
        { userId2: userId, amount: { lt: 0 } },
      ],
    },
  });

  const debtAmount = Math.abs(debt._sum.amount ?? 0);
  const withdrawAmount = Math.abs(withdraw._sum.amount ?? 0);

  return {
    name: user?.name,
    debtAmount,
    withdrawAmount,
    totalAmount: withdrawAmount - debtAmount,
  };
}
