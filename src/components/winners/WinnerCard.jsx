export default function WinnerCard({ w }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-slate-600">Rank #{w.rank}</div>
      <div className="mt-1 text-sm font-bold">{w.userId?.inGameName || w.userId?.name || "Winner"}</div>
      <div className="mt-1 text-xs text-slate-600">{w.tournamentId?.title}</div>
      <div className="mt-2 text-sm">
        Prize: <span className="font-bold">₹{w.prizeAmount}</span>
      </div>
    </div>
  );
}