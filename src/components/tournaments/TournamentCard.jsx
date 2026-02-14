"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GiTrophy,
  GiRank3,
  GiTargetPrize,
  GiMoneyStack,
  GiPerson,
  GiTeamIdea,
  GiBurningForest,
  GiDesert,
  GiJungle,
  GiSnowflake1,
  GiIsland,
  GiCaveEntrance,
  GiModernCity,
  GiMachineGun,
  GiSkills,
  GiBulletImpact
} from "react-icons/gi";
import {
  FiUsers,
  FiClock,
  FiCalendar,
  FiEye,
  FiChevronRight,
  FiCheckCircle,
  FiShield
} from "react-icons/fi";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const mapIcons = {
  Erangel: <GiBurningForest className="w-5 h-5" />,
  Miramar: <GiDesert className="w-5 h-5" />,
  Sanhok: <GiJungle className="w-5 h-5" />,
  Vikendi: <GiSnowflake1 className="w-5 h-5" />,
  Livik: <GiIsland className="w-5 h-5" />,
  Karakin: <GiCaveEntrance className="w-5 h-5" />,
  Deston: <GiModernCity className="w-5 h-5" />
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

const mapImageFallbacks = {
  Erangel: "/maps/erangel.jpg",
  Miramar: "/maps/miramar.jpg",
  Sanhok: "/maps/sanhok.jpg",
  Vikendi: "/maps/vikendi.jpg",
  Livik: "/maps/livik.jpg",
  Karakin: "/maps/karakin.jpg",
  Deston: "/maps/deston.jpg"
};

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

/**
 * ✅ NEW: onJoin callback prop
 * - onJoin(tournament) will open JoinTournamentModal from parent page (Home/Tournaments list)
 */
export default function TournamentCard({ t, onJoin }) {
  const [hover, setHover] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "registration_open":
        return "success";
      case "ongoing":
        return "warning";
      case "completed":
        return "secondary";
      case "cancelled":
        return "danger";
      case "upcoming":
        return "primary";
      case "registration_closed":
        return "secondary";
      default:
        return "primary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "registration_open":
        return "Open Registration";
      case "ongoing":
        return "LIVE NOW";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "upcoming":
        return "Upcoming";
      case "registration_closed":
        return "Registration Closed";
      default:
        return status || "—";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "solo":
        return <GiPerson className="w-4 h-4" />;
      case "duo":
        return <BsFillPeopleFill className="w-4 h-4" />;
      case "squad":
        return <GiTeamIdea className="w-4 h-4" />;
      default:
        return <GiPerson className="w-4 h-4" />;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "solo":
        return "Solo";
      case "duo":
        return "Duo";
      case "squad":
        return "Squad";
      default:
        return type || "—";
    }
  };

  const prizePool = safeNum(t?.prizePool, 0);
  const maxParticipants = safeNum(t?.maxParticipants, 0);
  const currentParticipants = safeNum(t?.currentParticipants, 0);
  const serviceFee = safeNum(t?.serviceFee, 0);

  const isRegistrationOpen = Boolean(t?.isRegistrationOpen) && !Boolean(t?.isFull);

  const spotsRemaining =
    typeof t?.spotsRemaining === "number"
      ? t.spotsRemaining
      : Math.max(0, maxParticipants - currentParticipants);

  const progressPct =
    maxParticipants > 0 ? Math.min(100, (currentParticipants / maxParticipants) * 100) : 0;

  const getImageUrl = () => {
    if (!imageError && t?.featuredImage) {
      if (t.featuredImage.startsWith("http")) return t.featuredImage;
      if (t.featuredImage.startsWith("/")) return t.featuredImage;
      return `/${t.featuredImage}`;
    }
    if (!imageError && t?.bannerImage) {
      if (t.bannerImage.startsWith("http")) return t.bannerImage;
      if (t.bannerImage.startsWith("/")) return t.bannerImage;
      return `/${t.bannerImage}`;
    }
    return mapImageFallbacks[t?.map] || "/maps/default.jpg";
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl border border-gray-100"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* FULL Ribbon - Minimal Red */}
      {!isRegistrationOpen && t?.status === "registration_open" && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
            <GiSkills className="w-3.5 h-3.5" />
            FULL
          </div>
        </div>
      )}

      {/* Map Header */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        {!imageError ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${getImageUrl()})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20"></div>
            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${mapColors[t?.map] || "from-blue-600 to-gray-800"}`}>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30">
              {mapIcons[t?.map] || <GiBurningForest className="w-16 h-16" />}
            </div>
          </div>
        )}

        {/* Map Info */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-white/90">
                {mapIcons[t?.map] || <GiBurningForest className="w-4 h-4" />}
              </span>
              <span className="text-white font-bold text-sm">{t?.map || "Battle Ground"}</span>
            </div>
            <div className="bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-white">
              {t?.perspective || "TPP/FPP"}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge
            variant={getStatusVariant(t?.status)}
            className={`
              backdrop-blur-sm border-0 shadow-lg
              ${t?.status === "ongoing" ? "bg-blue-600 text-white" : ""}
              ${t?.status === "registration_open" ? "bg-blue-500 text-white" : ""}
              ${t?.status === "upcoming" ? "bg-gray-700 text-white" : ""}
            `}
          >
            {t?.status === "ongoing" && <GiMachineGun className="w-3.5 h-3.5 mr-1 animate-pulse" />}
            {getStatusText(t?.status)}
          </Badge>
        </div>

        {/* Prize Pool */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-2 rounded-xl border border-gray-700 shadow-xl">
            <div className="flex items-center gap-2">
              <GiTrophy className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-gray-400">Prize Pool</div>
                <div className="text-white font-black">₹{prizePool.toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Badge */}
        {t?.isFeatured && (
          <div className="absolute top-20 left-4 z-10">
            <Badge variant="warning" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-lg">
              <MdOutlineEmojiEvents className="w-3.5 h-3.5 mr-1" />
              FEATURED
            </Badge>
          </div>
        )}

        {/* Hover Overlay */}
        {hover && (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent flex items-center justify-center z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-90 transition-transform">
              <FiEye className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 bg-white">
        {/* Title & Type */}
        <div className="mb-4">
          <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {t?.title || "BGMI Tournament"}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
              {getTypeIcon(t?.tournamentType)}
              <span>{getTypeText(t?.tournamentType)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
              <GiTargetPrize className="w-3.5 h-3.5 text-blue-500" />
              <span>{safeNum(t?.totalMatches, 1)} Matches</span>
            </div>
          </div>
        </div>

        {/* Date/Time */}
        <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <FiCalendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Date</div>
                <div className="text-sm font-bold text-gray-800">{formatDate(t?.tournamentStartDate)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiClock className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Time</div>
                <div className="text-sm font-bold text-gray-800">{formatTime(t?.tournamentStartDate)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FiUsers className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-base font-black text-gray-800">
                {currentParticipants}/{maxParticipants || "—"}
              </span>
            </div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Players</div>
            <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-gray-500 mt-1 font-medium">{spotsRemaining} slots</div>
          </div>

          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <GiRank3 className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-base font-black text-gray-800">{t?.prizeDistribution?.length || 0}</span>
            </div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Winners</div>
            <div className="mt-1.5 text-[10px] font-semibold text-blue-600">
              Top {t?.prizeDistribution?.length || 0}
            </div>
          </div>

          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              {t?.isFree ? (
                <FiCheckCircle className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <GiMoneyStack className="w-3.5 h-3.5 text-gray-700" />
              )}
              <span className="text-base font-black text-gray-800">
                {t?.isFree ? "FREE" : `₹${serviceFee}`}
              </span>
            </div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Entry</div>
            {!t?.isFree && <div className="mt-1.5 text-[10px] text-gray-500">Per Player</div>}
          </div>
        </div>

        {/* ✅ ALWAYS 2 BUTTONS */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => onJoin?.(t)}
            disabled={!isRegistrationOpen}
            className={`
              w-full flex items-center justify-center gap-2 py-3 font-bold transition-all
              ${isRegistrationOpen
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/20"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }
            `}
          >
            <GiMachineGun className="w-4 h-4" />
            JOIN BATTLE
          </Button>

          <Link href={`/tournaments/${t?._id}`} className="block">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-3 font-bold border-gray-300 text-gray-800 hover:bg-gray-50"
            >
              <FiEye className="w-4 h-4" />
              VIEW DETAILS
              <FiChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <FiShield className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-medium">RBM Verified</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FiEye className="w-3.5 h-3.5" />
            <span>{safeNum(t?.viewCount, 0)} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}