import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { createTransaction } from "~/models/transaction";
import { requireUserId } from "~/services/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const phoneNumber = formData.get("phoneNumber") as string;
  const amount = parseFloat(formData.get("amount") as string);

  const trx = await createTransaction(userId, phoneNumber, amount);

  if (!trx) return json({ error: "شماره در سیستم موجود نیست" }, 400);

  return redirect("/transactions");
};

export default function Route() {
  const error = useActionData<typeof action>()?.error;

  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          فرم ایجاد بدهی
        </h2>

        <Form method="POST" className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-600"
            >
              مبلغ تراکنش
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="مبلغ را وارد کنید"
              required
              defaultValue={searchParams.get("amount") ?? ""}
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 text-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="sender"
              className="block text-sm font-medium text-gray-600"
            >
              شماره تلفن فرستنده
            </label>
            <input
              type="tel"
              id="sender"
              name="phoneNumber"
              placeholder="شماره تلفن فرستنده را وارد کنید"
              pattern="^(\+98|0)?9\d{9}$" // Regex pattern for Iranian phone numbers
              required
              defaultValue={searchParams.get("phoneNumber") ?? ""}
              className="w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 text-gray-700"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              ثبت بدهی
            </button>
            <a
              href="/"
              className="block text-center px-4 py-2 my-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              بازگشت
            </a>
          </div>

          <p className="text-sm text-center text-red-500 mt-4">{error}</p>
        </Form>
      </div>
    </div>
  );
}
