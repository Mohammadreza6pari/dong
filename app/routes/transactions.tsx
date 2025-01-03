import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserDebts } from "~/models/transaction";
import { getUserId } from "~/services/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  if (!userId) return redirect("/login", 302);

  return json(await getUserDebts(userId));
}

export default function Route() {
  const transactions = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          تاریخچه تراکنش‌ها
        </h2>

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
