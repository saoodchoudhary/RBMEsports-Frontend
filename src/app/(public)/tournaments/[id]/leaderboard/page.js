"use"
import { api } from "@/lib/api";
import Table from "@/components/ui/Table";
import Card from "@/components/ui/Card";
import { GiRank3, GiTrophy } from "react-icons/gi";
import { FiUsers, FiTarget, FiChevronLeft } from "react-icons/fi";
import Link from "next/link";

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function getDisplayName(tournamentType, r) {
  if (tournamentType === "squad") return r.teamName || "—";
  return r.inGameName || r.userId?.inGameName || r.userId?.name || "—";
}

export default async function LeaderboardPage({ params }) {
  const { id } = await params;

  const [tRes, lbRes] = await Promise.all([api.getTournament(id), api.leaderboard(id)]);
  const t = tRes.data;
  const rowsRaw = lbRes.data || [];

  const rows = rowsRaw.map((r, i) => ({
    ...r,
    rank: r.rank || r.placement || i + 1
  }));

  const top3 = rows.slice(0, 3);

  const columns = [
    {
      key: "rank",
      title: "#",
      render: (r) => (
        <div className="font-bold text-slate-800">
          {r.rank}
        </div>
      )
    },
    {
      key: "name",
      title: t.tournamentType === "squad" ? "Team" : "Player",
      render: (r) => (
        <div className="min-w-[200px]">
          <div className="font-semibold text-slate-800">{getDisplayName(t.tournamentType, r)}</div>
          {t.tournamentType !== "squad" && (r.bgmiId || r.userId?.bgmiId) && (
            <div className="text-xs text-slate-500">BGMI: {r.bgmiId || r.userId?.bgmiId}</div>
          )}
        </div>
      )
    },
    {
      key: "totalKills",
      title: "Kills",
      render: (r) => <div className="font-medium">{safeNum(r.totalKills, 0)}</div>
    },
    {
      key: "totalPoints",
      title: "Points",
      render: (r) => <div className="font-bold text-blue-700">{safeNum(r.totalPoints, 0)}</div>
    }
  ];

  return (
    <div className="space-y-6">
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 border-b border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <GiRank3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800 truncate">
                    {t.title} — Leaderboard
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Transparent scoring: kills + placement points.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 inline-flex items-center gap-1">
                  <FiUsers className="w-3 h-3" /> {rows.length} entries
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                  <FiTarget className="w-3 h-3" /> {t.tournamentType?.toUpperCase()}
                </span>
              </div>
            </div>

            <Link
              href={`/tournaments/${t._id}`}
              className="text-sm font-semibold text-slate-700 hover:text-blue-700 inline-flex items-center gap-2"
            >
              <FiChevronLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>

        {top3.length > 0 && (
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {top3.map((r) => (
                <div
                  key={`${r.rank}-${getDisplayName(t.tournamentType, r)}`}
                  className={`rounded-2xl border p-4 ${
                    r.rank === 1
                      ? "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                      : r.rank === 2
                        ? "border-slate-200 bg-gradient-to-br from-slate-50 to-white"
                        : "border-orange-200 bg-gradient-to-br from-orange-50 to-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-800">Rank #{r.rank}</div>
                    <GiTrophy className={`w-5 h-5 ${r.rank === 1 ? "text-amber-600" : "text-slate-500"}`} />
                  </div>
                  <div className="mt-2 font-extrabold text-slate-900">{getDisplayName(t.tournamentType, r)}</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="text-slate-600">Kills</div>
                    <div className="font-bold text-slate-800">{safeNum(r.totalKills, 0)}</div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <div className="text-slate-600">Points</div>
                    <div className="font-extrabold text-blue-700">{safeNum(r.totalPoints, 0)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Table columns={columns} rows={rows} />
    </div>
  );
}