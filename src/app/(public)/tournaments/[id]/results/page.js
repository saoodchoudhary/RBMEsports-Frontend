import { api } from "@/lib/api";
import Card from "@/components/ui/Card";
import { FiChevronLeft, FiBarChart2, FiAward, FiUsers, FiTarget, FiShield } from "react-icons/fi";
import { GiTrophy, GiRank3, GiSkull, GiBulletImpact, GiSwordsPower, GiBattleGear, GiBulletImpacts, GiSkills } from "react-icons/gi";
import { MdOutlineEmojiEvents, MdMilitaryTech } from "react-icons/md";
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
    <div className="w-full">
      <div className="">
        <div className="space-y-5 sm:space-y-6 lg:space-y-8">

          {/* ===== HERO SECTION ===== */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-700">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>

            <div className="relative z-10 p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left Content */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-xl flex-shrink-0">
                    <FiBarChart2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                        RBM ESPORTS
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-600"></span>
                      <span className="text-xs font-medium text-gray-400">
                        Match Results
                      </span>
                    </div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white">
                      {t.title} — <span className="text-blue-400">Results</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
                      Per match breakdown uploaded by admin
                    </p>
                  </div>
                </div>

                {/* Back Button */}
                <Link
                  href={`/tournaments/${t._id}`}
                  className="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 border border-gray-700 hover:border-gray-600 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold self-start sm:self-auto"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Back to Tournament
                </Link>
              </div>

              {/* Stats Badge */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700">
                  <GiTrophy className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-300">
                    <span className="font-semibold text-white">{results.length}</span> Matches
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700">
                  <FiUsers className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-300">
                    <span className="font-semibold text-white">
                      {t.tournamentType === "squad" ? "Team" : "Player"} Results
                    </span>
                  </span>
                </div>
                {results.length > 0 && (
                  <div className="flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-500/30">
                    <GiSwordsPower className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-blue-300">Admin Verified</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ===== RESULTS CONTENT ===== */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-md">
            {results.length === 0 ? (
              <div className="py-12 sm:py-16 text-center">
                <div className="inline-flex p-4 sm:p-5 rounded-full bg-gray-100 mb-4">
                  <FiBarChart2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">No Match Results Yet</h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  Results will appear here once admin uploads them after match completion.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <FiShield className="w-3.5 h-3.5 text-gray-600" />
                  <span>Admin verification pending</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {/* Summary Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Showing <span className="font-bold text-gray-900">{results.length}</span> matches
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MdMilitaryTech className="w-3.5 h-3.5" />
                    <span>Sorted by match number</span>
                  </div>
                </div>

                {/* Match Cards */}
                <div className="space-y-4 sm:space-y-5">
                  {results.map((m) => (
                    <div
                      key={m._id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Match Header */}
                      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                              <GiRank3 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                                Match #{m.matchNumber}
                                <span className="text-xs sm:text-sm font-normal text-gray-500 ml-2">
                                  (Day {m.matchDay})
                                </span>
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-600">{m.map}</span>
                                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                <span className="text-xs text-gray-600">{m.matchType}</span>
                                {m.matchType === "final" && (
                                  <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                                    Finals
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Match Stats Summary */}
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                              <GiSkills className="w-3.5 h-3.5 text-gray-600" />
                              <span className="font-medium text-gray-700">
                                {(m.results || []).reduce((sum, r) => sum + safeNum(r.kills, 0), 0)} Kills
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                              <GiBulletImpacts className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-medium text-blue-700">
                                {(m.results || []).length} Players
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Results Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-[900px] w-full text-xs sm:text-sm">
                          <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                {t.tournamentType === "squad" ? "Team Name" : "Player Name"}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Placement</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Kills</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Placement Pts</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Kill Pts</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-blue-600 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>

                          <tbody className="bg-white divide-y divide-gray-100">
                            {(m.results || [])
                              .sort((a, b) => safeNum(b.totalPoints, 0) - safeNum(a.totalPoints, 0))
                              .map((r, idx) => {
                                const placement = safeNum(r.placement, 0);
                                const kills = safeNum(r.kills, 0);
                                const placementPoints = safeNum(r.placementPoints, 0);
                                const killPoints = safeNum(r.killPoints, 0);
                                const totalPoints = safeNum(r.totalPoints, 0);

                                return (
                                  <tr
                                    key={idx}
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="px-4 py-3 font-medium">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`
                                          ${idx === 0 ? 'text-blue-600 font-bold' : ''}
                                          ${idx === 1 ? 'text-gray-600 font-semibold' : ''}
                                          ${idx === 2 ? 'text-amber-600 font-semibold' : ''}
                                        `}>
                                          #{idx + 1}
                                        </span>
                                        {idx === 0 && <GiTrophy className="w-3.5 h-3.5 text-blue-600" />}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-gray-900">
                                      {getRowName(r)}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`
                                        px-2 py-1 rounded-md text-xs font-medium
                                        ${placement === 1 ? 'bg-blue-100 text-blue-700' : ''}
                                        ${placement === 2 ? 'bg-gray-100 text-gray-700' : ''}
                                        ${placement === 3 ? 'bg-amber-100 text-amber-700' : ''}
                                        ${placement > 3 ? 'bg-gray-50 text-gray-600' : ''}
                                      `}>
                                        #{placement}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{kills}</td>
                                    <td className="px-4 py-3 text-gray-600">{placementPoints}</td>
                                    <td className="px-4 py-3 text-gray-600">{killPoints}</td>
                                    <td className="px-4 py-3 font-bold text-blue-600">{totalPoints}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>

                      {/* Match Footer */}
                      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FiTarget className="w-3.5 h-3.5" />
                          <span>Results verified by admin</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Total Points: {safeNum(m.totalMatchPoints, 0) || '—'}</span>
                          {m.wwcd && (
                            <span className="text-green-600 font-medium ml-2">🏆 WWCD</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ===== INFO FOOTER ===== */}
          {results.length > 0 && (
            <section className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <FiShield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Admin Verified Results</h4>
                    <p className="text-[10px] sm:text-xs text-gray-600">
                      All match results are verified by tournament admin. Final and binding.
                    </p>
                  </div>
                </div>
                <Link
                  href={`/tournaments/${t._id}/leaderboard`}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  View Full Leaderboard
                  <FiChevronLeft className="w-3 h-3 rotate-180" />
                </Link>
              </div>
            </section>
          )}

          {/* ===== COMPLIANCE BADGE ===== */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
            <span className="text-[10px] sm:text-xs text-gray-500">
              RBM ESports • Tournament Results • Skill-based competition
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
          </div>

        </div>
      </div>
    </div>
  );
}