import { api } from "@/lib/api";
import WinnerCard from "@/components/winners/WinnerCard";
import { 
  GiCrown, 
  GiLaurelsTrophy, 
  GiTrophy, 
  GiSwordsPower, 
  GiMedal, 
  GiPodiumWinner,
  GiBattleGear,
  GiRank3
} from "react-icons/gi";
import { 
  FiTrendingUp, 
  FiCalendar, 
  FiStar, 
  FiUsers, 
  FiAward, 
  FiChevronRight,
  FiShield,
  FiDollarSign
} from "react-icons/fi";
import { 
  MdMilitaryTech, 
  MdOutlineWorkspacePremium, 
  MdVerified, 
  MdSecurity 
} from "react-icons/md";
import { 
  FaCrown, 
  FaRegGem, 
  FaMedal, 
  FaTrophy 
} from "react-icons/fa";
import { BsFillTrophyFill, BsPeopleFill } from "react-icons/bs";
import { IoRibbonSharp } from "react-icons/io5";

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
    <div className="w-full">
      <div className="">
        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          
          {/* ===== HERO SECTION - HALL OF CHAMPIONS ===== */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl border border-gray-700">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gray-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
                {/* Left Content */}
                <div className="flex-1">
                  {/* Title Section */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
                      <GiTrophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          RBM ESPORTS
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gray-600"></span>
                        <span className="text-xs font-medium text-gray-400">
                          Verified Champions
                        </span>
                      </div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                        Hall of <span className="text-blue-400">Champions</span>
                      </h1>
                      <p className="text-sm sm:text-base text-gray-400 mt-1 max-w-2xl">
                        Winners verified by admin & recorded permanently on the blockchain
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid - Professional Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5 sm:mt-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center">
                          <GiPodiumWinner className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{totalWinners}</div>
                          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Champions</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center">
                          <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                            ₹{totalPrizeDistributed.toLocaleString("en-IN")}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Prize Pool</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center">
                          <FaCrown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{featuredWinners.length}</div>
                          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Featured</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center">
                          <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{recentWinners.length}</div>
                          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Recent</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Badge - Elite Champion */}
                <div className="lg:w-auto flex justify-center lg:justify-end">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl p-4 sm:p-5 text-white text-center shadow-xl border border-blue-500/30 w-full lg:w-48">
                    <div className="text-3xl sm:text-4xl font-bold mb-2">🏆</div>
                    <div className="font-bold text-sm sm:text-base">ELITE CHAMPIONS</div>
                    <div className="text-xs sm:text-sm text-blue-200 mt-1">Top 1% Players</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <FiShield className="w-3 h-3 text-blue-300" />
                      <span className="text-[10px] sm:text-xs text-blue-200">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== FEATURED CHAMPIONS SECTION ===== */}
          <section className="space-y-5 sm:space-y-6 lg:space-y-7">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaCrown className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Featured Champions</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Admin curated elite winners • WinnerProfile.isFeatured</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 border border-blue-200 rounded-lg self-start sm:self-auto">
                <FiStar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-semibold text-blue-700">ELITE TIER</span>
                <span className="h-1 w-1 rounded-full bg-blue-400"></span>
                <span className="text-[10px] sm:text-xs text-blue-600">Top Ranked</span>
              </div>
            </div>

            {featuredWinners.length > 0 ? (
              <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {featuredWinners.map((winner, index) => (
                  <div key={winner._id} className="relative group">
                    {/* Rank Badge - Top 3 Only */}
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 z-20">
                        <div
                          className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center shadow-xl border-2 border-white ${
                            index === 0
                              ? "bg-gradient-to-br from-blue-600 to-blue-700"
                              : index === 1
                                ? "bg-gradient-to-br from-gray-600 to-gray-700"
                                : "bg-gradient-to-br from-amber-600 to-amber-700"
                          }`}
                        >
                          <span className="text-white font-bold text-xs sm:text-sm">#{index + 1}</span>
                        </div>
                      </div>
                    )}
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                    <div className="relative">
                      <WinnerCard w={winner} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 text-center">
                <div className="inline-flex p-3 sm:p-4 rounded-full bg-blue-50 mb-4">
                  <GiCrown className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Featured Champions Yet</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Featured champions appear when admin marks <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">WinnerProfile.isFeatured = true</span>
                </p>
              </div>
            )}
          </section>

          {/* ===== RECENT WINNERS SECTION ===== */}
          <section className="space-y-5 sm:space-y-6 lg:space-y-7">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FiTrendingUp className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Recent Winners</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Latest champions • Sorted by WinnerProfile.createdAt</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-200">
                <FiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Updated after admin verification</span>
              </div>
            </div>

            {recentWinners.length > 0 ? (
              <div className="space-y-5 sm:space-y-6 lg:space-y-7">
                {/* First Row */}
                <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {recentWinners.slice(0, 8).map((winner) => (
                    <div key={winner._id} className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                      <div className="relative">
                        <WinnerCard w={winner} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Second Row */}
                {recentWinners.length > 8 && (
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {recentWinners.slice(8, 16).map((winner) => (
                      <div key={winner._id} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                        <div className="relative">
                          <WinnerCard w={winner} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Third Row */}
                {recentWinners.length > 16 && (
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {recentWinners.slice(16, 24).map((winner) => (
                      <div key={winner._id} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                        <div className="relative">
                          <WinnerCard w={winner} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 text-center">
                <div className="inline-flex p-3 sm:p-4 rounded-full bg-gray-100 mb-4">
                  <BsFillTrophyFill className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Recent Winners</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Recent winners appear when admin declares winners and creates WinnerProfile records
                </p>
              </div>
            )}
          </section>

          {/* ===== INFO SECTION - CHAMPION RECOGNITION ===== */}
          <section className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              <div className="text-center p-3 sm:p-4">
                <div className="inline-flex p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 mb-3">
                  <GiLaurelsTrophy className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">Champion Recognition</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Winners stored as <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">WinnerProfile</span> with user & tournament data
                </p>
              </div>

              <div className="text-center p-3 sm:p-4">
                <div className="inline-flex p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 mb-3">
                  <MdOutlineWorkspacePremium className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">Featured Criteria</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Backend filters by <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">isFeatured</span> and sorts by <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">displayOrder</span>
                </p>
              </div>

              <div className="text-center p-3 sm:p-4">
                <div className="inline-flex p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 mb-3">
                  <FaRegGem className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1">Elite Benefits</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Featured champions highlighted across the platform
                </p>
              </div>
            </div>
          </section>

          {/* ===== FOOTER NOTE - JOIN THE ELITE ===== */}
          <section className="text-center space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-200">
              <MdMilitaryTech className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
              <span className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wider">
                CHAMPION LEGENDS
              </span>
              <MdVerified className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Join the <span className="text-blue-600">Elite</span>
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Every victory adds to your legacy. Win consistently to earn featured champion status and exclusive recognition.
            </p>

            <div className="pt-5 sm:pt-6 lg:pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FiShield className="w-3.5 h-3.5 text-blue-600" />
                  Admin verified winners
                </span>
                <span className="hidden sm:inline text-gray-300">•</span>
                <span className="flex items-center gap-1.5">
                  <MdSecurity className="w-3.5 h-3.5 text-gray-600" />
                  Permanently recorded
                </span>
                <span className="hidden sm:inline text-gray-300">•</span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-gray-600" />
                  Updated after each tournament
                </span>
              </div>
            </div>

            {/* Compliance Badge */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              <span className="text-[10px] sm:text-xs text-gray-500">
                RBM ESports • Verified Champion Program • Skill-based tournaments only
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}