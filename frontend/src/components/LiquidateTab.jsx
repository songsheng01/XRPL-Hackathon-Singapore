import { useEffect, useState, useContext } from "react";
import { WalletContext } from "./WalletContext";
import { sendPayment } from "@gemwallet/api";
import { POOL_ADDRESS } from "../config";
import { RLUSD_HEX, RLUSD_ISSUER } from "../config";

export default function LiquidateTab() {
 const { connected, address, balances, refresh } = useContext(WalletContext);

//  const unhealthy = [
//     { id: "C3D4", borrower: "rXYZ…123", repay: 50, bounty: 55 },
//     { id: "E5F6", borrower: "rABC…789", repay: 32, bounty: 35.2 }
//   ];
 const [unhealthy,setUnhealthy] = useState([]);
 const pullHistory = async () => {
  if (!connected) { setUnhealthy([]); return; }
  try {
    const r = await fetch("/loans/history", { method: "POST" });
    const { response } = await r.json();          // backend returns all
    const mineRaw = response.filter((i) => i.status === 'unhealthy');
    console.log(mineRaw)

    const mapped = mineRaw.map((i) => {
      const rawId = i.txn;
      const id = rawId.slice(0, 6) + "…";
      const repay = Number(i.totaldebt);
      const borrower = i.borrower.slice(0,4) + "…" + i.borrower.slice(-3);
      const bounty= Number(i.xrpAmount);
      return {
        id,
        borrower,
        repay,
        bounty
      };
    });
    console.log(mapped);
    setUnhealthy(mapped);
  } catch { }
};

  useEffect(() => {
    pullHistory();
    const id = setInterval(pullHistory, 45_000);
    return () => clearInterval(id);
  }, [connected, address]);

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
