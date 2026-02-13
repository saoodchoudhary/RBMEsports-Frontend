import { api } from "@/lib/api";
import { FiArrowRight } from "react-icons/fi";
import JoinClient from "./ui/JoinClient";
import {
  GiTrophy,
  GiRank3,
  GiTargetPrize,
  GiCalendar,
  GiClockwork,
  GiPerson,
  GiTeamIdea,
  GiBurningForest,
  GiDesert,
  GiJungle,
  GiSnowflake1,
  GiIsland,
  GiCaveEntrance,
  GiModernCity,
  GiEyeTarget,
  GiMoneyStack,
  GiSwordsPower,
  GiShield,
  GiBattleGear,
  GiHelmet,
  GiSkull,
  GiBulletImpact,
  GiMachineGun
} from "react-icons/gi";
import {
  FiUsers,
  FiAward,
  FiShield as FiShieldIcon,
  FiBarChart2,
  FiVideo,
  FiDollarSign,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiCalendar as FiCalendarIcon,
  FiClock as FiClockIcon
} from "react-icons/fi";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdOutlineEmojiEvents, MdSecurity, MdVerified } from "react-icons/md";
import React from "react";

const mapIcons = {
  Erangel: <GiBurningForest className="w-5 h-5 sm:w-6 sm:h-6" />,
  Miramar: <GiDesert className="w-5 h-5 sm:w-6 sm:h-6" />,
  Sanhok: <GiJungle className="w-5 h-5 sm:w-6 sm:h-6" />,
  Vikendi: <GiSnowflake1 className="w-5 h-5 sm:w-6 sm:h-6" />,
  Livik: <GiIsland className="w-5 h-5 sm:w-6 sm:h-6" />,
  Karakin: <GiCaveEntrance className="w-5 h-5 sm:w-6 sm:h-6" />,
  Deston: <GiModernCity className="w-5 h-5 sm:w-6 sm:h-6" />
};

const mapColors = {
  Erangel: "from-blue-600 to-blue-800",
  Miramar: "from-gray-700 to-gray-900",
  Sanhok: "from-blue-700 to-gray-800",
  Vikendi: "from-blue-500 to-gray-700",
  Livik: "from-blue-600 to-gray-800",
  Karakin: "from-gray-800 to-gray-900",
  Deston: "from-blue-700 to-gray-800"
};

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function safeDate(d) {
  if (!d) return null;
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return null;
  return x;
}

