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
  GiModernCity
} from "react-icons/gi";
import {
  FiUsers,
  FiClock,
  FiCalendar,
  FiEye,
  FiChevronRight,
  FiCheckCircle
} from "react-icons/fi";
import { MdSecurity, MdOutlineEmojiEvents } from "react-icons/md";
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
  Erangel: "from-green-600 to-green-800",
  Miramar: "from-amber-700 to-amber-900",
  Sanhok: "from-emerald-600 to-emerald-800",
  Vikendi: "from-cyan-600 to-blue-800",
  Livik: "from-blue-600 to-indigo-800",
  Karakin: "from-stone-700 to-stone-900",
  Deston: "from-purple-600 to-purple-800"
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

export default function TournamentCard({ t }) {
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
        return "Registration Open";
      case "ongoing":
        return "Live Now";
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

  // Backend virtual: isRegistrationOpen, isFull, spotsRemaining
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
      className="card overflow-hidden group hover:shadow-xl transition-all duration-300 relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* FULL ribbon */}
      {!isRegistrationOpen && t?.status === "registration_open" && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-lg">
            FULL
          </div>
        </div>
      )}

      {/* Map Header */}
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${mapColors[t?.map] || "from-blue-600 to-purple-600"}`}
            style={{
              backgroundImage: `url(${getImageUrl()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 h-12 w-12 rounded-full border-2"></div>
              <div className="absolute bottom-4 right-4 h-8 w-8 rounded-full border"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 border-2 rounded-lg"></div>
            </div>

            {/* preload check */}
            <img
              src={getImageUrl()}
              alt={t?.map || "map"}
              className="absolute inset-0 w-full h-full object-cover opacity-0"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${mapColors[t?.map] || "from-blue-600 to-purple-600"}`}>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {mapIcons[t?.map] || <GiBurningForest className="w-5 h-5" />}
            </div>
          </div>
        )}

        {/* Map Info */}
        <div className="absolute inset-0">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {mapIcons[t?.map] || <GiBurningForest className="w-5 h-5" />}
                <span className="font-bold text-lg">{t?.map || "—"}</span>
              </div>
              <div className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                {t?.perspective || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant={getStatusVariant(t?.status)} className="backdrop-blur-sm">
            {getStatusText(t?.status)}
          </Badge>
        </div>

        {/* Prize badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg shadow-lg">
            <div className="flex items-center gap-1">
              <GiTrophy className="w-4 h-4" />
              <span className="font-bold">₹{prizePool.toLocaleString("en-IN")}</span>
            </div>
            <div className="text-xs opacity-90">Prize Pool</div>
          </div>
        </div>

        {/* Featured badge */}
        {t?.isFeatured && (
          <div className="absolute top-14 left-4 z-10">
            <Badge variant="warning" className="bg-gradient-to-r from-yellow-400 to-orange-400">
              <MdOutlineEmojiEvents className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* Hover */}
        {hover && (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent flex items-center justify-center z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 animate-pulse">
              <FiEye className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 pt-7">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {t?.title || "Tournament"}
          </h3>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              {getTypeIcon(t?.tournamentType)}
              <span>{getTypeText(t?.tournamentType)}</span>
            </div>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <GiTargetPrize className="w-4 h-4" />
              <span>
                {safeNum(t?.totalMatches, 1)} Match{safeNum(t?.totalMatches, 1) > 1 ? "es" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Date/time */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <FiCalendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <div className="font-medium text-slate-800">{formatDate(t?.tournamentStartDate)}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <FiClock className="w-4 h-4" />
                <span>Time</span>
              </div>
              <div className="font-medium text-slate-800">{formatTime(t?.tournamentStartDate)}</div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiUsers className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-lg text-slate-800">
                {currentParticipants}/{maxParticipants || "—"}
              </span>
            </div>
            <div className="text-xs text-slate-600">Players</div>

            <div className="mt-1">
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">{spotsRemaining} spots left</div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GiRank3 className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-lg text-slate-800">{t?.prizeDistribution?.length || 0}</span>
            </div>
            <div className="text-xs text-slate-600">Winners</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Top {t?.prizeDistribution?.length || 0}</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {t?.isFree ? (
                <FiCheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <GiMoneyStack className="w-4 h-4 text-purple-600" />
              )}
              <span className="font-bold text-lg text-slate-800">
                {t?.isFree ? "FREE" : `₹${serviceFee}`}
              </span>
            </div>
            <div className="text-xs text-slate-600">Entry Fee</div>
            {!t?.isFree && <div className="text-xs text-slate-500 mt-1 line-clamp-1">Service fee included</div>}
          </div>
        </div>

        {/* CTA */}
        <Link href={`/tournaments/${t?._id}`}>
          <Button
            className="w-full flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
            disabled={!isRegistrationOpen}
            variant={isRegistrationOpen ? "primary" : "outline"}
          >
            {isRegistrationOpen ? (
              <>
                Join Tournament
                <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                View Details
                <FiChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </Link>

        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MdSecurity className="w-3 h-3" />
            <span>Verified</span>
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-1">
            <FiEye className="w-3 h-3" />
            <span>{safeNum(t?.viewCount, 0)} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}