/**
 * Oracle service
 * 1. Every 60 s fetch XRP-USD from a public API.
 * 2. Invert to get RLUSD→XRP (≈ USD→XRP).
 * 3. Cache in memory and expose to /oracle/price.
 */

export let latestPx = null;                 // RLUSD priced in XRP
export let lastTs   = 0;

async function getUsdPerXrp() {
  /* 1️⃣ Try CoinGecko -------------------------------------------------- */
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd",
      { timeout: 8000 }
    );
    if (res.ok) {
      const json = await res.json();
      return Number(json?.ripple?.usd);     // USD per 1 XRP
    }
  } catch (e) { /* ignore & fall through */ }

  /* 2️⃣ Fallback: Bitstamp -------------------------------------------- */
  const res2 = await fetch("https://www.bitstamp.net/api/v2/ticker/xrpusd/", {
    timeout: 8000
  });
  if (!res2.ok) throw new Error("All price feeds failed");
  const j2 = await res2.json();
  return Number(j2.last);                   // USD per 1 XRP
}

async function oracleLoop() {
  try {
    const usdPerXrp = await getUsdPerXrp();     // e.g. 0.53 USD       // e.g. 1 USD / 0.53 = 1.8868 XRP
    const px = Number(usdPerXrp.toFixed(6));

    latestPx = px;
    lastTs   = Date.now();

    console.log(`[oracle] XRP→RLUSD ${px}  (feed ${usdPerXrp} USD/XRP)`);

    /* optional: persist to Dynamo singleton if you like
       await ddb.update({ … });
    */
  } catch (err) {
    console.error("[oracle] fetch failed:", err.message);
  }
}

setInterval(oracleLoop, 60_000);
oracleLoop();                                // kick off immediately