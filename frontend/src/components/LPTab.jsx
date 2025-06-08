import { useContext, useEffect, useState } from "react";
import { WalletContext } from "./WalletContext";
import { sendPayment } from "@gemwallet/api";
import { POOL_ADDRESS } from "../config";
import { RLUSD_HEX, RLUSD_ISSUER } from "../config";

export default function LPTab() {
  const { connected, address, balances, refresh } = useContext(WalletContext);

  /* ---- local state ------------------------------------------------ */
  const [amount, setAmount] = useState("");
  const [lpBalance, setLpBalance] = useState("0");    // current share
  const [sending, setSending] = useState(false);

  /* ---- pull LP info every 45 s ----------------------------------- */
  const pullInfo = async () => {
    if (!connected) return;
    const r = await fetch("/lp/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAddress: address })
    });
    const j = await r.json();
    if (j.success) setLpBalance(j.response.amount);
  };
  useEffect(() => {
    pullInfo();
    const id = setInterval(pullInfo, 45_000);
    return () => clearInterval(id);
  }, [connected, address]);

  /* ---- deposit ---------------------------------------------------- */
  const handleDeposit = async () => {
    if (!connected) return alert("Connect wallet");
    if (!amount) return;
    setSending(true);
    try {
      /* sign XRP → pool */
      const drops = (Number(amount) * 1_000_000).toString();
      await sendPayment({
        destination: POOL_ADDRESS,
        amount: {
          currency: RLUSD_HEX,
          issuer: RLUSD_ISSUER,
          value: amount.toString()
        }
      });
      /* backend notify */
      await fetch("/lp/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address, amount: Number(amount) })
      });
      setAmount("");
      refresh();
      pullInfo();
    } catch (e) {
      alert("Deposit failed: " + e.message);
    } finally {
      setSending(false);
    }
  };

  /* ---- withdraw --------------------------------------------------- */
  const handleWithdraw = async () => {
    if (!connected) return;
    if (!amount) return;
    if (Number(amount) > Number(lpBalance)) return alert("Not enough share");
    setSending(true);
    try {
      await fetch("/lp/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address, amount: Number(amount) })
      });
      setAmount("");
      refresh();
      pullInfo();
    } catch (e) {
      alert("Withdraw failed: " + e.message);
    } finally {
      setSending(false);
    }
  };

  /* ---- UI --------------------------------------------------------- */
  const walletRLUSD = connected ? balances.rlusd : "—";
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-purple-400">
        Add / Withdraw Liquidity
      </h2>

      <div className="bg-gray-900 p-6 rounded-xl shadow">
        <label className="block text-gray-400 text-sm mb-1">
          Amount RLUSD (balance: {walletRLUSD})
        </label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-800 rounded p-2 text-white"
          disabled={!connected}
        />
        <div className="flex gap-4 mt-4">
          <button
            className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition disabled:opacity-40"
            onClick={handleDeposit}
            disabled={!connected || sending || !amount}
          >
            Deposit
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition disabled:opacity-40"
            onClick={handleWithdraw}
            disabled={
              !connected ||
              sending ||
              !amount ||
              Number(amount) > Number(lpBalance)
            }
          >
            Withdraw
          </button>
        </div>
      </div>

      <section className="bg-gray-900 p-6 rounded-xl shadow">
        <h3 className="text-lg font-medium mb-2">My Position</h3>
        <p className="text-sm text-gray-400">
          Current Share:&nbsp;
          <span className="text-white">{lpBalance} RLUSD</span>
        </p>
        <p className="text-sm text-gray-400">
          Accrued Interest:&nbsp;
          <span className="text-white">0 RLUSD</span>
        </p>
        <p className="text-sm text-gray-400">
          Expected APY:&nbsp;
          <span className="text-white">6%</span>
        </p>
      </section>
    </div>
  );
}
