"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import TournamentCard from "@/components/tournaments/TournamentCard";
import WinnerCard from "@/components/winners/WinnerCard";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  GiTrophy,
  GiCrossedSwords,
  GiGamepad,
  GiPodiumWinner,
  GiRank3,
  GiHelmet,
  GiBattleGear,
  GiShield,
  GiAmmoBox,
  GiMachineGun,
  GiSkills,
  GiTargeting,
  GiDeadHead,
  GiYoutube,
  GiBroadcast,
  GiMicrophone,
  GiHeadphones,
  GiBinoculars,
  GiSwordsPower
} from "react-icons/gi";
import {
  FiCalendar,
  FiChevronRight,
  FiCheckCircle,
  FiDollarSign,
  FiClock,
  FiAward,
  FiTarget,
  FiUsers,
  FiShield as FiShieldIcon,
  FiEye,
  FiTrendingUp,
  FiPlayCircle,
  FiRadio,
  FiCamera
} from "react-icons/fi";
import { BsPeopleFill, BsYoutube, BsTwitch, BsDiscord, BsBroadcast } from "react-icons/bs";
import { FaCrown, FaYoutube, FaPlay, FaLive } from "react-icons/fa";
import { TbTargetArrow, TbDeviceGamepad2 } from "react-icons/tb";
import { MdMilitaryTech, MdSecurity, MdLiveTv, MdStream } from "react-icons/md";
import { SiYoutubegaming } from "react-icons/si";
import Image from "next/image";

