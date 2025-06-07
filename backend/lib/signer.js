/**
 * signer.js
 * ------------------------------------------------------------
 * Wraps the pool wallet (hot key) and exposes two helpers:
 *   • getPoolAddress()  → classic account string
 *   • sendPayment(opts) → submits a Payment and waits for validation
 *
 * The wallet seed lives in .env  →  POOL_SECRET=<secret>
 * ------------------------------------------------------------
 */

import { Wallet } from "xrpl";
import dotenv from "dotenv";
import { getClient } from "./xrplClient.js";
dotenv.config();

/* ---------- 1. Init wallet from env ---------- */
const POOL_SECRET = process.env.POOL_SECRET;

if (!POOL_SECRET) {
  throw new Error("Missing env var POOL_SECRET (pool wallet seed)");
}

const poolWallet = Wallet.fromSeed(POOL_SECRET); // throws if invalid

export function getPoolAddress() {
  return poolWallet.classicAddress;
}

/* ---------- 2. Generic Payment helper ---------- */
export async function sendPayment({
  destination,
  amount,            // in drops (XRP)  OR  { currency, value, issuer }
  memos = []         // [{ type:"", data:"" } ...]
}) {
  const client = await getClient();

  const tx = {
    TransactionType: "Payment",
    Account: poolWallet.classicAddress,
    Destination: destination,
    Amount: amount,
    Memos: memos.map((m) => ({
      Memo: {
        MemoType: Buffer.from(m.type, "utf8").toString("hex").toUpperCase(),
        MemoData: Buffer.from(m.data, "utf8").toString("hex").toUpperCase()
      }
    }))
  };

  const signed = poolWallet.sign(tx);
  const res = await client.submitAndWait(signed.tx_blob);

  if (res.result.engine_result !== "tesSUCCESS") {
    throw new Error(`Payment failed: ${res.result.engine_result}`);
  }
  return res.result.tx_json.hash;
}
