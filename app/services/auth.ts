import { createCookieSessionStorage, redirect } from '@remix-run/node'
import url from 'url'

import { findById } from '~/models/user'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) throw new Error('SESSION_SECRET must be set')

const storage = createCookieSessionStorage({
  cookie: {
    name: 'session',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createUserSession(userId: number) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return storage.commitSession(session)
}

export const getUserSession = async (request: Request) =>
  storage.getSession(request.headers.get('Cookie'))

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'number') return null
  return userId
}
export async function requireUserId(request: Request) {
  const userId = await getUserId(request)
  if (!userId || typeof userId !== 'number') throw await logout(request)
  return userId
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  return userId && findById(userId)
}
export async function requireUser(request: Request) {
  const user = await getUser(request)
  if (!user) throw await logout(request)
  return user
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  function formatLoginRedirect(
    { url: getBackTo }: Request,
    loginPath = '/login'
  ) {
    const getBackToPath = url.parse(getBackTo).pathname
    const queryString =
      getBackToPath &&
      getBackToPath !== '/logout' &&
      new URLSearchParams({ redirectTo: getBackToPath })
    return `${loginPath}${queryString ? `?${queryString}` : ''}`
  }
  return redirect(formatLoginRedirect(request), {
    status: 302,
    headers: { 'Set-Cookie': await storage.destroySession(session) },
  })
}
