import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { login } from "~/models/user";
import { createUserSession, getUserId } from "~/services/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const user = await login(phoneNumber, password);

  return user
    ? redirect("/", {
        headers: { "Set-Cookie": await createUserSession(user.id) },
      })
    : json({ error: "شماره همراه یا کلمه عبور نادرست است" }, 400);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/", 302);
  return null;
};

export default function Route() {
  const error = useActionData<{ error: string }>()?.error;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          دونگ
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">ورود</p>

        <Form method="POST" className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-600">
              شماره تلفن همراه
            </span>
            <input
              type="tel"
              id="phone"
              name="phoneNumber"
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 text-gray-700"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-600">
              کلمه عبور
            </span>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 text-gray-700"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              ورود
            </button>
          </div>
        </Form>

        <p className="text-sm text-center text-red-500 mt-4">{error}</p>
      </div>
    </div>
  );
}
