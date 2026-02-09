"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSelector } from "react-redux";
import { 
  GiTrophy, 
  GiRank3, 
  GiCrossedSwords,
  GiPlayer,
  GiHelmet,
  GiMoneyStack
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
  FiBarChart2
} from "react-icons/fi";
import { 
  MdOutlineEmojiEvents,
  MdSportsEsports,
  MdVerified,
  MdHistory
} from "react-icons/md";
import { BsFillTrophyFill } from "react-icons/bs";
import { FaCrown, FaMedal, FaGamepad } from "react-icons/fa";
import Button from "@/components/ui/Button";

export default function MePage() {
  const user = useSelector((s) => s.auth.user);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.me();
        setMe(res.data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tournaments = me?.tournaments || [];
  const stats = {
    totalTournaments: tournaments.length,
    tournamentsWon: tournaments.filter(t => t.status === "won").length,
    totalPrize: tournaments.reduce((sum, t) => sum + (t.prizeWon || 0), 0),
    avgPlacement: tournaments.length > 0 
      ? Math.round(tournaments.reduce((sum, t) => sum + (t.rank || 0), 0) / tournaments.length)
      : 0
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-40 skeleton rounded-2xl"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 skeleton rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-2 border-blue-100 p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <FiUser className="w-10 h-10 text-white" />
                )}
              </div>
              {user?.profileCompleted && (
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center border-2 border-white shadow-lg">
                  <MdVerified className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                {user?.role === "admin" && (
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-red-100 to-rose-100 text-red-700 text-xs font-semibold border border-red-200">
                    ADMIN
                  </span>
                )}
                {user?.role === "super_admin" && (
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold border border-purple-200">
                    SUPER ADMIN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-600 mt-1">
                <FiMail className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                {user?.bgmiId && (
                  <div className="flex items-center gap-1 text-sm text-slate-700">
                    <GiHelmet className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{user.bgmiId}</span>
                  </div>
                )}
                {user?.inGameName && (
                  <div className="flex items-center gap-1 text-sm text-slate-700">
                    <FaGamepad className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">{user.inGameName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:ml-auto flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              Edit Profile
            </Button>
            {!user?.profileCompleted && (
              <Button className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4" />
                Complete Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Player Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 mb-3">
            <MdOutlineEmojiEvents className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalTournaments}</div>
          <div className="text-sm text-slate-600 font-medium">Tournaments</div>
        </div>

        <div className="card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 mb-3">
            <GiTrophy className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.tournamentsWon}</div>
          <div className="text-sm text-slate-600 font-medium">Wins</div>
        </div>

        <div className="card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 mb-3">
            <FiDollarSign className="w-6 h-6 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">₹{stats.totalPrize.toLocaleString()}</div>
          <div className="text-sm text-slate-600 font-medium">Earnings</div>
        </div>

        <div className="card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 mb-3">
            <GiRank3 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.avgPlacement || "-"}</div>
          <div className="text-sm text-slate-600 font-medium">Avg Rank</div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-sm text-slate-600">Your account details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Player ID
                </label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <GiHelmet className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">{user?.bgmiId || "Not set"}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  In-Game Name
                </label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <FaGamepad className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">{user?.inGameName || "Not set"}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Role
              </label>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                user?.role === "admin" || user?.role === "super_admin" 
                  ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                  : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200"
              }`}>
                <FiShield className="w-4 h-4" />
                {user?.role?.toUpperCase()}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Account Status
              </label>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                  user?.profileCompleted 
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {user?.profileCompleted ? (
                    <FiCheckCircle className="w-4 h-4" />
                  ) : (
                    <FiClock className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {user?.profileCompleted ? "Profile Complete" : "Profile Incomplete"}
                  </span>
                </div>
                {user?.isBanned && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    <span className="text-sm font-medium">Account Banned</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tournament History Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <MdHistory className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tournament History</h2>
              <p className="text-sm text-slate-600">Your competitive journey</p>
            </div>
          </div>

          {tournaments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-white">
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
                <GiCrossedSwords className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">No Tournament History</h3>
              <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                Join your first tournament and start building your legacy!
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                onClick={() => window.location.href = '/tournaments'}
              >
                Browse Tournaments
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {tournaments.map((tournament, index) => {
                const getStatusColor = (status) => {
                  switch(status?.toLowerCase()) {
                    case 'won': return 'from-emerald-500 to-green-500';
                    case 'completed': return 'from-blue-500 to-cyan-500';
                    case 'playing': return 'from-amber-500 to-orange-500';
                    case 'registered': return 'from-slate-500 to-gray-500';
                    default: return 'from-slate-400 to-gray-400';
                  }
                };

                const getStatusIcon = (status) => {
                  switch(status?.toLowerCase()) {
                    case 'won': return <GiTrophy className="w-4 h-4" />;
                    case 'completed': return <FiAward className="w-4 h-4" />;
                    case 'playing': return <FiClock className="w-4 h-4" />;
                    default: return <FiCalendar className="w-4 h-4" />;
                  }
                };

                return (
                  <div 
                    key={tournament._id || index} 
                    className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-800 line-clamp-1">
                            {tournament.tournamentId?.title || "Tournament"}
                          </h3>
                          {tournament.prizeWon > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-xs font-medium">
                              <GiMoneyStack className="w-3 h-3" />
                              ₹{tournament.prizeWon}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <GiRank3 className="w-3 h-3" />
                            <span>Rank: {tournament.rank || "-"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiTarget className="w-3 h-3" />
                            <span>Kills: {tournament.kills || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiBarChart2 className="w-3 h-3" />
                            <span>Points: {tournament.points || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${getStatusColor(tournament.status)} text-white text-xs font-semibold`}>
                          {getStatusIcon(tournament.status)}
                          <span>{tournament.status?.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {tournament.notes && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        {tournament.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      {tournaments.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Performance Insights</h2>
              <p className="text-sm text-slate-600">Your competitive analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Win Rate</div>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalTournaments > 0 
                  ? `${Math.round((stats.tournamentsWon / stats.totalTournaments) * 100)}%` 
                  : "0%"
                }
              </div>
              <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                  style={{ 
                    width: stats.totalTournaments > 0 
                      ? `${(stats.tournamentsWon / stats.totalTournaments) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Avg Prize</div>
              <div className="text-2xl font-bold text-slate-900">
                ₹{stats.totalTournaments > 0 
                  ? Math.round(stats.totalPrize / stats.totalTournaments).toLocaleString() 
                  : "0"
                }
              </div>
              <div className="text-sm text-slate-600 mt-1">per tournament</div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Tournament Activity</div>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalTournaments}
              </div>
              <div className="text-sm text-slate-600 mt-1">total entries</div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Best Rank</div>
              <div className="text-2xl font-bold text-slate-900">
                {tournaments.length > 0 
                  ? `#${Math.min(...tournaments.map(t => t.rank || 999))}` 
                  : "-"
                }
              </div>
              <div className="text-sm text-slate-600 mt-1">highest placement</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <FiAward className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
            <p className="text-sm text-slate-600">Manage your account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 py-4"
            onClick={() => window.location.href = '/tournaments'}
          >
            <GiCrossedSwords className="w-5 h-5" />
            Join Tournament
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 py-4"
            onClick={() => window.location.href = '/wallet'}
          >
            <FiDollarSign className="w-5 h-5" />
            View Wallet
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 py-4"
            onClick={() => {/* Edit profile logic */}}
          >
            <FiUser className="w-5 h-5" />
            Edit Profile
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 py-4"
            onClick={() => window.location.href = '/winners'}
          >
            <BsFillTrophyFill className="w-5 h-5" />
            View Winners
          </Button>
        </div>
      </div>
    </div>
  );
}