export default async function TournamentDetailPage({ params }) {
  const {id} = await params;
  const res = await api.getTournament(id);
  const t = res.data;

  const prizePool = safeNum(t?.prizePool, 0);
  const serviceFee = safeNum(t?.serviceFee, 0);
  const maxParticipants = safeNum(t?.maxParticipants, 0);
  const currentParticipants = safeNum(t?.currentParticipants, 0);

  const formatDate = (dateString) => {
    const d = safeDate(dateString);
    if (!d) return "—";
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (dateString) => {
    const d = safeDate(dateString);
    if (!d) return "—";
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatShortDate = (dateString) => {
    const d = safeDate(dateString);
    if (!d) return "—";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "solo":
        return <GiPerson className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "duo":
        return <BsFillPeopleFill className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "squad":
        return <GiTeamIdea className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <GiPerson className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "registration_open":
        return {
          color: "bg-blue-100 text-blue-800",
          text: "Registration Open",
          icon: <FiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        };
      case "ongoing":
        return {
          color: "bg-gray-100 text-gray-800",
          text: "Live Now",
          icon: <GiMachineGun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        };
      case "completed":
        return {
          color: "bg-blue-100 text-blue-800",
          text: "Completed",
          icon: <GiTrophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800",
          text: "Cancelled",
          icon: <FiXCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        };
      case "upcoming":
        return {
          color: "bg-gray-100 text-gray-800",
          text: "Upcoming",
          icon: <FiCalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        };
      case "registration_closed":
        return {
          color: "bg-gray-100 text-gray-800",
          text: "Registration Closed",
          icon: <FiClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        };
      default:
        return { color: "bg-gray-100 text-gray-800", text: status || "—", icon: null };
    }
  };

  const isRegistrationOpen = Boolean(t?.isRegistrationOpen) && !Boolean(t?.isFull);

  const spotsRemaining =
    typeof t?.spotsRemaining === "number"
      ? t.spotsRemaining
      : Math.max(0, maxParticipants - currentParticipants);

  const filledPct = maxParticipants > 0 ? Math.min(100, (currentParticipants / maxParticipants) * 100) : 0;

  const getImageUrl = () => {
    if (t?.featuredImage) {
      if (t.featuredImage.startsWith("http")) return t.featuredImage;
      if (t.featuredImage.startsWith("/")) return t.featuredImage;
      return `/${t.featuredImage}`;
    }

    if (t?.bannerImage) {
      if (t.bannerImage.startsWith("http")) return t.bannerImage;
      if (t.bannerImage.startsWith("/")) return t.bannerImage;
      return `/${t.bannerImage}`;
    }

    return `/maps/${(t?.map || "erangel").toLowerCase()}.jpg`;
  };

  const getRegistrationTimeRemaining = () => {
    if (!isRegistrationOpen || t?.status !== "registration_open") return null;

    const now = new Date();
    const endDate = safeDate(t?.registrationEndDate);
    if (!endDate) return null;

    const diffMs = endDate - now;
    if (diffMs <= 0) return null;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours < 24) return `${diffHours}h ${diffMinutes}m`;
    return null;
  };

  const statusInfo = getStatusInfo(t?.status);
  const registrationTimeRemaining = getRegistrationTimeRemaining();

  return (
    <div className="w-full ">
      <div className="">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">

          {/* ===== HERO SECTION ===== */}
          <section className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl text-white">
            {/* Background Image with Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${mapColors[t?.map] || "from-blue-600 to-gray-800"}`}
              style={{
                backgroundImage: `url(${getImageUrl()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/40"></div>
              
              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 h-16 w-16 rounded-full border border-white/20"></div>
                <div className="absolute bottom-8 right-8 h-12 w-12 rounded-full border border-white/20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 border-2 border-white/10 rounded-xl"></div>
              </div>
            </div>

            {/* Hidden Image for Preload */}
            <img src={getImageUrl()} alt={t?.map || "map"} className="absolute inset-0 w-full h-full object-cover opacity-0" />

            <div className="relative z-10 p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
                
                {/* Left Content */}
                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    <span className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {statusInfo.text}
                    </span>

                    {t?.isFeatured && (
                      <span className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2">
                        <GiTrophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Featured Tournament
                      </span>
                    )}

                    {registrationTimeRemaining && (
                      <span className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 animate-pulse">
                        <FiAlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Closes in {registrationTimeRemaining}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="mb-5 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3">
                      {t?.title || "Tournament"}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5 max-w-3xl">
                      {t?.description || ""}
                    </p>

                    {/* Quick Info Chips */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Map Chip */}
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-white/20">
                        <span className="text-blue-300">{mapIcons[t?.map] || <GiBurningForest className="w-4 h-4 sm:w-5 sm:h-5" />}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-white">{t?.map || "—"}</div>
                          <div className="text-[10px] sm:text-xs text-gray-400">{t?.perspective || "—"}</div>
                        </div>
                      </div>

                      {/* Type Chip */}
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-white/20">
                        <span className="text-blue-300">{getTypeIcon(t?.tournamentType)}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-white uppercase">{String(t?.tournamentType || "—")}</div>
                          <div className="text-[10px] sm:text-xs text-gray-400">
                            {t?.tournamentType === "solo"
                              ? "1 Player"
                              : t?.tournamentType === "duo"
                                ? "2 Players"
                                : `${t?.teamSize || 4} Players`}
                          </div>
                        </div>
                      </div>

                      {/* Matches Chip */}
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-white/20">
                        <GiTargetPrize className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-white">
                            {safeNum(t?.totalMatches, 1)} Match{safeNum(t?.totalMatches, 1) > 1 ? "es" : ""}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-400">{safeNum(t?.matchesPerDay, 1)} per day</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prize & Join Card */}
                <div className="lg:w-80 w-full">
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-700 shadow-2xl">
                    {/* Prize Pool */}
                    <div className="text-center mb-4 sm:mb-5">
                      <div className="text-xs text-gray-400 mb-1">Total Prize Pool</div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                        ₹{prizePool.toLocaleString("en-IN")}
                      </div>
                    </div>

                    {/* Entry Fee */}
                    <div className="text-center mb-5 sm:mb-6">
                      <div className="text-xs text-gray-400 mb-1">Entry Fee</div>
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        {t?.isFree ? "FREE ENTRY" : `₹${serviceFee}`}
                      </div>
                    </div>

                    {/* Join Button */}
                    <div className="mt-4">
                      <JoinClient tournament={t} />
                    </div>

                    {/* Spots Left Indicator */}
                    {isRegistrationOpen && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">Spots Left</span>
                          <span className="text-sm font-semibold text-white">{spotsRemaining}/{maxParticipants}</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${100 - (spotsRemaining / maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== STATS GRID ===== */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {/* Participants */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <FiUsers className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  {currentParticipants}/{maxParticipants || "—"}
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mb-2">Participants</div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{ width: `${filledPct}%` }}
                ></div>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-2">{spotsRemaining} spots left</div>
            </div>

            {/* Winners */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <GiTrophy className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900">{t?.prizeDistribution?.length || 0}</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mb-2">Winners</div>
              <div className="text-[10px] sm:text-xs text-blue-600 font-medium">
                Top {t?.prizeDistribution?.length || 0} Prizes
              </div>
              {t?.prizeDistribution?.[0] && (
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  1st: ₹{safeNum(t.prizeDistribution[0].amount, 0).toLocaleString("en-IN")}
                </div>
              )}
            </div>

            {/* Entry Fee */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <FiDollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-700" />
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900">{t?.isFree ? "FREE" : `₹${serviceFee}`}</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mb-2">Entry Fee</div>
              <div className="text-[10px] sm:text-xs text-gray-500">
                {t?.isFree ? "No Charges" : "Inclusive of service fee"}
              </div>
              {!t?.isFree && <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Pay once, play all matches</div>}
            </div>

            {/* Matches */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <GiTargetPrize className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900">{safeNum(t?.totalMatches, 1)}</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mb-2">Matches</div>
              <div className="text-[10px] sm:text-xs text-blue-600 font-medium">{safeNum(t?.matchesPerDay, 1)} per day</div>
              {safeNum(t?.killPoints, 0) > 0 && (
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{safeNum(t.killPoints, 0)} point per kill</div>
              )}
            </div>
          </section>

          {/* ===== QUICK LINKS ===== */}
          <section className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {/* Leaderboard Link */}
            <a
              href={`/tournaments/${t._id}/leaderboard`}
              className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-all hover:border-blue-300 group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GiRank3 className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Live Leaderboard</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Kills + placement points</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Results Link */}
            <a
              href={`/tournaments/${t._id}/results`}
              className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-all hover:border-gray-400 group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiBarChart2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Match Results</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Per-match breakdown</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            {/* Room Details Link */}
            <a
              href={`/tournaments/${t._id}/room`}
              className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-all hover:border-blue-300 group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiVideo className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Room Details</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Available for paid participants</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </a>
          </section>

          {/* ===== DETAILS GRID ===== */}
          <section className="grid gap-5 sm:gap-6 lg:grid-cols-2">
            {/* Tournament Schedule */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4 flex items-center gap-2">
                <GiCalendar className="w-5 h-5 text-blue-600" />
                Tournament Schedule
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {/* Start Date */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <GiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Tournament Date</div>
                      <div className="text-xs sm:text-sm text-gray-600">{formatDate(t.tournamentStartDate)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] sm:text-xs text-gray-500">Starts</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{formatShortDate(t.tournamentStartDate)}</div>
                  </div>
                </div>

                {/* Start Time */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <GiClockwork className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Start Time</div>
                      <div className="text-xs sm:text-sm text-gray-600">{formatTime(t.tournamentStartDate)} IST</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] sm:text-xs text-gray-500">Duration</div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{safeNum(t.totalMatches, 1)} matches</div>
                  </div>
                </div>

                {/* Registration Closes */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                      <FiShieldIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Registration Closes</div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {formatDate(t.registrationEndDate)} at {formatTime(t.registrationEndDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] sm:text-xs text-gray-500">Status</div>
                    <div
                      className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-md ${
                        isRegistrationOpen 
                          ? "text-blue-600 bg-blue-100" 
                          : "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {isRegistrationOpen ? "Open" : "Closed"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prize Distribution */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4 flex items-center gap-2">
                <GiMoneyStack className="w-5 h-5 text-blue-600" />
                Prize Distribution
              </h3>

              <div className="space-y-2 sm:space-y-3">
                {t?.prizeDistribution?.slice(0, 5).map((prize, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 sm:p-3.5 rounded-lg transition-all hover:shadow-sm ${
                      index === 0
                        ? "bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200"
                        : index === 1
                          ? "bg-gradient-to-r from-gray-50 to-gray-50 border border-gray-200"
                          : index === 2
                            ? "bg-gradient-to-r from-gray-50 to-gray-50 border border-gray-200"
                            : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-gradient-to-br from-blue-600 to-blue-700"
                            : index === 1
                              ? "bg-gradient-to-br from-gray-600 to-gray-700"
                              : index === 2
                                ? "bg-gradient-to-br from-amber-600 to-amber-700"
                                : "bg-gradient-to-br from-gray-400 to-gray-500"
                        }`}
                      >
                        <span className="text-white font-bold text-xs sm:text-sm">#{prize.rank}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                          {prize.rank === 1
                            ? "1st Prize"
                            : prize.rank === 2
                              ? "2nd Prize"
                              : prize.rank === 3
                                ? "3rd Prize"
                                : `${prize.rank}th Prize`}
                        </div>
                        {prize.percentage && (
                          <div className="text-[10px] sm:text-xs text-gray-500">{prize.percentage}% of pool</div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-blue-600">
                      ₹{safeNum(prize.amount, 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}

                {(!t?.prizeDistribution || t.prizeDistribution.length === 0) && (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <GiTrophy className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                    <div className="text-xs sm:text-sm">Prize distribution details coming soon</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ===== RULES & INFORMATION ===== */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-5 sm:mb-6 flex items-center gap-2">
              <FiAward className="w-5 h-5 text-blue-600" />
              Tournament Rules & Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {/* Scoring System */}
              <div>
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 flex items-center gap-2">
                  <GiTargetPrize className="w-4 h-4 text-blue-600" />
                  Scoring System
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600">K</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Kill Points:</span> {safeNum(t?.killPoints, 1)} point per kill
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-gray-700">P</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Placement Points:</span> Based on final position
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600">T</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Total Points:</span> Kills + Placement
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <GiShield className="w-3 h-3 text-red-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Anti-cheat:</span> Fair play strictly enforced
                    </div>
                  </li>
                </ul>
              </div>

              {/* Tournament Format */}
              <div>
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 flex items-center gap-2">
                  <GiTeamIdea className="w-4 h-4 text-gray-700" />
                  Tournament Format
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      {getTypeIcon(t?.tournamentType)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Mode:</span> {String(t?.tournamentType || "").toUpperCase()}
                      <span className="text-xs text-gray-500 ml-1">
                        ({t?.tournamentType === "solo" ? "1 Player" : t?.tournamentType === "duo" ? "2 Players" : `${t?.teamSize || 4} Players`})
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      {mapIcons[t?.map] || <GiBurningForest className="w-3 h-3 text-green-600" />}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Map:</span> {t?.map || "—"}
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <GiEyeTarget className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Perspective:</span> {t?.perspective || "—"}
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-cyan-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <GiTargetPrize className="w-3 h-3 text-cyan-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Total Matches:</span> {safeNum(t?.totalMatches, 1)}
                      <span className="text-xs text-gray-500 ml-1">({safeNum(t?.matchesPerDay, 1)} per day)</span>
                    </div>
                  </li>

                  {t?.discordLink && (
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-600">D</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Discord:</span>
                        <a href={t.discordLink} className="text-blue-600 hover:text-blue-700 ml-1 text-xs sm:text-sm">
                          Join Tournament Server
                        </a>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-200">
              <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                <FiInfo className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900">Note:</span> Tournament rules are final and binding. 
                  Any violation may result in disqualification and forfeiture of entry fee.
                </div>
              </div>
            </div>
          </section>

          {/* ===== VERIFIED BADGE ===== */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <MdVerified className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500">RBM ESports • Verified Tournament • Skill-based competition</span>
          </div>

        </div>
      </div>
    </div>
  );
}