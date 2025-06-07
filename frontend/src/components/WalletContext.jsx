import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { isInstalled, getAddress } from "@gemwallet/api";
import { Client, dropsToXrp } from 'xrpl'


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
  address: null,
  balances: { xrp: "—", rlusd: "—" },
  connect: () => {},
  refresh: () => {}
});

/* ---------- Provider component ---------- */

export function WalletProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balances, setBalances] = useState({ xrp: "—", rlusd: "—" });

  /** Pull balances from backend (placeholder endpoint). */
  const refresh = useCallback(async () => {
    const installed = await isInstalled()
    if (!installed.result.isInstalled) {
      console.error('GemWallet did not install')
      return
    }

    try {
      const { result: { address } } = await getAddress()
      const TESTNET_WS = 'wss://s.altnet.rippletest.net:51233'
      const client = new Client(TESTNET_WS)
      await client.connect()

      const acctInfo = await client.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated'
      })
      const xrp = dropsToXrp(acctInfo.result.account_data.Balance);

      const resp = await client.request({
        command: 'account_lines',
        account: address,
        ledger_index: 'validated'
      });

      const { lines } = resp.result;
      console.log(lines);
      const rlusdLine = lines.find(l => l.currency === '524C555344000000000000000000000000000000');
      const rlusd = rlusdLine?.balance ?? '0'
      setBalances({ xrp: xrp ?? "0", rlusd: rlusd ?? "0" });
      await client.disconnect();
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
      const addrRes = await getAddress();
      const addr = addrRes.result.address;
      setAddress(addr || null);
      setConnected(true);
      await refresh();
    } catch (e) {
      console.error("Wallet connect error:", e);
    }
  }, []);

  /* Auto-refresh balances every 30 s when connected */
  // useEffect(() => {
  //   if (!connected) return;
  //   const id = setInterval(refresh, 30_000);
  //   return () => clearInterval(id);
  // }, [connected, refresh]);

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