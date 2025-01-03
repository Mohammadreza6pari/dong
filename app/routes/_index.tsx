import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserInfo } from "~/models/user";
import { requireUserId } from "~/services/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  return json(await getUserInfo(userId));
};

export default function Route() {
  const { name, debtAmount, totalAmount, withdrawAmount } =
    useLoaderData<typeof loader>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">اطلاعات حساب</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">بدهی</span>
            <span className="font-semibold text-red-500">
              {debtAmount} تومان
            </span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">طلب</span>
            <span className="font-semibold text-yellow-500">
              {withdrawAmount} تومان
            </span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">تراز کلی</span>
            <span className="font-semibold text-green-500">
              {totalAmount} تومان
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href="/transactions"
            className="block w-full text-center text-blue-500 hover:underline"
          >
            تاریخچه تراکنش ها
          </a>
          <a
            href="/add"
            className="block w-full text-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            تراکنش جدید
          </a>
          <a
            href="/logout"
            className="block text-center px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            خروج
          </a>
        </div>
      </div>
    </div>
  );
}
