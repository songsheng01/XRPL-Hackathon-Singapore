import { useState } from "react";

export default function BorrowTab() {
  const walletXRP = 500;               // placeholder balance
  const oraclePx = 0.462;              // placeholder
  const [collateral, setCollateral] = useState(0);

  const maxBorrow = ((collateral * oraclePx) * 0.5).toFixed(2); // RLUSD

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-purple-400">Borrow / Repay</h2>

      {/* Borrow panel */}
      <div className="bg-gray-900 p-6 rounded-xl shadow">
        <label className="block text-gray-400 text-sm mb-1">
          Lock XRP as collateral (balance: {walletXRP})
        </label>
        <input
          type="range"
          min="0"
          max={walletXRP}
          value={collateral}
          onChange={(e) => setCollateral(parseInt(e.target.value, 10))}
          className="w-full accent-purple-600"
        />
        <p className="mt-2 text-sm">
          Collateral:&nbsp;
          <span className="font-medium">{collateral} XRP</span>&nbsp;→ You can borrow&nbsp;
          <span className="font-medium">{maxBorrow} RLUSD</span>
        </p>
        <button
          className="mt-4 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
          onClick={() => alert("TODO: sign Payment")}
        >
          Borrow
        </button>
      </div>

      {/* My loans table (placeholder) */}
      <section>
        <h3 className="text-lg font-medium mb-2">My Loans</h3>
        <table className="w-full text-sm text-left">
          <thead className="uppercase text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2">Loan ID</th>
              <th>Collateral</th>
              <th>Debt</th>
              <th>LTV</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "A1B2", coll: 200, debt: 92.4, ltv: "46 %" },
              { id: "C3D4", coll: 150, debt: 80.0, ltv: "70 %" }
            ].map((ln) => (
              <tr key={ln.id} className="border-b border-gray-800">
                <td className="py-2">{ln.id}</td>
                <td>{ln.coll} XRP</td>
                <td>{ln.debt} RLUSD</td>
                <td className={ln.ltv.includes("70") ? "text-red-400" : ""}>{ln.ltv}</td>
                <td>
                  <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-xs">
                    Repay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}