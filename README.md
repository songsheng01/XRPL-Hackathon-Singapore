# X-Credit

First native XRPL collateral-lending pool, establishing groundwork for plug-in RWA token platforms, bringing instant credit to tokenized assets.

## Project Overview
We built the first native collateral-backed lending protocol on the XRP Ledger. Borrowers lock any token on the XRP chain, mint RLUSD at 50% LTV, pay interest, and can be liquidated if their LTV is above a set threshold. Liquidity providers earn yield by supplying RLUSD to the pool; interest is distributed pro-rata. The demo is prepared with the XRP (collateral) / RLUSD (debt) pair.

## Problems It Solves
1. Dormant capital: idle token on the XRPL can now earn yield or fund productive loans.
2. On-ledger credit gap: XRPL lacked a money-market; our pool closes that gap without bridges or wrapped tokens.
3. RWA financing: tokenized assets (e.g. carbon credits, company capital, real-estate NFTs) need simple credit lines; the platform plugs in as the “borrow-against-your-token” layer.

## How XRPL Enables It
| XRPL Feature | What we leverage |
|-------|-----------|
| Native DEX order-books | Price oracle derives XRP / RLUSD mid-price dynamically. |
| Fast, low-fee Payments | Collateral deposits, RLUSD disbursal & liquidations settle in 3-4 s at <0.001 XRP. |
| Multisig & Memos | Pool wallet signs outflow, memos link on-chain tx-hashes to DynamoDB state for auditability. |

## Ready for XRPL Smart-Contract Upgrade
When XRPL ships native smart-contract support:
- Swap the central backend for an on-chain module, ensuring full trustlessness & transparent state.
- Interest calculation, LTV checks, and liquidations become deterministic ledger code.
- Existing front-end and account schema require zero changes, so migration is seamless.

## RWA Pipeline Integration
Because collateral & debt are simply XRPL IOUs, any asset tokenized on-chain can be whitelisted as collateral:
| RWA Example | Flow with our pool |
|-------|-----------|
| Carbon credit NFTs |	ESG project tokenises CO₂ tons → locks them → borrows RLUSD to finance new green sites. |
| Invoice tokens	SME | mints “invoice-2025-07” tokens → borrows working capital instantly. |
| Real-estate shares | REIT issues fractionalized deeds → lenders earn yield; owners unlock liquidity without selling property. |

Plug-and-play endpoints (/borrow, /repay, /lp_fund, /lp_withdraw) and standard XRPL payments make integration a two-step drop-in for any RWA front-end.

## Summary
We turned idle assets on the XRPL into productive collateral, launched the first lending rail on XRPL, and built a bridge-ready base for future smart-contract upgrades and RWA finance—from carbon credits to idle corporate capital—while giving RLUSD a deep, yield-driven utility loop that boosts demand and on-ledger liquidity.
