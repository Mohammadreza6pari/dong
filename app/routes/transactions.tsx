export default function Route() {
  const transactions = [
    {
      id: 1,
      amount: 150,
      date: "2025-01-01",
      name: "علی",
      type: "to", // 'to' means money received, 'from' means money sent
    },
    {
      id: 2,
      amount: 50,
      date: "2025-01-03",
      name: "بابک",
      type: "from",
    },
    {
      id: 3,
      amount: 200,
      date: "2025-01-05",
      name: "مریم",
      type: "to",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          تاریخچه تراکنش‌ها
        </h2>

        {/* Transactions List */}
        <ul className="space-y-4">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className={`flex justify-between items-center p-4 rounded-lg shadow-md ${
                transaction.type === "to" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div className="flex items-center">
                <span
                  className={`text-sm font-medium ${
                    transaction.type === "to"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "to" ? "دریافت از" : "ارسال به"}{" "}
                  {transaction.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {transaction.type === "to" ? "+" : "-"}${transaction.amount}
                </div>
                <div className="text-sm text-gray-500">{transaction.date}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
