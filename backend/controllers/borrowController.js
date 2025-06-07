/**
 * borrowController.js
 * ------------------------------------------------------------
 * POST  /borrow
 * Body: { txHash: "<hash of XRP→pool Payment>" }
 *
 * Verifies the inbound payment, calculates RLUSD debt at 50 % LTV,
 * sends RLUSD from the pool wallet to the borrower, and
 * inserts a row into the Loans table.
 * ------------------------------------------------------------
 */

import { getClient } from "../lib/xrplClient.js";
import { getPoolAddress, sendPayment } from "../lib/signer.js";
import * as loanModel from "../models/loanModel.js";
import { v4 as uuid } from "uuid";
import { RLUSD_ISSUER, LTV_RATIO, getOraclePrice } from "../config.js";

export async function borrow(req, res) {
  try {
    const { txHash } = req.body;
    if (!txHash) return res.status(400).json({ error: "Missing txHash" });

    const client = await getClient();
    const txResp = await client.request({ command: "tx", transaction: txHash });

    // 1. Validate the inbound Payment
    const tx = txResp.result;
    if (!tx.validated) return res.status(400).json({ error: "Payment not validated yet" });
    if (tx.TransactionType !== "Payment")
      return res.status(400).json({ error: "tx must be a Payment" });
    if (tx.Destination !== getPoolAddress())
      return res.status(400).json({ error: "Payment not sent to pool" });
    if (typeof tx.Amount !== "string")
      return res.status(400).json({ error: "Amount must be XRP (drops)" });

    const borrower = tx.Account;
    const collateralXrp = Number(tx.Amount) / 1_000_000; // drops→XRP

    // 2. Calculate RLUSD output
    const price = await getOraclePrice();                // RLUSD per 1 XRP
    const principal = +(collateralXrp * price * LTV_RATIO).toFixed(6); // RLUSD

    // 3. Send RLUSD to borrower
    await sendPayment({
      destination: borrower,
      amount: {
        currency: "RLUSD",
        value: principal.toString(),
        issuer: RLUSD_ISSUER
      },
      memos: [{ type: "BORROW", data: txHash }]
    });

    // 4. Record loan
    const loanId = uuid();
    await loanModel.createEntry({
      loanId,
      borrower,
      xrpCollateral: collateralXrp,
      rlusdDebt: principal,
      interest: 0,
      totalDebt: principal,
      status: "ACTIVE"
    });

    return res.json({ loanId, borrower, principal, collateralXrp });
  } catch (err) {
    console.error("[borrowController] ", err);
    return res.status(500).json({ error: err.message });
  }
}

/* ----------------- (optional helper) ----------------- */
/*  GET /loans/:address → list active loans for wallet   */
export async function listByAddress(req, res) {
  try {
    const { address } = req.params;
    const loans = await loanModel.findByBorrower(address);
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
