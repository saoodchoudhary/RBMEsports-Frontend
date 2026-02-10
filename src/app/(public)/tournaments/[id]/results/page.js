import { api } from "@/lib/api";
import Card from "@/components/ui/Card";
import { FiChevronLeft, FiBarChart2 } from "react-icons/fi";
import Link from "next/link";

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function getRowName(r) {
  return r.teamName || r.userId?.inGameName || r.userId?.name || "—";
}

export default async function ResultsPage({ params }) {
  const { id } = await params;

  const [tRes, rRes] = await Promise.all([api.getTournament(id), api.matchResults(id)]);
  const t = tRes.data;
  const results = rRes.data || [];

  return (
    <div className="space-y-6">
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-emerald-50 border-b border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <FiBarChart2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800 truncate">
                    {t.title} — Match Results
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">Per match breakdown uploaded by admin.</p>
                </div>
              </div>
            </div>

            <Link
              href={`/tournaments/${t._id}`}
              className="text-sm font-semibold text-slate-700 hover:text-green-700 inline-flex items-center gap-2"
            >
              <FiChevronLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>

        <div className="p-6">
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <div className="text-slate-700 font-semibold">No match results yet</div>
              <div className="text-sm text-slate-600 mt-2">Results will appear once admin uploads them.</div>
            </div>
          ) : (
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-800">{results.length}</span> matches
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        {results.map((m) => (
          <Card key={m._id} className="p-0 overflow-hidden" hover={false}>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-extrabold text-slate-800">
                  Match #{m.matchNumber} <span className="text-slate-500 font-medium">(Day {m.matchDay})</span>
                </div>
                <div className="text-xs text-slate-600">
                  {m.map} • {m.matchType}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full text-sm">
                <thead className="bg-white">
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">#</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">
                      {t.tournamentType === "squad" ? "Team" : "Player"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Placement</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Kills</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Placement Pts</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Kill Pts</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Total</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {(m.results || []).map((r, idx) => (
                    <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{getRowName(r)}</td>
                      <td className="px-4 py-3">{safeNum(r.placement, 0)}</td>
                      <td className="px-4 py-3">{safeNum(r.kills, 0)}</td>
                      <td className="px-4 py-3">{safeNum(r.placementPoints, 0)}</td>
                      <td className="px-4 py-3">{safeNum(r.killPoints, 0)}</td>
                      <td className="px-4 py-3 font-extrabold text-slate-900">{safeNum(r.totalPoints, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}