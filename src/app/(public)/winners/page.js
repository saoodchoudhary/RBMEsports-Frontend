import { api } from "@/lib/api";
import WinnerCard from "@/components/winners/WinnerCard";
import { GiCrown, GiLaurelsTrophy } from "react-icons/gi";
import { FiTrendingUp, FiCalendar, FiStar } from "react-icons/fi";
import { MdMilitaryTech, MdOutlineWorkspacePremium } from "react-icons/md";
import { FaCrown, FaRegGem } from "react-icons/fa";
import { BsFillTrophyFill } from "react-icons/bs";

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function uniqueById(list) {
  const map = new Map();
  for (const w of list || []) {
    if (!w?._id) continue;
    map.set(String(w._id), w);
  }
  return Array.from(map.values());
}

function sumPrize(list) {
  return (list || []).reduce((sum, w) => sum + safeNum(w?.prizeAmount, 0), 0);
}

export default async function WinnersPage() {
  const [featured, recent] = await Promise.all([
    api.winnersFeatured(),
    api.winnersRecent(24),
  ]);

  const featuredWinners = featured.data || [];
  const recentWinners = recent.data || [];

  // ✅ Avoid double count: if a WinnerProfile is featured, it may also appear in recent
  const allUnique = uniqueById([...featuredWinners, ...recentWinners]);

  const totalWinners = allUnique.length;
  const totalPrizeDistributed = sumPrize(allUnique);

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-100 p-8 shadow-lg">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <GiCrown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Hall of Champions</h1>
                  <p className="text-slate-700 mt-1">Winners verified by admin & recorded permanently</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-100">
                  <div className="text-2xl font-bold text-amber-700">{totalWinners}</div>
                  <div className="text-sm text-slate-600 font-medium">Total Champions</div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-100">
                  <div className="text-2xl font-bold text-emerald-700">
                    ₹{totalPrizeDistributed.toLocaleString("en-IN")}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Prize Distributed</div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-100">
                  <div className="text-2xl font-bold text-blue-700">{featuredWinners.length}</div>
                  <div className="text-sm text-slate-600 font-medium">Featured</div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-amber-100">
                  <div className="text-2xl font-bold text-purple-700">{recentWinners.length}</div>
                  <div className="text-sm text-slate-600 font-medium">Recent</div>
                </div>
              </div>
            </div>

            <div className="md:w-auto">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white text-center shadow-lg">
                <div className="text-4xl font-bold mb-2">🏆</div>
                <div className="font-semibold">Elite Players</div>
                <div className="text-sm opacity-90">Rank • Prize • Tournament</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-r from-amber-200 to-orange-200 opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-r from-yellow-200 to-amber-200 opacity-30"></div>
      </section>

      {/* Featured Champions */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <FaCrown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Champions</h2>
              <p className="text-slate-600">Admin curated winners (WinnerProfile.isFeatured)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
            <FiStar className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Elite Tier</span>
          </div>
        </div>

        {featuredWinners.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredWinners.map((winner, index) => (
              <div key={winner._id} className="relative group">
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shadow-lg ${
                        index === 0
                          ? "bg-gradient-to-br from-amber-500 to-yellow-500"
                          : index === 1
                            ? "bg-gradient-to-br from-gray-400 to-gray-600"
                            : "bg-gradient-to-br from-amber-700 to-orange-700"
                      }`}
                    >
                      <span className="text-white font-bold text-sm">#{index + 1}</span>
                    </div>
                  </div>
                )}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative">
                  <WinnerCard w={winner} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-dashed border-amber-200 rounded-2xl p-12 text-center">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 mb-4">
              <GiCrown className="w-12 h-12 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Featured Champions Yet</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Featured champions appear when admin marks WinnerProfile.isFeatured.
            </p>
          </div>
        )}
      </section>

      {/* Recent Winners */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recent Winners</h2>
              <p className="text-slate-600">Sorted by WinnerProfile.createdAt</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FiCalendar className="w-4 h-4" />
            <span>Updated after admin verification</span>
          </div>
        </div>

        {recentWinners.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentWinners.slice(0, 8).map((winner) => (
                <div key={winner._id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative">
                    <WinnerCard w={winner} />
                  </div>
                </div>
              ))}
            </div>

            {recentWinners.length > 8 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recentWinners.slice(8, 16).map((winner) => (
                  <div key={winner._id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative">
                      <WinnerCard w={winner} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {recentWinners.length > 16 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recentWinners.slice(16, 24).map((winner) => (
                  <div key={winner._id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative">
                      <WinnerCard w={winner} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-dashed border-blue-200 rounded-2xl p-12 text-center">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 mb-4">
              <BsFillTrophyFill className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Recent Winners</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Recent winners appear when admin declares winners (WinnerProfile created).
            </p>
          </div>
        )}
      </section>

      {/* Info */}
      <section className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 mb-3">
              <GiLaurelsTrophy className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Champion Recognition</h3>
            <p className="text-sm text-slate-600">Winners are stored as WinnerProfile and populated with user & tournament.</p>
          </div>

          <div className="text-center p-4">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-3">
              <MdOutlineWorkspacePremium className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Featured Criteria</h3>
            <p className="text-sm text-slate-600">Backend filters featured by isFeatured and sorts by displayOrder.</p>
          </div>

          <div className="text-center p-4">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 mb-3">
              <FaRegGem className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Elite Benefits</h3>
            <p className="text-sm text-slate-600">Featured champions can be highlighted across the platform.</p>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 px-4 py-2">
          <MdMilitaryTech className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">CHAMPION LEGENDS</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900">Join the Elite</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Every victory adds to your legacy. Win consistently to earn featured champion status.
        </p>

        <div className="pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Profiles are updated after admin verification. All winners are permanently recorded.
          </div>
        </div>
      </section>
    </div>
  );
}