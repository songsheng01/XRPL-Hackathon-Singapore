/**
 * Central constants and simple helpers.
 * Values can be overridden via .env for easy tuning.
 */

import dotenv from "dotenv";
dotenv.config();

/* ——————————————————————————————————————————————— */
/*  Lending economics                                                */
/* ——————————————————————————————————————————————— */
export const LTV_RATIO = Number(process.env.LTV_RATIO ?? 0.5);        // 50 %
export const LIQUIDATION_THRESHOLD = Number(process.env.LIQ_THRESHOLD ?? 0.7); // 70 %
export const INTEREST_APR = Number(process.env.INTEREST_APR ?? 0.07); // 7 %
export const PLATFORM_FEE_RATE = Number(process.env.PLATFORM_FEE ?? 0.01); // 1 %

/* ——————————————————————————————————————————————— */
/*  Asset & network details                                          */
/* ——————————————————————————————————————————————— */
export const RLUSD_HEX = "524C555344000000000000000000000000000000";
export const RLUSD_ISSUER =
  process.env.RLUSD_ISSUER ||
  "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV"; // Testnet RLUSD issuer