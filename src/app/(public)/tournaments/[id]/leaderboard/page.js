import { api } from "@/lib/api";
import Table from "@/components/ui/Table";
import Card from "@/components/ui/Card";
import { 
  GiRank3, 
  GiTrophy, 
  GiCrown, 
  GiMedal, 
  GiTargetPrize,
  GiSwordsPower
} from "react-icons/gi";
import { 
  FiUsers, 
  FiTarget, 
  FiChevronLeft, 
  FiAward, 
  FiStar,
  FiTrendingUp,
  FiShield
} from "react-icons/fi";
import { MdMilitaryTech, MdVerified } from "react-icons/md";
import Link from "next/link";

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function getDisplayName(tournamentType, r) {
  if (tournamentType === "squad") return r.teamName || "—";
  return r.inGameName || r.userId?.inGameName || r.userId?.name || "—";
}

// This is a Server Component - no "use client"
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

  // Define columns WITHOUT render functions - pass data only
  const columns = [
    {
      key: "rank",
      title: "#"
    },
    {
      key: "name", 
      title: t.tournamentType === "squad" ? "Team" : "Player"
    },
    {
      key: "totalKills",
      title: "Kills"
    },
    {
      key: "totalPoints",
      title: "Points"
    }
  ];

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">

          {/* ===== HERO SECTION ===== */}
          <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center"></div>
            </div>

            <div className="relative z-10 p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-6">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-xl flex-shrink-0">
                      <GiRank3 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          RBM ESPORTS
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gray-600"></span>
                        <span className="text-xs font-medium text-gray-400">
                          Live Rankings
                        </span>
                      </div>
                      <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white">
                        {t.title} — <span className="text-blue-400">Leaderboard</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
                        Transparent scoring: kills + placement points. Updated in real-time.
                      </p>
                    </div>
                  </div>

                  {/* Stats Badges */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gray-800/80 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-700">
                      <FiUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">{rows.length} entries</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gray-800/80 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-700">
                      <FiTarget className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300 uppercase">{t.tournamentType || "SOLO"}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gray-800/80 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-700">
                      <GiTrophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">Top 3 Prizes</span>
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <Link
                  href={`/tournaments/${t._id}`}
                  className="self-start lg:self-center inline-flex items-center gap-1.5 sm:gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border border-gray-700 transition-all hover:scale-105 text-xs sm:text-sm font-semibold"
                >
                  <FiChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Back to Tournament
                </Link>
              </div>
            </div>
          </section>

          {/* ===== TOP 3 PODIUM ===== */}
          {top3.length > 0 && (
            <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-md">
              <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <GiCrown className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
                </div>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Champions Podium</h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">Top 3</span>
              </div>

              <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-3">
                {top3.map((r) => (
                  <div
                    key={`${r.rank}-${getDisplayName(t.tournamentType, r)}`}
                    className={`
                      rounded-xl sm:rounded-2xl border-2 p-4 sm:p-5 transition-all hover:shadow-lg
                      ${r.rank === 1
                        ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
                        : r.rank === 2
                          ? "border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                          : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                      }
                    `}
                  >
                    {/* Rank Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold
                        ${r.rank === 1
                          ? "bg-blue-600 text-white"
                          : r.rank === 2
                            ? "bg-gray-700 text-white"
                            : "bg-amber-600 text-white"
                        }
                      `}>
                        {r.rank === 1 ? <GiCrown className="w-3.5 h-3.5" /> : 
                         r.rank === 2 ? <GiMedal className="w-3.5 h-3.5" /> : 
                         <GiMedal className="w-3.5 h-3.5" />}
                        Rank #{r.rank}
                      </div>
                      <GiTrophy className={`w-5 h-5 ${
                        r.rank === 1 ? "text-blue-600" : 
                        r.rank === 2 ? "text-gray-600" : 
                        "text-amber-600"
                      }`} />
                    </div>

                    {/* Player/Team Name */}
                    <div className="mb-4">
                      <div className="font-bold text-gray-900 text-base sm:text-lg truncate">
                        {getDisplayName(t.tournamentType, r)}
                      </div>
                      {t.tournamentType !== "squad" && (r.bgmiId || r.userId?.bgmiId) && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <GiTargetPrize className="w-3 h-3" />
                          ID: {r.bgmiId || r.userId?.bgmiId}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/80 rounded-lg p-2.5 text-center border border-gray-100">
                        <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Kills</div>
                        <div className="text-base sm:text-lg font-bold text-gray-800">
                          {safeNum(r.totalKills, 0)}
                        </div>
                      </div>
                      <div className="bg-white/80 rounded-lg p-2.5 text-center border border-gray-100">
                        <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Points</div>
                        <div className="text-base sm:text-lg font-bold text-blue-600">
                          {safeNum(r.totalPoints, 0)}
                        </div>
                      </div>
                    </div>

                    {/* Medal Badge */}
                    <div className="mt-3 text-center">
                      <span className={`
                        text-xs font-semibold px-2 py-1 rounded-full inline-block
                        ${r.rank === 1
                          ? "bg-blue-100 text-blue-700"
                          : r.rank === 2
                            ? "bg-gray-100 text-gray-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      `}>
                        {r.rank === 1 ? "🏆 CHAMPION" : 
                         r.rank === 2 ? "🥈 RUNNER-UP" : 
                         "🥉 THIRD PLACE"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== FULL LEADERBOARD TABLE ===== */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-md">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <FiTrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-700" />
                </div>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Full Rankings</h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                  {rows.length} Players
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                <FiShield className="w-3.5 h-3.5" />
                <span>Verified scores</span>
              </div>
            </div>

            {/* Table with data passed, not render functions */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.tournamentType === "squad" ? "Team" : "Player"}
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kills
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((r) => (
                    <tr key={`${r.rank}-${getDisplayName(t.tournamentType, r)}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          {r.rank <= 3 ? (
                            <span className={`
                              flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                              ${r.rank === 1 ? "bg-blue-600 text-white" : 
                                r.rank === 2 ? "bg-gray-600 text-white" : 
                                "bg-amber-600 text-white"}
                            `}>
                              {r.rank}
                            </span>
                          ) : (
                            <span className="text-gray-700 font-semibold">{r.rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="min-w-[180px] sm:min-w-[200px]">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">
                            {getDisplayName(t.tournamentType, r)}
                          </div>
                          {t.tournamentType !== "squad" && (r.bgmiId || r.userId?.bgmiId) && (
                            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <GiTargetPrize className="w-3 h-3" />
                              BGMI: {r.bgmiId || r.userId?.bgmiId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-800 text-sm sm:text-base">
                          {safeNum(r.totalKills, 0)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-blue-600 text-sm sm:text-base">
                          {safeNum(r.totalPoints, 0)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Note */}
            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MdMilitaryTech className="w-4 h-4 text-blue-600" />
                  <span>Scoring: {safeNum(t?.killPoints, 1)} point per kill + placement points</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <MdVerified className="w-3 h-3 text-blue-600" />
                  Updated in real-time
                </div>
              </div>
            </div>
          </section>

          {/* ===== LEGEND / INFO ===== */}
          <section className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <GiTargetPrize className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">Scoring System</div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Kills + Placement = Total Points</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <FiAward className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">Prize Distribution</div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Top 3 winners get prizes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                  <FiStar className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">Verification</div>
                  <p className="text-[10px] sm:text-xs text-gray-600">Admin verified scores</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}