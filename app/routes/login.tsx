import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node'
import { Form } from '@remix-run/react'

import { login } from '~/models/user'
import { createUserSession, getUserId } from '~/services/auth'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const phoneNumber = formData.get('phoneNumber')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const user = await login(phoneNumber, password)

  return user
    ? redirect('/dashboard', {
        headers: { 'Set-Cookie': await createUserSession(user.id) },
      })
    : json({ error: 'Phone Number / Password is invalid'}, 400)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  if (userId) return redirect('/', 302)
  return null
}

export default function Route() {
  return (
    <Form method="POST">
      <input type="text" name="phoneNumber" placeholder="phone number" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit">login</button>
    </Form>
  )
}
