"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useSelector } from "react-redux";
import {
  GiTrophy,
  GiRank3,
  GiCrossedSwords,
  GiHelmet,
  GiMoneyStack,
  GiSwordsPower,
  GiBattleGear,
  GiTargeting,
  GiSkills,
  GiPodiumWinner,
  GiMedal,
  GiLaurelsTrophy
} from "react-icons/gi";
import {
  FiUser,
  FiMail,
  FiAward,
  FiCalendar,
  FiDollarSign,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiBarChart2,
  FiEdit,
  FiPlusCircle,
  FiEye,
  FiChevronRight
} from "react-icons/fi";
import { 
  MdVerified, 
  MdHistory, 
  MdSecurity, 
  MdMilitaryTech,
  MdOutlineWorkspacePremium 
} from "react-icons/md";
import { BsFillTrophyFill, BsPeopleFill } from "react-icons/bs";
import { FaGamepad, FaCrown, FaMedal } from "react-icons/fa";
import Button from "@/components/ui/Button";

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function isProfileComplete(u) {
  // Backend registration requires bgmiId + inGameName at least.
  // Add phone if your backend requires it for withdrawals etc.
  return Boolean(u?.bgmiId) && Boolean(u?.inGameName);
}

export default function MePage() {
  const user = useSelector((s) => s.auth.user);

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.me();
        if (!mounted) return;
        setMe(res.data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ backend-safe fallback keys (if backend returns slightly different name)
  const tournaments = useMemo(() => {
    return me?.tournaments || me?.history || me?.tournamentHistory || [];
  }, [me]);

  const stats = useMemo(() => {
    const totalTournaments = tournaments.length;

    // status values here are FRONTEND derived; keep safe
    const tournamentsWon = tournaments.filter((t) => String(t.status || "").toLowerCase() === "won").length;

    // prizeWon might come as number/string
    const totalPrize = tournaments.reduce((sum, t) => sum + safeNum(t.prizeWon, 0), 0);

    const ranks = tournaments
      .map((t) => safeNum(t.rank, 0))
      .filter((x) => x > 0);

    const avgPlacement =
      ranks.length > 0 ? Math.round(ranks.reduce((sum, r) => sum + r, 0) / ranks.length) : 0;

    const bestRank = ranks.length > 0 ? Math.min(...ranks) : null;

    return { totalTournaments, tournamentsWon, totalPrize, avgPlacement, bestRank };
  }, [tournaments]);

  const profileComplete = isProfileComplete(user);

  if (loading) {
    return (
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="space-y-6 sm:space-y-8">
            <div className="h-48 sm:h-56 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl animate-pulse"></div>
            <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 sm:h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <div className="">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          
          {/* ===== PROFILE HEADER - PROFESSIONAL ESPORTS ===== */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-2xl border border-gray-700">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start gap-5 sm:gap-6 lg:gap-8">
                
                {/* Avatar & Basic Info */}
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="relative">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg overflow-hidden border-2 border-gray-600">
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      )}
                    </div>

                    {profileComplete && (
                      <div className="absolute -bottom-2 -right-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center border-2 border-gray-800 shadow-lg">
                        <MdVerified className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                        {user?.name || "Player"}
                      </h1>

                      {user?.role === "admin" && (
                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold border border-blue-500">
                          ADMIN
                        </span>
                      )}

                      {user?.role === "super_admin" && (
                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-blue-700 to-blue-900 text-white text-xs font-bold border border-blue-600">
                          SUPER ADMIN
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">
                      <FiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{user?.email || "—"}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-300 bg-gray-800/50 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-gray-700">
                        <GiHelmet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                        <span className="font-medium">{user?.bgmiId || "BGMI ID not set"}</span>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-300 bg-gray-800/50 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-gray-700">
                        <FaGamepad className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                        <span className="font-medium">{user?.inGameName || "IGN not set"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:ml-auto flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-gray-600 text-white hover:bg-white/10 transition-all duration-300 px-4 sm:px-5 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
                    onClick={() => (window.location.href = "/profile/edit")}
                    type="button"
                  >
                    <FiEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    EDIT PROFILE
                  </Button>

                  {!profileComplete && (
                    <Button
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/30 transition-all duration-300 px-4 sm:px-5 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
                      onClick={() => (window.location.href = "/profile/edit")}
                      type="button"
                    >
                      <FiPlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      COMPLETE PROFILE
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ===== STATS GRID - PROFESSIONAL METRICS ===== */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-5 text-center hover:shadow-md transition-all hover:border-blue-300">
              <div className="inline-flex p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 mb-2 sm:mb-3">
                <FiAward className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.totalTournaments}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Tournaments</div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-5 text-center hover:shadow-md transition-all hover:border-blue-300">
              <div className="inline-flex p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 mb-2 sm:mb-3">
                <GiTrophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.tournamentsWon}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Wins</div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-5 text-center hover:shadow-md transition-all hover:border-blue-300">
              <div className="inline-flex p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 mb-2 sm:mb-3">
                <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">₹{stats.totalPrize.toLocaleString("en-IN")}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Earnings</div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-5 text-center hover:shadow-md transition-all hover:border-blue-300">
              <div className="inline-flex p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 mb-2 sm:mb-3">
                <GiRank3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.avgPlacement || "-"}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Avg Rank</div>
            </div>
          </section>

          {/* ===== DETAILS + HISTORY GRID ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            
            {/* Personal Information Card */}
            <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Personal Information</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Your account details</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Player ID & IGN Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 sm:mb-2">
                      Player ID
                    </label>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <GiHelmet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                        {user?.bgmiId || "Not set"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 sm:mb-2">
                      In-Game Name
                    </label>
                    <div className="flex items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <FaGamepad className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                        {user?.inGameName || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 sm:mb-2">
                    Role
                  </label>
                  <div
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold ${
                      user?.role === "admin" || user?.role === "super_admin"
                        ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200"
                    }`}
                  >
                    <FiShield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {(user?.role || "user").toUpperCase()}
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 sm:mb-2">
                    Account Status
                  </label>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div
                      className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium ${
                        profileComplete
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {profileComplete ? (
                        <>
                          <FiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Profile Complete</span>
                        </>
                      ) : (
                        <>
                          <FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Profile Incomplete</span>
                        </>
                      )}
                    </div>

                    {user?.isBanned && (
                      <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs sm:text-sm font-medium">
                        <MdSecurity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Account Banned</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Tournament History Card */}
            <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <MdHistory className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Tournament History</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Your competitive journey</p>
                </div>
              </div>

              {tournaments.length === 0 ? (
                <div className="text-center py-8 sm:py-10 lg:py-12 border-2 border-dashed border-gray-200 rounded-lg sm:rounded-xl bg-gray-50">
                  <div className="inline-flex p-3 sm:p-4 rounded-full bg-gray-100 mb-3 sm:mb-4">
                    <GiCrossedSwords className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-2">No Tournament History</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5 max-w-sm mx-auto px-4">
                    Join your first tournament and start building your legacy!
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm"
                    onClick={() => (window.location.href = "/tournaments")}
                    type="button"
                  >
                    BROWSE TOURNAMENTS
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                  {tournaments.map((tournament, index) => {
                    const status = String(tournament.status || "").toLowerCase();

                    const getStatusColor = () => {
                      switch (status) {
                        case "won":
                          return "from-blue-600 to-blue-700";
                        case "completed":
                          return "from-gray-700 to-gray-800";
                        case "playing":
                          return "from-blue-500 to-blue-600";
                        case "registered":
                          return "from-gray-500 to-gray-600";
                        default:
                          return "from-gray-400 to-gray-500";
                      }
                    };

                    const getStatusIcon = () => {
                      switch (status) {
                        case "won":
                          return <GiTrophy className="w-3.5 h-3.5" />;
                        case "completed":
                          return <FiAward className="w-3.5 h-3.5" />;
                        case "playing":
                          return <FiClock className="w-3.5 h-3.5" />;
                        default:
                          return <FiCalendar className="w-3.5 h-3.5" />;
                      }
                    };

                    const title = tournament.tournamentId?.title || tournament.title || "Tournament";
                    const prizeWon = safeNum(tournament.prizeWon, 0);

                    return (
                      <div
                        key={tournament._id || index}
                        className="group p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1">{title}</h3>

                              {prizeWon > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] sm:text-xs font-medium">
                                  <GiMoneyStack className="w-3 h-3" />
                                  ₹{prizeWon.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <GiRank3 className="w-3 h-3" />
                                <span>Rank: {tournament.rank || "-"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiTarget className="w-3 h-3" />
                                <span>Kills: {safeNum(tournament.kills, 0)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiBarChart2 className="w-3 h-3" />
                                <span>Points: {safeNum(tournament.points, 0)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0 self-start">
                            <div className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r ${getStatusColor()} text-white text-[10px] sm:text-xs font-semibold`}>
                              {getStatusIcon()}
                              <span>{status ? status.toUpperCase() : "—"}</span>
                            </div>
                          </div>
                        </div>

                        {tournament.notes && (
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 text-[10px] sm:text-xs text-gray-500">
                            {tournament.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* ===== PERFORMANCE INSIGHTS ===== */}
          {tournaments.length > 0 && (
            <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Performance Insights</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Your competitive analysis</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Win Rate */}
                <div className="p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 sm:mb-2">
                    Win Rate
                  </div>
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                    {stats.totalTournaments > 0
                      ? `${Math.round((stats.tournamentsWon / stats.totalTournaments) * 100)}%`
                      : "0%"}
                  </div>
                  <div className="mt-1.5 sm:mt-2 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                      style={{
                        width:
                          stats.totalTournaments > 0
                            ? `${(stats.tournamentsWon / stats.totalTournaments) * 100}%`
                            : "0%"
                      }}
                    ></div>
                  </div>
                </div>

                {/* Avg Prize */}
                <div className="p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 sm:mb-2">
                    Avg Prize
                  </div>
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                    ₹{stats.totalTournaments > 0 ? Math.round(stats.totalPrize / stats.totalTournaments).toLocaleString("en-IN") : "0"}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">per tournament</div>
                </div>

                {/* Tournament Activity */}
                <div className="p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 sm:mb-2">
                    Activity
                  </div>
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">{stats.totalTournaments}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">total entries</div>
                </div>

                {/* Best Rank */}
                <div className="p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 sm:mb-2">
                    Best Rank
                  </div>
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                    {stats.bestRank ? `#${stats.bestRank}` : "-"}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">highest placement</div>
                </div>
              </div>
            </section>
          )}

          {/* ===== QUICK ACTIONS ===== */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <GiSwordsPower className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Quick Actions</h2>
                <p className="text-xs sm:text-sm text-gray-600">Manage your account</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-semibold text-xs sm:text-sm py-3 sm:py-4 flex items-center justify-center gap-1.5 sm:gap-2 transition-all"
                onClick={() => (window.location.href = "/tournaments")}
                type="button"
              >
                <GiCrossedSwords className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>JOIN</span>
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-semibold text-xs sm:text-sm py-3 sm:py-4 flex items-center justify-center gap-1.5 sm:gap-2 transition-all"
                onClick={() => (window.location.href = "/wallet")}
                type="button"
              >
                <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>WALLET</span>
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-semibold text-xs sm:text-sm py-3 sm:py-4 flex items-center justify-center gap-1.5 sm:gap-2 transition-all"
                onClick={() => (window.location.href = "/profile/edit")}
                type="button"
              >
                <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>EDIT</span>
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-semibold text-xs sm:text-sm py-3 sm:py-4 flex items-center justify-center gap-1.5 sm:gap-2 transition-all"
                onClick={() => (window.location.href = "/winners")}
                type="button"
              >
                <BsFillTrophyFill className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>WINNERS</span>
              </Button>
            </div>
          </section>

          {/* ===== PROFILE FOOTER ===== */}
          <section className="text-center pt-2 sm:pt-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-1 rounded-full bg-blue-600"></div>
              <span className="text-[10px] sm:text-xs text-gray-500">
                RBM ESports • Player Profile • Last updated: {new Date().toLocaleDateString()}
              </span>
              <div className="h-1 w-1 rounded-full bg-blue-600"></div>
            </div>
          </section>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}