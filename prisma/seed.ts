import { createUser } from '~/models/user';

const users = [
  {
    name: 'Ali',
    phoneNumber: '09998887766',
    password: 'Ali1234'
  }
]

await Promise.all(
  users.map(async user =>
    createUser(
      user.name,
      user.phoneNumber,
      user.password,
    )
  )
)
console.log('\n✓ The database has been successfully seeded!\n')