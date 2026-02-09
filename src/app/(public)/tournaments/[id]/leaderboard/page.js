import { api } from "@/lib/api";
import Table from "@/components/ui/Table";
import React from "react";

export default async function LeaderboardPage({ params }) {
    
      const { id } = React.use(params);
  const [tRes, lbRes] = await Promise.all([
    api.getTournament(id),
    api.leaderboard(id)
  ]);

  const t = tRes.data;
  const rows = lbRes.data || [];

  const columns = [
    { key: "rank", title: "#" },
    { key: "name", title: t.tournamentType === "squad" ? "Team" : "Player",
      render: (r) => r.teamName || r.inGameName || r.userId?.inGameName || "—"
    },
    { key: "totalKills", title: "Kills", render: (r) => r.totalKills ?? "—" },
    { key: "totalPoints", title: "Points", render: (r) => r.totalPoints ?? "—" }
  ];

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h1 className="text-xl font-extrabold">{t.title} — Leaderboard</h1>
        <p className="mt-1 text-sm text-slate-600">Transparent scoring: kills + placement points.</p>
      </div>

      <Table columns={columns} rows={rows.map((r, i) => ({ ...r, rank: r.rank || (i + 1) }))} />
    </div>
  );
}