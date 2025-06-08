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
| Carbon credit tokens |	ESG project tokenizes CO₂ tons → locks them → borrows RLUSD to finance new green sites. |
| Idle company capital & land | Corporation tokenises surplus cash reserves or land-titles → locks them as collateral → draws RLUSD working capital instantly. |
| Real-estate shares | REIT issues fractionalized deeds → lenders earn yield; owners unlock liquidity without selling property. |

Plug-and-play endpoints (/borrow, /repay, /lp_fund, /lp_withdraw) and standard XRPL payments make integration a two-step drop-in for any RWA front-end.

## Technical snapshot
# SDK / stack
- xrpl.js (v3) — ledger queries, autofill, reliable submission
- @gemwallet/api — in-browser signing for XRP & RLUSD payments
- AWS SDK v3 (DynamoDBDocumentClient) — ledger-indexed loan / LP state
- Express + Node 18 service layer, CloudWatch cron for daily interest
- React 18 + Tailwind v3 single-page UI
# XRPL features we lean on
- Issued-currency trust-lines: store RLUSD balances, LP shares and loan debt entirely on-chain.
- Native DEX order-books & autobridging: provide a built-in RLUSD-XRP mid-price oracle.
- Payment-level memos: bind every collateral deposit, disbursal and liquidation to a Dynamo record via tx-hash for auditability.
- 3-4s finality & <0.001 XRP fees: make rapid collateral rotation and liquidations economic even for small tickets.
- Multisig / smart contract upgrade: today’s pool uses one hot key; tomorrow it can swap to on-ledger smart-contracts without changing UI or user workflow, gaining full trustlessness and transparency.

These XRPL primitives—cheap deterministic finality, built-in Dex pricing, and account-level IOU handling—let us ship the first collateralised lending rail and instantly give RLUSD (and future RWA tokens) a deep, yield-driven utility loop.

## Summary
We turned idle assets on the XRPL into productive collateral, launched the first lending rail on XRPL, and built a bridge-ready base for future smart-contract upgrades and RWA finance—from carbon credits to idle corporate capital—while giving RLUSD a deep, yield-driven utility loop that boosts demand and on-ledger liquidity.
