import { createUser } from "~/models/user";

const users = [
  {
    name: "علی",
    phoneNumber: "09998887766",
    password: "Ali1234",
  },
  {
    name: "محسن",
    phoneNumber: "09887776655",
    password: "Mohsen1234",
  },
  {
    name: "سهیل",
    phoneNumber: "09776665544",
    password: "Soheil1234",
  },
];

await Promise.all(
  users.map(async (user) =>
    createUser(user.name, user.phoneNumber, user.password)
  )
);

console.log("\n✓ The database has been successfully seeded!\n");
