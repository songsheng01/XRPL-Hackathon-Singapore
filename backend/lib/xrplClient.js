/**
 * xrplClient.js
 * ------------------------------------------------------------
 * A single, shared connection to the XRPL network.
 * Import { getClient } anywhere you need ledger access:
 *     const client = await getClient();
 * The same websocket is reused across the whole app.
 * ------------------------------------------------------------
 */

import { Client } from "xrpl";
import dotenv from "dotenv";
dotenv.config();

/* 1. Choose a default endpoint but let .env override it.
      Testnet + Hooks-Labs is the safest public playground. */
const WS_ENDPOINT =
  process.env.XRPL_WS_ENDPOINT ||
  "wss://s.altnet.rippletest.net:51233"; // XRPL Testnet

/* 2. Lazy-initialised singleton */
let _client = null;
let _connecting = null;

/**
 * Returns a connected xrpl.Client.
 * If the first call is still connecting, subsequent callers await the same promise.
 */
export async function getClient() {
  if (_client && _client.isConnected()) return _client;
  if (_connecting) return _connecting;          // somebody else is already connecting

  _connecting = (async () => {
    const client = new Client(WS_ENDPOINT, { connectionTimeout: 15_000 });
    await client.connect();
    console.log(`[xrplClient] Connected → ${WS_ENDPOINT}`);
    // Auto-reconnect on sudden disconnect
    client.on("disconnected", (code) => {
      console.warn(`[xrplClient] WebSocket closed (${code}). Reconnecting…`);
      _client = null;
    });
    return client;
  })();

  _client = await _connecting;
  _connecting = null;
  return _client;
}

/* 3. Optional helper: submit & wait */
export async function submitAndWait(wallet, txJson) {
  const client = await getClient();
  const signed = wallet.sign(txJson);
  const res = await client.submitAndWait(signed.tx_blob);
  if (res.result.engine_result !== "tesSUCCESS") {
    throw new Error(`Ledger rejected tx: ${res.result.engine_result}`);
  }
  return res;
}
