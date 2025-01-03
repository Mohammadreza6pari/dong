import db from "./db";
import { findById, findByPhoneNumber } from "./user";

export async function createTransaction(
  userId: number,
  senderPhoneNumber: string,
  amount: number
) {
  const sender = await findByPhoneNumber(senderPhoneNumber);

  if (!sender || sender.id === userId) {
    return null;
  }

  const debt = await db.debt.findFirst({
    where: {
      OR: [
        { userId1: userId, userId2: sender.id },
        { userId2: userId, userId1: sender.id },
      ],
    },
  });

  if (!debt) {
    return db.debt.create({
      data: { userId1: sender.id, userId2: userId, amount },
    });
  }

  const userIs1 = debt.userId1 === userId;

  const newAmount = debt.amount + (userIs1 ? -amount : amount);

  return db.debt.updateMany({
    where: {
      userId1: userIs1 ? userId : sender.id,
      userId2: userIs1 ? sender.id : userId,
    },
    data: { amount: newAmount },
  });
}

export async function getUserDebts(userId: number) {
  const transactions = await db.debt.findMany({
    where: {
      OR: [{ userId1: userId }, { userId2: userId }],
      amount: { not: 0 },
    },
  });

  const debts = [];

  for (const { userId1, userId2, amount } of transactions) {
    const userIs1 = userId1 === userId;
    const userAsks = userIs1 === amount > 0;

    const otherUser = await findById(userIs1 ? userId2 : userId1);

    debts.push({
      userAsks,
      name: otherUser?.name,
      phoneNumber: otherUser?.phoneNumber,
      amount: Math.abs(amount),
    });
  }
  return debts;
}
