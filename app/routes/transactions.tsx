import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserDebts } from "~/models/transaction";
import { requireUserId } from "~/services/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);

  return json(await getUserDebts(userId));
}

export default function Route() {
  const transactions = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          وضعیت بدهی‌ها و طلب‌ها از افراد
        </h2>
        <a
          href="/"
          className="block text-center px-4 py-2 my-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          بازگشت به خانه
        </a>
        <ul className="space-y-4">
          {transactions.map((transaction) => (
            <li
              key={transaction.phoneNumber}
              className={`flex justify-between items-center p-4 rounded-lg shadow-md ${
                transaction.userAsks ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div className="flex items-center">
                <span
                  className={`text-sm font-medium ${
                    transaction.userAsks ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.userAsks ? "طلب از" : "بدهی به"}{" "}
                  {transaction.name}
                </span>
              </div>
              <div className="text-sm font-medium">
                {transaction.phoneNumber}
              </div>
              {transaction.userAsks && (
                <a
                  href={`/add?phoneNumber=${transaction.phoneNumber}&amount=${transaction.amount}`}
                  className="block text-center px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                  تسویه طلب
                </a>
              )}
              <div className="text-right">
                <div className="text-lg font-semibold">
                  تومان {transaction.amount}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
