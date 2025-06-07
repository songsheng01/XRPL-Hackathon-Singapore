import express from "express";
import { latestPx } from "../services/oracleService.js";   // the in-memory cache

const router = express.Router();

/**
 * GET /oracle/price
 * Returns { price: <XRP per RLUSD>, ts: <unix-ms> }
 */
router.get("/price", (_req, res) => {
  if (latestPx === null) {
    return res.status(503).json({ error: "price not ready" });
  }
  res.json({ price: latestPx, ts: Date.now() });
});

export default router;
