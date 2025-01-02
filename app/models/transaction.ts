import db from "./db";
import { findByPhoneNumber } from "./user";

export async function createTransaction(
  userId: number,
  senderPhoneNumber: string,
  amount: number
) {
  const sender = await findByPhoneNumber(senderPhoneNumber);

  if (!sender || sender.id === userId) {
    return null;
  }

  return db.transaction.create({
    data: { receiverId: userId, senderId: sender.id, amount },
  });
}

export async function getUserTransactions(userId: number) {
  const transactions = await db.transaction.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    select: {
      id: true,
      amount: true,
      date: true,
      sender: { select: { id: true, name: true, phoneNumber: true } },
      receiver: { select: { name: true, phoneNumber: true } },
    },
    orderBy: { date: "desc" },
  });

  return transactions.map(({ sender, receiver, ...trx }) => {
    const isSender = sender.id === userId;

    return {
      ...trx,
      type: isSender ? "sender" : "receiver",
      name: isSender ? receiver.name : sender.name,
      phoneNumber: isSender ? receiver.phoneNumber : sender.phoneNumber,
    };
  });
}
