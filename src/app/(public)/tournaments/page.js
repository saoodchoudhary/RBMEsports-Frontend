import { api } from "@/lib/api";
import TournamentCard from "@/components/tournaments/TournamentCard";

export default async function TournamentsPage() {
  const res = await api.listTournaments("?limit=50&page=1");
  const tournaments = res.data || [];

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h1 className="text-xl font-extrabold">Tournaments</h1>
        <p className="mt-1 text-sm text-slate-600">Browse upcoming, ongoing and past tournaments.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tournaments.map((t) => <TournamentCard key={t._id} t={t} />)}
      </div>
    </div>
  );
}