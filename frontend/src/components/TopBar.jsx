import { useContext } from "react";
import { WalletContext } from "./WalletContext";

export default function TopBar() {
  const { connected, address, balances, connect } = useContext(WalletContext);

  return (
    <header className="w-full bg-gray-950 border-b border-gray-800 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-purple-400">XRPL Lending Demo</h1>

        {connected ? (
          <div className="text-sm flex items-center gap-4">
            <span className="font-mono text-xs text-gray-400">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
            <span className="px-2 py-1 rounded bg-gray-800">
              {balances.xrp} XRP
            </span>
            <span className="px-2 py-1 rounded bg-gray-800">
              {balances.rlusd} RLUSD
            </span>
          </div>
        ) : (
          <button
            onClick={connect}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-sm"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}