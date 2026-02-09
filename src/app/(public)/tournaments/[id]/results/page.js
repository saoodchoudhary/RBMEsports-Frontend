import { api } from "@/lib/api";
import React from "react";

export default async function ResultsPage({ params }) {
    
      const { id } = React.use(params);
  const [tRes, rRes] = await Promise.all([
    api.getTournament(id),
    api.matchResults(id)
  ]);

  const t = tRes.data;
  const results = rRes.data || [];

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h1 className="text-xl font-extrabold">{t.title} — Match Results</h1>
        <p className="mt-1 text-sm text-slate-600">Per match breakdown uploaded by admin.</p>
      </div>

      <div className="space-y-4">
        {results.map((m) => (
          <div key={m._id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-bold">Match #{m.matchNumber} (Day {m.matchDay})</div>
              <div className="text-xs text-slate-600">{m.map} • {m.matchType}</div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-600">#</th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-600">Player/Team</th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-600">Placement</th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-600">Kills</th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-600">Placement Pts</th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-600">Kill Pts</th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-slate-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {m.results.map((r, idx) => (
                    <tr key={idx} className="border-t" style={{ borderColor: "var(--border)" }}>
                      <td className="px-3 py-2">{idx + 1}</td>
                      <td className="px-3 py-2">{r.teamName || r.userId?.inGameName || "—"}</td>
                      <td className="px-3 py-2">{r.placement}</td>
                      <td className="px-3 py-2">{r.kills}</td>
                      <td className="px-3 py-2">{r.placementPoints}</td>
                      <td className="px-3 py-2">{r.killPoints}</td>
                      <td className="px-3 py-2 font-bold">{r.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}