function safeNum(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");

  const [data, setData] = useState({
    tournaments: [],
    winners: [],
    featuredTournaments: []
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [tournamentsRes, winnersRes, featuredRes] = await Promise.all([
          api.listTournaments("?limit=12&page=1"),
          api.winnersRecent(8),
          api.listTournaments("?featured=true&limit=3")
        ]);

        setData({
          tournaments: tournamentsRes.data || [],
          winners: winnersRes.data || [],
          featuredTournaments: featuredRes.data || []
        });
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const ongoing = useMemo(() => {
    return (data.tournaments || []).filter((t) =>
      ["registration_open", "ongoing"].includes(t.status)
    );
  }, [data.tournaments]);

  const upcoming = useMemo(() => {
    return (data.tournaments || []).filter((t) => t.status === "upcoming");
  }, [data.tournaments]);

  const computedStats = useMemo(() => {
    const tournaments = data.tournaments || [];
    const totalTournaments = tournaments.length;
    const totalPrize = tournaments.reduce((sum, t) => sum + safeNum(t.prizePool), 0);
    const totalPlayers = tournaments.reduce((sum, t) => sum + safeNum(t.currentParticipants), 0);
    return { totalTournaments, totalPrize, totalPlayers };
  }, [data.tournaments]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          <div className="h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl animate-pulse"></div>
          <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className=" ">
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          
          {/* ===== HERO SECTION - CLASSIC PROFESSIONAL DESIGN ===== */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                
                {/* Left Content */}
                <div className="flex-1 w-full">
                  {/* YouTube Live Badge */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5 lg:mb-6">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
                      <FaYoutube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">LIVE ON YOUTUBE</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-blue-600/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-500/30">
                      <BsBroadcast className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                      <span className="text-xs font-bold text-blue-300">BGMI PRO LEAGUE</span>
                    </div>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-3 sm:mb-4 lg:mb-5">
                    <span className="text-white">WELCOME TO</span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                      RBM ESPORTS
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed mb-5 sm:mb-6 lg:mb-7 max-w-xl">
                    India's #1 BGMI Tournament Platform. Compete with elite players, 
                    win massive prizes, and get featured live on our official YouTube channel.
                  </p>

                  {/* Live Stream Card */}
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-700 shadow-xl mb-6 sm:mb-7 lg:mb-8 max-w-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                            <SiYoutubegaming className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500 rounded-full animate-pulse border-2 border-gray-800"></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-xs sm:text-sm">RBM ESPORTS LIVE</span>
                            <span className="bg-red-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
                          </div>
                          <p className="text-xs text-gray-400">Weekend Championship • Finals</p>
                        </div>
                      </div>
                      <a
                        href="https://youtube.com/@rbmesports"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:ml-auto w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                      >
                        <FaPlay className="w-3 h-3" />
                        WATCH LIVE
                      </a>
                    </div>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-700">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiEye className="w-3 h-3" /> 3.2K watching
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <GiMicrophone className="w-3 h-3" /> Hindi/English
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-7 lg:mb-8">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/50">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center">
                          <GiTrophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{computedStats.totalTournaments}+</div>
                          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Events</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/50">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center">
                          <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                        </div>
                        <div>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">₹{(computedStats.totalPrize / 100000).toFixed(1)}L+</div>
                          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Prize Pool</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/50 col-span-2 sm:col-span-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center">
                          <BsPeopleFill className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{computedStats.totalPlayers}+</div>
                          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Players</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all duration-300 px-5 sm:px-6 lg:px-7 py-3 sm:py-3.5 font-bold text-sm sm:text-base flex items-center justify-center gap-2"
                      onClick={() => router.push("/tournaments")}
                    >
                      <GiMachineGun className="w-4 h-4 sm:w-5 sm:h-5" />
                      JOIN TOURNAMENT
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-2 border-gray-600 text-white hover:bg-white/10 transition-all duration-300 px-5 sm:px-6 lg:px-7 py-3 sm:py-3.5 font-bold text-sm sm:text-base flex items-center justify-center gap-2"
                      onClick={() => router.push("/winners")}
                    >
                      <GiPodiumWinner className="w-4 h-4 sm:w-5 sm:h-5" />
                      VIEW WINNERS
                    </Button>
                  </div>
                </div>

                {/* Right Image */}
                <div className="flex-1 relative flex justify-center lg:justify-end mt-6 lg:mt-0">
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-full blur-3xl"></div>
                    <div className="relative h-full w-full">
                      <div className="absolute inset-0 rounded-xl lg:rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl">
                        <Image
                          src="/images/bgmi-men.png"
                          alt="BGMI Pro Player"
                          fill
                          className="object-cover object-center scale-110 hover:scale-105 transition-transform duration-700"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                      </div>
                      <div className="absolute -bottom-4 -left-4 bg-gray-900/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-2xl border border-red-600/30">
                        <div className="flex items-center gap-2">
                          <FaYoutube className="w-4 h-4 text-red-600" />
                          <div>
                            <div className="text-white text-xs font-bold">LIVE NOW</div>
                            <p className="text-[10px] text-gray-400">2.5K watching</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== LIVE NOW BANNER - YOUTUBE STREAM ===== */}
          <section className="relative -mt-4 sm:-mt-6 lg:-mt-8 z-20">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-blue-500/30 shadow-xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg flex-shrink-0">
                    <SiYoutubegaming className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-white font-bold text-sm sm:text-base">RBM ESPORTS OFFICIAL STREAM</h3>
                      <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                      🎮 Weekend Championship Finals • Prize Pool ₹2,50,000 • 16 Teams
                    </p>
                  </div>
                </div>
                <a
                  href="https://youtube.com/@rbmesports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <FaPlay className="w-3 h-3" />
                  WATCH LIVE STREAM
                </a>
              </div>
            </div>
          </section>

          {/* ===== TOURNAMENT TABS SECTION ===== */}
          <section className="space-y-6 sm:space-y-7 lg:space-y-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
                  <GiCrossedSwords className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">BATTLE ARENA</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Active tournaments & upcoming battles</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 w-full sm:w-auto flex items-center justify-center gap-1.5"
                onClick={() => router.push("/tournaments")}
              >
                VIEW ALL
                <FiChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-2 sm:space-x-4">
                <button
                  onClick={() => setActiveTab("live")}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all relative
                    ${activeTab === "live"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                  type="button"
                >
                  <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${activeTab === "live" ? "bg-blue-600 animate-pulse" : "bg-gray-400"}`}></div>
                  LIVE
                  {ongoing.length > 0 && (
                    <span className="ml-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                      {ongoing.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all
                    ${activeTab === "upcoming"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                  type="button"
                >
                  <FiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  UPCOMING
                </button>
                <button
                  onClick={() => setActiveTab("featured")}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all
                    ${activeTab === "featured"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                  type="button"
                >
                  <FaCrown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  FEATURED
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "live" && (
                ongoing.length > 0 ? (
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {ongoing.slice(0, 6).map((tournament) => (
                      <TournamentCard key={tournament._id} t={tournament} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 text-center border border-gray-200">
                    <div className="inline-flex p-4 sm:p-5 rounded-full bg-blue-50 mb-4">
                      <GiGamepad className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">NO LIVE BATTLES</h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto mb-5">
                      New tournaments launching soon. Check back later!
                    </p>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 text-sm"
                      onClick={() => router.push("/tournaments")}
                    >
                      VIEW ALL TOURNAMENTS
                    </Button>
                  </div>
                )
              )}

              {activeTab === "upcoming" && (
                upcoming.length > 0 ? (
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {upcoming.slice(0, 6).map((tournament) => (
                      <TournamentCard key={tournament._id} t={tournament} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 text-center border border-gray-200">
                    <div className="inline-flex p-4 sm:p-5 rounded-full bg-gray-100 mb-4">
                      <FiCalendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">NO UPCOMING BATTLES</h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto mb-5">
                      Stay tuned for new tournament announcements!
                    </p>
                    <Button
                      className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 text-sm"
                      onClick={() => router.push("/tournaments")}
                    >
                      CHECK TOURNAMENTS
                    </Button>
                  </div>
                )
              )}

              {activeTab === "featured" && (
                data.featuredTournaments.length > 0 ? (
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {data.featuredTournaments.slice(0, 6).map((tournament) => (
                      <TournamentCard key={tournament._id} t={tournament} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 text-center border border-gray-200">
                    <div className="inline-flex p-4 sm:p-5 rounded-full bg-gray-100 mb-4">
                      <FaCrown className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">NO FEATURED BATTLES</h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto mb-5">
                      Premium tournaments with exclusive rewards coming soon!
                    </p>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 text-sm"
                      onClick={() => router.push("/tournaments")}
                    >
                      EXPLORE TOURNAMENTS
                    </Button>
                  </div>
                )
              )}
            </div>

            {/* View More Link */}
            <div className="text-center pt-2">
              <a
                href="/tournaments"
                className="inline-flex items-center gap-1.5 text-gray-700 hover:text-blue-600 font-semibold text-xs sm:text-sm transition-colors group"
              >
                BROWSE ALL TOURNAMENTS
                <FiChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </section>

          {/* ===== YOUTUBE STREAM SCHEDULE ===== */}
          <section className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full mb-4">
                  <FaYoutube className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-xs font-bold text-red-700 uppercase">YouTube Exclusive</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  WATCH TOURNAMENTS
                  <br />
                  <span className="text-blue-600">LIVE ON YOUTUBE</span>
                </h2>
                <p className="text-sm text-gray-600 mb-5 max-w-lg mx-auto lg:mx-0">
                  Every tournament is streamed live on our official YouTube channel. 
                  Watch pro players, learn strategies, and catch all the action.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5 max-w-lg mx-auto lg:mx-0">
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-100">
                    <div className="text-[10px] text-gray-500">Today</div>
                    <div className="text-xs font-bold text-gray-900">6:00 PM</div>
                    <div className="text-[10px] text-blue-600 font-medium">Weekend War</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-100">
                    <div className="text-[10px] text-gray-500">Tomorrow</div>
                    <div className="text-xs font-bold text-gray-900">6:00 PM</div>
                    <div className="text-[10px] text-blue-600 font-medium">Pro Scrims</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-100">
                    <div className="text-[10px] text-gray-500">Sat</div>
                    <div className="text-xs font-bold text-gray-900">4:00 PM</div>
                    <div className="text-[10px] text-blue-600 font-medium">Finals</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-100">
                    <div className="text-[10px] text-gray-500">Sun</div>
                    <div className="text-xs font-bold text-gray-900">4:00 PM</div>
                    <div className="text-[10px] text-blue-600 font-medium">Grand Finals</div>
                  </div>
                </div>
                <a
                  href="https://youtube.com/@rbmesports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all hover:scale-105 shadow-lg shadow-red-600/30"
                >
                  <SiYoutubegaming className="w-4 h-4" />
                  SUBSCRIBE TO YOUTUBE
                  <FiChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="flex-1">
                <div className="relative h-40 sm:h-44 lg:h-48 w-full max-w-xs mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-blue-600/5 rounded-2xl"></div>
                  <div className="relative h-full w-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mx-auto mb-3 shadow-xl">
                        <FaYoutube className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">@rbmesports</h3>
                      <p className="text-xs text-gray-600 mt-0.5">50K+ Subscribers</p>
                      <div className="flex items-center justify-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <FiEye className="w-3 h-3" /> 2.5M+ Views
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <GiMicrophone className="w-3 h-3" /> Live Daily
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== FEATURES SECTION ===== */}
          <section className="space-y-6 sm:space-y-7 lg:space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full mb-3">
                <GiShield className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Elite Features</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                BATTLE-READY <span className="text-blue-600">ADVANTAGE</span>
              </h2>
              <p className="text-sm text-gray-600">
                Everything you need to compete at the highest level
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                    <GiShield className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">PRO SECURITY</h3>
                    <p className="text-xs text-gray-600">Advanced anti-cheat & fair play</p>
                  </div>
                </div>
                <div className="space-y-1.5 pl-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Real-time cheat detection</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Match verification system</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>AI anti-cheat monitoring</span>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center flex-shrink-0">
                    <TbTargetArrow className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">PRECISION ANALYTICS</h3>
                    <p className="text-xs text-gray-600">Detailed match stats</p>
                  </div>
                </div>
                <div className="space-y-1.5 pl-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>K/D ratio tracking</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Headshot percentage</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Survival time analysis</span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center flex-shrink-0">
                    <GiAmmoBox className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">INSTANT REWARDS</h3>
                    <p className="text-xs text-gray-600">Fast prize distribution</p>
                  </div>
                </div>
                <div className="space-y-1.5 pl-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>Automated payouts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>UPI & Wallet transfer</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <FiCheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>24/7 support team</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== WINNERS SECTION ===== */}
          <section className="space-y-6 sm:space-y-7 lg:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg flex-shrink-0">
                  <GiPodiumWinner className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">ELITE CHAMPIONS</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Legends who dominated the arena</p>
                </div>
              </div>
              <a
                href="/winners"
                className="inline-flex items-center gap-1.5 text-gray-700 hover:text-blue-600 font-semibold text-xs sm:text-sm transition-colors group"
              >
                VIEW ALL WINNERS
                <FiChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {(data.winners || []).length > 0 ? (
                (data.winners || []).slice(0, 4).map((winner, index) => (
                  <WinnerCard key={winner._id} w={winner} rank={index + 1} />
                ))
              ) : (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mx-auto mb-3"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded mx-auto mb-2"></div>
                      <div className="h-3 w-16 bg-gray-100 rounded mx-auto"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>

          {/* ===== COMMUNITY SECTION ===== */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full mb-4">
                  <BsDiscord className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Join Community</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
                  CONNECT WITH
                  <br />
                  <span className="text-blue-200">10,000+ PLAYERS</span>
                </h2>
                <p className="text-sm text-white/90 mb-5 max-w-lg mx-auto lg:mx-0">
                  Join our Discord server for tournament updates, scrims, and exclusive community events.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <a
                    href="https://discord.gg/rbmesports"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-blue-700 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                  >
                    <BsDiscord className="w-4 h-4" />
                    JOIN DISCORD
                  </a>
                  <a
                    href="https://youtube.com/@rbmesports"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                  >
                    <FaYoutube className="w-4 h-4" />
                    SUBSCRIBE
                  </a>
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/20">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">15K+</div>
                    <div className="text-[10px] sm:text-xs text-blue-100">Discord Members</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/20">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">50K+</div>
                    <div className="text-[10px] sm:text-xs text-blue-100">YouTube Subs</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/20">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">2.5M+</div>
                    <div className="text-[10px] sm:text-xs text-blue-100">Total Views</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/20">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">500+</div>
                    <div className="text-[10px] sm:text-xs text-blue-100">Tournaments</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== FINAL CTA ===== */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl shadow-2xl">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
            </div>

            <div className="relative z-10 px-5 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                <GiBattleGear className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-bold text-blue-300 tracking-wide">BATTLE READY</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-white">
                READY FOR YOUR NEXT
                <br />
                <span className="text-blue-400">VICTORY?</span>
              </h2>

              <p className="text-sm text-gray-300 mb-5 max-w-2xl mx-auto px-4">
                Join thousands of elite players on India's most competitive BGMI platform. 
                Prove your skills, claim your rewards, and become legendary.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6 sm:mb-7 lg:mb-8">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all duration-300 px-6 py-3 font-bold text-sm sm:text-base"
                  onClick={() => router.push("/register")}
                >
                  ENLIST NOW
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-gray-600 text-white hover:bg-white/10 transition-all duration-300 px-6 py-3 font-bold text-sm sm:text-base"
                  onClick={() => router.push("/tournaments")}
                >
                  <GiCrossedSwords className="w-4 h-4 mr-2" />
                  BROWSE BATTLES
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5 border-t border-gray-700 max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center mb-1 border border-blue-500/30">
                    <GiHelmet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-300">2,500+</span>
                  <span className="text-[10px] text-gray-400">Pro Players</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center mb-1 border border-gray-600">
                    <FiAward className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-300">₹50L+</span>
                  <span className="text-[10px] text-gray-400">Prize Given</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center mb-1 border border-blue-500/30">
                    <FiTarget className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-300">1,200+</span>
                  <span className="text-[10px] text-gray-400">Matches</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center mb-1 border border-gray-600">
                    <GiRank3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-300">#1</span>
                  <span className="text-[10px] text-gray-400">BGMI Platform</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}