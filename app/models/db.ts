import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-var
  var __db: PrismaClient | undefined
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
let db: PrismaClient = null as never

function initDb() {
  if (process.env.NODE_ENV === 'production')
    db = new PrismaClient()
  else {
    if (!global.__db) global.__db = new PrismaClient()
    db = global.__db
  }
}

if (typeof window === 'undefined') initDb()

export default db
