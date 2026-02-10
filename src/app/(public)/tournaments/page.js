import { api } from "@/lib/api";
import TournamentCard from "@/components/tournaments/TournamentCard";

function groupByStatus(tournaments) {
  const live = tournaments.filter((t) => ["registration_open", "ongoing"].includes(t.status));
  const upcoming = tournaments.filter((t) => ["upcoming"].includes(t.status));
  const completed = tournaments.filter((t) => ["completed", "cancelled"].includes(t.status));
  const others = tournaments.filter((t) => !["registration_open", "ongoing", "upcoming", "completed", "cancelled"].includes(t.status));
  return { live, upcoming, completed, others };
}

export default async function TournamentsPage() {
  const res = await api.listTournaments("?limit=50&page=1");
  const tournaments = res.data || [];

  const { live, upcoming, completed, others } = groupByStatus(tournaments);

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Tournaments</h1>
        <p className="mt-1 text-sm text-slate-600">
          Browse upcoming, ongoing and past tournaments.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            Live: {live.length}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            Upcoming: {upcoming.length}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
            Past: {completed.length}
          </span>
        </div>
      </div>

      {live.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Live / Open</h2>
              <p className="text-sm text-slate-600">Registration open or currently running.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {live.map((t) => (
              <TournamentCard key={t._id} t={t} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Upcoming</h2>
            <p className="text-sm text-slate-600">Tournaments starting soon.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((t) => (
              <TournamentCard key={t._id} t={t} />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Past</h2>
            <p className="text-sm text-slate-600">Completed & cancelled tournaments.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {completed.map((t) => (
              <TournamentCard key={t._id} t={t} />
            ))}
          </div>
        </section>
      )}

      {live.length === 0 && upcoming.length === 0 && completed.length === 0 && others.length === 0 && (
        <div className="card p-10 text-center">
          <div className="text-slate-700 font-semibold">No tournaments found</div>
          <div className="text-sm text-slate-600 mt-2">Please check back later.</div>
        </div>
      )}

      {others.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Other</h2>
            <p className="text-sm text-slate-600">Draft/closed tournaments (admin-controlled states).</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((t) => (
              <TournamentCard key={t._id} t={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}