
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
  GiMoneyStack
} from "react-icons/gi";
import {
  FiUsers,
  FiAward,
  FiShield,
  FiBarChart2,
  FiVideo,
  FiDollarSign,
  FiClock as FiClockIcon,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdOutlineEmojiEvents } from "react-icons/md";
import React from "react";

const mapIcons = {
  Erangel: <GiBurningForest className="w-6 h-6" />,
  Miramar: <GiDesert className="w-6 h-6" />,
  Sanhok: <GiJungle className="w-6 h-6" />,
  Vikendi: <GiSnowflake1 className="w-6 h-6" />,
  Livik: <GiIsland className="w-6 h-6" />,
  Karakin: <GiCaveEntrance className="w-6 h-6" />,
  Deston: <GiModernCity className="w-6 h-6" />
};

const mapColors = {
  Erangel: "from-green-600 to-green-800",
  Miramar: "from-amber-700 to-amber-900",
  Sanhok: "from-emerald-600 to-emerald-800",
  Vikendi: "from-cyan-600 to-blue-800",
  Livik: "from-blue-600 to-indigo-800",
  Karakin: "from-stone-700 to-stone-900",
  Deston: "from-purple-600 to-purple-800"
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
  const {id} = await params; // ✅ correct
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
        return <GiPerson className="w-5 h-5" />;
      case "duo":
        return <BsFillPeopleFill className="w-5 h-5" />;
      case "squad":
        return <GiTeamIdea className="w-5 h-5" />;
      default:
        return <GiPerson className="w-5 h-5" />;
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "registration_open":
        return {
          color: "bg-green-100 text-green-800",
          text: "Registration Open",
          icon: <FiCheckCircle className="w-4 h-4" />
        };
      case "ongoing":
        return {
          color: "bg-amber-100 text-amber-800",
          text: "Live Now",
          icon: <GiTargetPrize className="w-4 h-4" />
        };
      case "completed":
        return {
          color: "bg-blue-100 text-blue-800",
          text: "Completed",
          icon: <GiTrophy className="w-4 h-4" />
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800",
          text: "Cancelled",
          icon: <FiXCircle className="w-4 h-4" />
        };
      case "upcoming":
        return {
          color: "bg-purple-100 text-purple-800",
          text: "Upcoming",
          icon: <GiCalendar className="w-4 h-4" />
        };
      case "registration_closed":
        return {
          color: "bg-slate-100 text-slate-800",
          text: "Registration Closed",
          icon: <FiClockIcon className="w-4 h-4" />
        };
      default:
        return { color: "bg-slate-100 text-slate-800", text: status || "—", icon: null };
    }
  };

  // Backend virtual + full check
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
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl text-white">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${mapColors[t?.map] || "from-blue-600 to-purple-600"}`}
          style={{
            backgroundImage: `url(${getImageUrl()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30"></div>

          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-8 h-16 w-16 rounded-full border-2"></div>
            <div className="absolute bottom-8 right-8 h-12 w-12 rounded-full border"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 border-4 rounded-xl"></div>
          </div>
        </div>

        <img src={getImageUrl()} alt={t?.map || "map"} className="absolute inset-0 w-full h-full object-cover opacity-0" />

        <div className="relative z-10 p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${statusInfo.color}`}>
                  {statusInfo.icon}
                  {statusInfo.text}
                </span>

                {t?.isFeatured && (
                  <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-medium flex items-center gap-2">
                    <MdOutlineEmojiEvents className="w-4 h-4" />
                    Featured Tournament
                  </span>
                )}

                {registrationTimeRemaining && (
                  <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-medium flex items-center gap-2 animate-pulse">
                    <FiAlertTriangle className="w-4 h-4" />
                    Closes in {registrationTimeRemaining}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{t?.title || "Tournament"}</h1>
                <p className="text-lg opacity-90 mb-6">{t?.description || ""}</p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                    {mapIcons[t?.map] || <GiBurningForest className="w-5 h-5" />}
                    <div>
                      <div className="font-medium">{t?.map || "—"}</div>
                      <div className="text-xs opacity-80">{t?.perspective || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                    {getTypeIcon(t?.tournamentType)}
                    <div>
                      <div className="font-medium">{String(t?.tournamentType || "—").toUpperCase()}</div>
                      <div className="text-xs opacity-80">
                        {t?.tournamentType === "solo"
                          ? "1 Player"
                          : t?.tournamentType === "duo"
                            ? "2 Players"
                            : `${t?.teamSize || 4} Players`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <GiTargetPrize className="w-5 h-5" />
                    <div>
                      <div className="font-medium">
                        {safeNum(t?.totalMatches, 1)} Match{safeNum(t?.totalMatches, 1) > 1 ? "es" : ""}
                      </div>
                      <div className="text-xs opacity-80">{safeNum(t?.matchesPerDay, 1)} per day</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prize + Join */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="mb-4">
                  <div className="text-4xl font-bold">₹{prizePool.toLocaleString("en-IN")}</div>
                  <div className="text-sm opacity-90">Total Prize Pool</div>
                </div>

                <div className="mb-4">
                  <div className="text-xl font-bold">{t?.isFree ? "FREE" : `₹${serviceFee}`}</div>
                  <div className="text-sm opacity-90">Entry Fee</div>
                </div>

                <div className="mt-4">
                  <JoinClient tournament={t} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center hover:shadow-lg transition-all duration-300">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 mb-3">
            <FiUsers className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {currentParticipants}/{maxParticipants || "—"}
          </div>
          <div className="text-sm text-slate-600">Participants</div>
          <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${filledPct}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-500 mt-1">{spotsRemaining} spots left</div>
        </div>

        <div className="card p-4 text-center hover:shadow-lg transition-all duration-300">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 mb-3">
            <GiTrophy className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{t?.prizeDistribution?.length || 0}</div>
          <div className="text-sm text-slate-600">Winners</div>
          <div className="text-xs text-amber-600 font-medium mt-1">
            Top {t?.prizeDistribution?.length || 0} Prizes
          </div>
          {t?.prizeDistribution?.[0] && (
            <div className="text-xs text-slate-500 mt-1">
              1st: ₹{safeNum(t.prizeDistribution[0].amount, 0).toLocaleString("en-IN")}
            </div>
          )}
        </div>

        <div className="card p-4 text-center hover:shadow-lg transition-all duration-300">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50 mb-3">
            <FiDollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{t?.isFree ? "FREE" : `₹${serviceFee}`}</div>
          <div className="text-sm text-slate-600">Entry Fee</div>
          <div className={`text-xs ${t?.isFree ? "text-green-600" : "text-slate-500"} mt-1`}>
            {t?.isFree ? "No Charges" : "Inclusive of service fee"}
          </div>
          {!t?.isFree && <div className="text-xs text-slate-500 mt-1">Pay once, play all matches</div>}
        </div>

        <div className="card p-4 text-center hover:shadow-lg transition-all duration-300">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 mb-3">
            <GiTargetPrize className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{safeNum(t?.totalMatches, 1)}</div>
          <div className="text-sm text-slate-600">Matches</div>
          <div className="text-xs text-purple-600 font-medium mt-1">{safeNum(t?.matchesPerDay, 1)} per day</div>
          {safeNum(t?.killPoints, 0) > 0 && (
            <div className="text-xs text-slate-500 mt-1">{safeNum(t.killPoints, 0)} point per kill</div>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <a
          href={`/tournaments/${t._id}/leaderboard`}
          className="card p-6 hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] hover:border-blue-300 border border-transparent"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GiRank3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Live Leaderboard</h3>
              <p className="text-sm text-slate-600 mt-1">Kills + placement points</p>
              <div className="text-xs text-blue-600 font-medium mt-2 flex items-center gap-1">
                View Rankings <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </a>

        <a
          href={`/tournaments/${t._id}/results`}
          className="card p-6 hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] hover:border-green-300 border border-transparent"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiBarChart2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Match Results</h3>
              <p className="text-sm text-slate-600 mt-1">Per-match breakdown</p>
              <div className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                View Results <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </a>

        <a
          href={`/tournaments/${t._id}/room`}
          className="card p-6 hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] hover:border-purple-300 border border-transparent"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiVideo className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Room Details</h3>
              <p className="text-sm text-slate-600 mt-1">Available for paid participants</p>
              <div className="text-xs text-purple-600 font-medium mt-2 flex items-center gap-1">
                Get Room Info <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <GiCalendar className="w-5 h-5 text-blue-600" />
            Tournament Schedule
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <GiCalendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-800">Tournament Date</div>
                  <div className="text-sm text-slate-600">{formatDate(t.tournamentStartDate)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Starts</div>
                <div className="text-sm font-medium">{formatShortDate(t.tournamentStartDate)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                  <GiClockwork className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-800">Start Time</div>
                  <div className="text-sm text-slate-600">{formatTime(t.tournamentStartDate)} IST</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Duration</div>
                <div className="text-sm font-medium">{safeNum(t.totalMatches, 1)} matches</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                  <FiShield className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-800">Registration Closes</div>
                  <div className="text-sm text-slate-600">
                    {formatDate(t.registrationEndDate)} at {formatTime(t.registrationEndDate)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Status</div>
                <div
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    isRegistrationOpen ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                  }`}
                >
                  {isRegistrationOpen ? "Open" : "Closed"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <GiMoneyStack className="w-5 h-5 text-amber-600" />
            Prize Distribution
          </h3>

          <div className="space-y-3">
            {t?.prizeDistribution?.slice(0, 5).map((prize, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                  index === 0
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100"
                    : index === 1
                      ? "bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100"
                      : index === 2
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100"
                        : "bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-100 to-amber-100"
                        : index === 1
                          ? "bg-gradient-to-br from-slate-100 to-gray-100"
                          : index === 2
                            ? "bg-gradient-to-br from-orange-100 to-amber-100"
                            : "bg-gradient-to-br from-blue-100 to-cyan-100"
                    }`}
                  >
                    <span
                      className={`font-bold ${
                        index === 0 ? "text-amber-700" : index === 1 ? "text-slate-700" : index === 2 ? "text-orange-700" : "text-blue-700"
                      }`}
                    >
                      #{prize.rank}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">
                      {prize.rank === 1
                        ? "🏆 1st Prize"
                        : prize.rank === 2
                          ? "🥈 2nd Prize"
                          : prize.rank === 3
                            ? "🥉 3rd Prize"
                            : `${prize.rank}th Prize`}
                    </div>
                    {prize.percentage && <div className="text-xs text-slate-500">{prize.percentage}% of pool</div>}
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600">
                  ₹{safeNum(prize.amount, 0).toLocaleString("en-IN")}
                </div>
              </div>
            ))}

            {(!t?.prizeDistribution || t.prizeDistribution.length === 0) && (
              <div className="text-center py-6 text-slate-500">
                <GiTrophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <div>Prize distribution details coming soon</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiAward className="w-5 h-5 text-blue-600" />
          Tournament Rules & Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <GiTargetPrize className="w-4 h-4 text-green-600" />
              Scoring System
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-green-600">K</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Kill Points:</span> {safeNum(t?.killPoints, 1)} point per kill
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-blue-600">P</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Placement Points:</span> Based on final position
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-600">T</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Total Points:</span> Kills + Placement
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                  <FiShield className="w-3 h-3 text-red-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-700">Anti-cheat:</span> Fair play strictly enforced
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <GiTeamIdea className="w-4 h-4 text-purple-600" />
              Tournament Format
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                  {getTypeIcon(t?.tournamentType)}
                </div>
                <div>
                  <span className="font-medium text-slate-700">Mode:</span> {String(t?.tournamentType || "").toUpperCase()}
                  <span className="text-xs text-slate-500 ml-2">
                    ({t?.tournamentType === "solo" ? "1 Player" : t?.tournamentType === "duo" ? "2 Players" : `${t?.teamSize || 4} Players`})
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  {mapIcons[t?.map] || <GiBurningForest className="w-3 h-3 text-green-600" />}
                </div>
                <div>
                  <span className="font-medium text-slate-700">Map:</span> {t?.map || "—"}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <GiEyeTarget className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-700">Perspective:</span> {t?.perspective || "—"}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-cyan-100 flex items-center justify-center mt-0.5">
                  <GiTargetPrize className="w-3 h-3 text-cyan-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-700">Total Matches:</span> {safeNum(t?.totalMatches, 1)}
                  <span className="text-xs text-slate-500 ml-2">({safeNum(t?.matchesPerDay, 1)} per day)</span>
                </div>
              </li>

              {t?.discordLink && (
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-indigo-600">D</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Discord:</span>
                    <a href={t.discordLink} className="text-blue-600 hover:text-blue-700 ml-2">
                      Join Tournament Server
                    </a>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}