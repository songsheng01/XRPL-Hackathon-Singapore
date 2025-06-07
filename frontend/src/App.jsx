import { useState } from "react";
import TopBar from "./components/TopBar";
import MainStats from "./components/MainStats";
import BorrowTab from "./components/BorrowTab";
import LPTab from "./components/LPTab";
import LiquidateTab from "./components/LiquidateTab";

export default function App() {
  const [active, setActive] = useState("borrow");

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Top price + pool stats */}
      <TopBar />
      <MainStats />

      {/* Tab buttons */}
      <div className="flex justify-center mt-6 space-x-4">
        {["borrow", "liquidity", "liquidate"].map((k) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            className={`px-4 py-2 rounded-lg transition text-sm
              ${active === k
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            {k === "borrow" && "Borrow / Repay"}
            {k === "liquidity" && "Add / Withdraw Liquidity"}
            {k === "liquidate" && "Liquidations"}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {active === "borrow" && <BorrowTab />}
        {active === "liquidity" && <LPTab />}
        {active === "liquidate" && <LiquidateTab />}
      </main>
    </div>
  );
}