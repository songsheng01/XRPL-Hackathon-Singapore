import { useState } from "react";

export default function LPTab() {
  const walletXRP = 500;
  const [amount, setAmount] = useState(0);
  const myShare = "3.2 %";   // placeholder
  const earned = "4.7 XRP";  // placeholder

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-purple-400">Add / Withdraw Liquidity</h2>

      {/* Deposit / withdraw */}
      <div className="bg-gray-900 p-6 rounded-xl shadow">
        <label className="block text-gray-400 text-sm mb-1">
          Amount XRP (balance: {walletXRP})
        </label>
        <input
          type="number"
          min="0"
          max={walletXRP}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value, 10))}
          className="w-full bg-gray-800 rounded p-2 text-white"
        />
        <div className="flex gap-4 mt-4">
          <button
            className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
            onClick={() => alert("TODO: deposit")}
          >
            Deposit
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            onClick={() => alert("TODO: withdraw")}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* My contribution */}
      <section className="bg-gray-900 p-6 rounded-xl shadow">
        <h3 className="text-lg font-medium mb-2">My Position</h3>
        <p className="text-sm text-gray-400">Pool Share: <span className="text-white">{myShare}</span></p>
        <p className="text-sm text-gray-400">Interest Earned: <span className="text-white">{earned}</span></p>
      </section>
    </div>
  );
}