import { useEffect, useState, useContext } from "react";
import { WalletContext } from "./WalletContext";
import { sendPayment } from "@gemwallet/api";
import { POOL_ADDRESS } from "../config";
import { RLUSD_HEX, RLUSD_ISSUER } from "../config";

export default function BorrowTab() {
  const { connected, address, balances, refresh } = useContext(WalletContext);

  /* ── live RLUSD→XRP oracle price ───────────────────────────── */
  const [oraclePx, setOraclePx] = useState(null);
  useEffect(() => {
    async function fetchPrice() {
      try {
        const r = await fetch("/oracle/price");
        if (!r.ok) throw new Error(r.status);
        const { price } = await r.json();
        setOraclePx(price);
      } catch (e) {
        console.error("oracle fetch fail", e);
      }
    }
    fetchPrice();
    const id = setInterval(fetchPrice, 60_000);
    return () => clearInterval(id);
  }, []);

  /* ── collateral slider ─────────────────────────────────────── */
  const walletXRP = connected ? Number(balances.xrp) : 0;
  const [collateral, setCollateral] = useState(0);
  const maxBorrow =
    oraclePx && collateral
      ? ((collateral * oraclePx) * 0.5).toFixed(2)
      : "—";

  /* ── handle Borrow click ───────────────────────────────────── */
  const [sending, setSending] = useState(false);
  const handleBorrow = async () => {
    if (!connected) return alert("Connect wallet first");
    if (!oraclePx) return alert("Oracle not ready");
    if (!collateral) return alert("Choose collateral");

    setSending(true);
    try {
      /* 1️⃣  Sign + submit XRP → pool */
      const drops = (collateral * 1_000_000).toString();  // 1 XRP = 1 000 000 drops
      const rsp = await sendPayment({
        destination: POOL_ADDRESS,
        amount: drops
      });
      console.log(rsp.result.hash)
      if (!rsp?.result?.hash) throw new Error("Tx rejected in wallet");

      /* 2️⃣  Notify backend to disburse RLUSD & log loan */
      await fetch("/loans/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          borrower: address,
          xrpAmount: collateral
        })
      });

      alert("Borrowed successfully! RLUSD will arrive after ledger validation.");
      setCollateral(0);
      refresh(); // refresh wallet balances in top bar
    } catch (err) {
      console.error(err);
      alert("Borrow failed: " + err.message);
    } finally {
      setSending(false);
    }
  };

  /* ── MY LOANS (client-side filter) ───────────────────────── */
  const [rows, setRows] = useState([]);

  const pullHistory = async () => {
    if (!connected) { setRows([]); return; }
    try {
      const r = await fetch("/loans/history", { method: "POST" });
      const { response } = await r.json();          // backend returns all
      const mineRaw = response.filter((i) => i.borrower === address);
      console.log(mineRaw)

      const mapped = mineRaw.map((i) => {
        const rawId = i.txn;
        const id = rawId.slice(0, 6) + "…";
        const coll = Number(i.xrpAmount);
        const debt = Number(i.totaldebt);
        const ltv = oraclePx
          ? ((debt / (coll * oraclePx)) * 100).toFixed(0) + " %"
          : "—";
        const status = i.status;
        return {
          id,
          rawId,
          coll,
          debt,
          ltv,
          status
        };
      });
      console.log(mapped);
      setRows(mapped);
    } catch { }
  };

  useEffect(() => {
    pullHistory();
    const id = setInterval(pullHistory, 45_000);
    return () => clearInterval(id);
  }, [connected, address, oraclePx]);

  const handleRepay = async (ln) => {
    if (!connected) return;
    try {
      /* sign RLUSD -> pool */
      await sendPayment({
        destination: POOL_ADDRESS,
        amount: {
          currency: RLUSD_HEX,
          issuer: RLUSD_ISSUER,   // RLUSD issuer
          value: ln.debt.toString()
        }
      });
      /* backend notify */
      await fetch("/loans/repay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanId: ln.rawId })
      });
      refresh();
    } catch (e) {
      alert("Repay failed: " + e.message);
    }
  };

  /* ── UI ─────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-purple-400">Borrow / Repay</h2>

      <div className="bg-gray-900 p-6 rounded-xl shadow">
        <label className="block text-gray-400 text-sm mb-1">
          Lock XRP as collateral (balance: {connected ? balances.xrp : "—"})
        </label>

        <input
          type="range"
          min="0"
          max={walletXRP}
          value={collateral}
          onChange={(e) => setCollateral(parseInt(e.target.value, 10))}
          disabled={!connected || sending}
          className="w-full accent-purple-600"
        />

        <p className="mt-2 text-sm">
          Collateral&nbsp;
          <span className="font-medium">{collateral} XRP</span> → Borrow&nbsp;
          <span className="font-medium">{maxBorrow} RLUSD</span>
        </p>
        <p className="mt-2 text-sm">
          Loan APR&nbsp;
          <span className="font-medium">7%</span>
        </p>

        <button
          className="mt-4 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition disabled:opacity-40"
          onClick={handleBorrow}
          disabled={!connected || !collateral || !oraclePx || sending}
        >
          {sending ? "Submitting…" : "Borrow"}
        </button>
      </div>

      {/* Loan table */}
      <section className="mt-8">
        <h3 className="text-lg font-medium mb-2">My Loans</h3>

        {rows.length === 0 ? (
          <p className="text-xs text-gray-500">
            {connected ? "No active loans." : "Connect wallet to view loans."}
          </p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="uppercase text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2">Loan&nbsp;ID</th>
                <th>Collateral</th>
                <th>Debt</th>
                <th>LTV</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((ln) => (
                <tr key={ln.id} className="border-b border-gray-800">
                  <td className="py-2">{ln.id}</td>
                  <td>{ln.coll} XRP</td>
                  <td>{ln.debt} RLUSD</td>
                  <td className={ln.ltv.startsWith("7") ? "text-red-400" : ""}>
                    {ln.ltv}
                  </td>
                  <td>{ln.status}</td>
                  <td>
                    {ln.status === "active" ? (
                      <button
                        className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-xs"
                        onClick={() => handleRepay(ln)}
                      >
                        Repay
                      </button>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}