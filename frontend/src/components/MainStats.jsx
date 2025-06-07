export default function MainStats() {
  const price = "0.462";
  const change24h = "+1.8 %";
  const poolXRP = "12 345";
  const poolDebt = "5 700";
  const utilisation = "46 %";

  return (
    <section className="relative overflow-hidden">
      {/* background blobs */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-purple-800 opacity-30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600 opacity-20 blur-3xl" />
      {/* stats */}
      <div className="relative max-w-5xl mx-auto py-10 px-6">
        <h2 className="text-3xl font-semibold mb-6">Pool Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <Card label="XRP/RLUSD Price" value={price} sub={change24h} />
          <Card label="Total XRP in Pool" value={poolXRP} sub="XRP" />
          <Card label="Total RLUSD Debt" value={poolDebt} sub="RLUSD" />
          <Card label="Utilisation" value={utilisation} />
        </div>
      </div>
    </section>
  );
}

function Card({ label, value, sub }) {
  return (
    <div className="bg-gray-900/70 backdrop-blur rounded-2xl p-6 shadow-lg">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value} {sub && <span className="text-base font-medium">{sub}</span>}
      </p>
    </div>
  );
}