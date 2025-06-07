export default function LiquidateTab() {
  const unhealthy = [
    { id: "C3D4", borrower: "rXYZ…123", repay: 50, bounty: 55 },
    { id: "E5F6", borrower: "rABC…789", repay: 32, bounty: 35.2 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-purple-400">Liquidations</h2>

      <table className="w-full text-sm text-left">
        <thead className="uppercase text-gray-400 border-b border-gray-700">
          <tr>
            <th className="py-2">Loan ID</th>
            <th>Borrower</th>
            <th>Repay (RLUSD)</th>
            <th>Bounty (XRP)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {unhealthy.map((ln) => (
            <tr key={ln.id} className="border-b border-gray-800">
              <td className="py-2">{ln.id}</td>
              <td>{ln.borrower}</td>
              <td>{ln.repay}</td>
              <td className="text-green-400">{ln.bounty}</td>
              <td>
                <button
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                  onClick={() => alert(`TODO: repay ${ln.repay} RLUSD`)}
                >
                  Liquidate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
