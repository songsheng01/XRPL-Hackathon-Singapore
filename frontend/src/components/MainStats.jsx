import { useEffect, useState } from "react";

export default function MainStats() {
  const [price, setPrice] = useState("—");     // XRP per 1 RLUSD
  const [delta, setDelta] = useState("0.0%");
  const [poolXRP,setpoolXRP] = useState("—");
  const [poolDebt,setpoolDebt] = useState("—");;
  // const poolXRP = "12 345";
  // const poolDebt = "5 700";
  const utilisation = "46 %";

  // fetch on mount + every 60 s
  useEffect(() => {
    let prev = null;

    async function fetchPrice() {
      try {
        const res = await fetch("/oracle/price");
        if (!res.ok) throw new Error("HTTP " + res.status);
        const { price: p } = await res.json();   // p is number
        if (prev !== null) {
          const pct = (((p - prev) / prev) * 100).toFixed(2) + " %";
          console.log(pct)
          setDelta(pct.startsWith("-") ? pct : "+" + pct);
        }
        prev = p;
        setPrice(p.toFixed(4));

        const responese1 = await fetch("/mainwallet/balance");
        const { success, balances } = await responese1.json();
        if (!success) {
          throw new Error("Failed to fetch balances");
        }

        const { xrp, rlusd } = balances;
        setpoolXRP(xrp);
        setpoolDebt(rlusd);
      } catch (err) {
        console.error("Price fetch failed", err);
        setPrice("—");
        setDelta("—");
        setpoolXRP("—");
        setpoolDebt("—");
      }
    }

    fetchPrice();                               // run immediately
    const id = setInterval(fetchPrice, 60_000); // then every 60 s
    return () => clearInterval(id);             // cleanup on unmount
  }, []);

  // placeholder pool stats (replace later)
  

  return (
    <section className="relative overflow-hidden">
      {/* decorative blobs */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-purple-800 opacity-30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl" />

      <div className="relative max-w-5xl mx-auto py-10 px-6">
        <h2 className="text-3xl font-semibold mb-6">Pool Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <StatCard label="XRP → RLUSD" value={price} sub={delta} />
          <StatCard label="Lending Pool Liquidity" value={poolDebt} sub="RLUSD" />
          <StatCard label="Total Active XRP" value={poolXRP} sub="XRP" />
          <StatCard label="Utilisation" value={utilisation} />
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-900/70 backdrop-blur rounded-2xl p-6 shadow-lg">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value} {sub && <span className="text-base font-medium">{sub}</span>}
      </p>
    </div>
  );
}
