import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { isInstalled, getAddress } from "@gemwallet/api";

/**
 * WalletContext
 * --------------
 * Provides:
 * • connected   – boolean
 * • address     – classic XRPL account address
 * • balances    – { xrp: string, rlusd: string }
 * • connect()   – trigger GemWallet connect flow
 * • refresh()   – re-fetch balances
 */
export const WalletContext = createContext({
  connected: false,
  address: "",
  balances: { xrp: "—", rlusd: "—" },
  connect: () => {},
  refresh: () => {}
});

/* ---------- Provider component ---------- */

export function WalletProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balances, setBalances] = useState({ xrp: "—", rlusd: "—" });

  /** Pull balances from backend (placeholder endpoint). */
  const refresh = useCallback(async (acct = address) => {
    if (!acct) return;
    try {
      const res = await fetch(`/api/balances/${acct}`);     // TODO: implement backend route
      const json = await res.json();
      setBalances({ xrp: json.xrp ?? "0", rlusd: json.rlusd ?? "0" });
    } catch (e) {
      console.error("Balance fetch error:", e);
    }
  }, [address]);

  /** One-time connect handler */
  const connect = useCallback(async () => {
    if (!(await isInstalled())) {
      alert("GemWallet not found. Please install the extension.");
      return;
    }
    try {
      const { publicAddress } = await getAddress();
      setAddress(publicAddress);
      setConnected(true);
      await refresh(publicAddress);
    } catch (e) {
      console.error("Wallet connect error:", e);
    }
  }, [refresh]);

  /* Auto-refresh balances every 30 s when connected */
  useEffect(() => {
    if (!connected) return;
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [connected, refresh]);

  return (
    <WalletContext.Provider value={{ connected, address, balances, connect, refresh }}>
      {children}
    </WalletContext.Provider>
  );
}

/* ---------- Convenient hook ---------- */

export function useWallet() {
  return useContext(WalletContext);
}