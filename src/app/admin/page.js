"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { 
  FiUsers, 
  FiDollarSign, 
  FiAward, 
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiEye,
  FiDownload,
  FiFilter,
  FiActivity,
  FiBarChart2,
  FiCheckCircle,
  FiAlertCircle,
  FiClock
} from "react-icons/fi";
import { 
  GiTrophy,
  GiCrossedSwords,
  GiMoneyStack,
  GiRank3,
  GiTargetPrize
} from "react-icons/gi";
import { MdOutlineEmojiEvents, MdOutlineSecurity, MdOutlineTour } from "react-icons/md";
import { BsGraphUp, BsFillPeopleFill } from "react-icons/bs";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.adminDashboard({ range: timeRange });
      setData(res.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recent activities table columns
  const activityColumns = [
    { 
      key: "user", 
      title: "User", 
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">
              {row.user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-slate-800">{row.user?.name}</div>
            <div className="text-xs text-slate-500">{row.user?.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: "action", 
      title: "Activity",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${
            row.type === "registration" ? "bg-green-100" :
            row.type === "payment" ? "bg-blue-100" :
            row.type === "withdrawal" ? "bg-amber-100" : "bg-purple-100"
          }`}>
            {row.type === "registration" ? <GiTrophy className="w-4 h-4 text-green-600" /> :
             row.type === "payment" ? <FiDollarSign className="w-4 h-4 text-blue-600" /> :
             row.type === "withdrawal" ? <GiMoneyStack className="w-4 h-4 text-amber-600" /> :
             <FiUsers className="w-4 h-4 text-purple-600" />}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-800">{row.action}</div>
            {row.details && (
              <div className="text-xs text-slate-600">{row.details}</div>
            )}
          </div>
        </div>
      )
    },
    { 
      key: "time", 
      title: "Time", 
      render: (row) => (
        <div className="text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            {row.time}
          </div>
        </div>
      )
    },
    { 
      key: "status", 
      title: "Status", 
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === "success" ? "bg-green-100 text-green-800" :
          row.status === "pending" ? "bg-amber-100 text-amber-800" :
          "bg-blue-100 text-blue-800"
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 skeleton rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 skeleton rounded-xl"></div>
          <div className="h-96 skeleton rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Overview of platform statistics and activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-300">
            {["today", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                } ${range === "today" ? "rounded-l-lg" : ""} ${
                  range === "year" ? "rounded-r-lg" : ""
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <FiDownload className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-slate-600 font-medium">Total Tournaments</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">
                  {data?.totalTournaments?.toLocaleString() ?? "0"}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50">
                <GiTrophy className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {data?.tournamentChange >= 0 ? (
                  <FiTrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  data?.tournamentChange >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {data?.tournamentChange >= 0 ? "+" : ""}{data?.tournamentChange ?? 0}%
                </span>
                <span className="text-sm text-slate-500">from last {timeRange}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-slate-600 font-medium">Active Tournaments</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">
                  {data?.activeTournaments?.toLocaleString() ?? "0"}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50">
                <GiCrossedSwords className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                <span className="font-medium">{data?.liveParticipants ?? 0}</span> live participants
              </div>
              <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                {data?.registrationOpen ?? 0} open
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-slate-600 font-medium">Total Users</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">
                  {data?.totalUsers?.toLocaleString() ?? "0"}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {data?.userChange >= 0 ? (
                  <FiTrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  data?.userChange >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {data?.userChange >= 0 ? "+" : ""}{data?.userChange ?? 0} new
                </span>
              </div>
              <div className="text-xs text-slate-500">
                <span className="font-medium">{data?.verifiedUsers ?? 0}</span> verified
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-slate-600 font-medium">Total Revenue</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">
                  ₹{(data?.totalRevenue ?? 0).toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50">
                <GiMoneyStack className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {data?.revenueChange >= 0 ? (
                  <FiTrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  data?.revenueChange >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {data?.revenueChange >= 0 ? "+" : ""}{data?.revenueChange ?? 0}%
                </span>
              </div>
              <div className="text-sm text-slate-600">
                ₹{(data?.todayRevenue ?? 0).toLocaleString()} today
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Pending Withdrawals</div>
              <div className="text-xl font-bold text-slate-800 mt-1">
                ₹{(data?.pendingWithdrawals ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-red-100">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-600">
            <span className="font-medium">{data?.withdrawalCount ?? 0}</span> requests pending
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Prize Distributed</div>
              <div className="text-xl font-bold text-slate-800 mt-1">
                ₹{(data?.totalPrize ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-green-100">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-600">
            Across <span className="font-medium">{data?.completedTournaments ?? 0}</span> tournaments
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Avg. Entry Fee</div>
              <div className="text-xl font-bold text-slate-800 mt-1">
                ₹{Math.round(data?.avgEntryFee ?? 0)}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-blue-100">
              <FiDollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-600">
            <span className="font-medium">{data?.freeTournaments ?? 0}</span> free tournaments
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Conversion Rate</div>
              <div className="text-xl font-bold text-slate-800 mt-1">
                {((data?.conversionRate ?? 0) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="p-2 rounded-lg bg-purple-100">
              <BsGraphUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-600">
            View to registration ratio
          </div>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Revenue Overview</h3>
              <p className="text-sm text-slate-600">Last 7 days performance</p>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <FiBarChart2 className="w-4 h-4" />
              Details
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end justify-between h-48">
              {data?.revenueData?.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-10 rounded-t-lg bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-300 hover:opacity-90"
                    style={{ height: `${(item.amount / Math.max(...data.revenueData.map(d => d.amount))) * 100}%` }}
                    title={`₹${item.amount.toLocaleString()}`}
                  ></div>
                  <div className="mt-2 text-xs text-slate-500">{item.day}</div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <div className="text-sm text-slate-600">This Week</div>
                <div className="text-2xl font-bold text-slate-800">
                  ₹{(data?.weeklyRevenue ?? 0).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-600">
                  <FiTrendingUp className="w-4 h-4" />
                  <span className="font-medium">+{data?.revenueChange ?? 0}%</span>
                </div>
                <div className="text-sm text-slate-600">vs last week</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Activities</h3>
              <p className="text-sm text-slate-600">Latest platform activities</p>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {data?.recentActivities?.slice(0, 8).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === "registration" ? "bg-green-100" :
                  activity.type === "payment" ? "bg-blue-100" :
                  activity.type === "withdrawal" ? "bg-amber-100" : "bg-purple-100"
                }`}>
                  {activity.type === "registration" ? <MdOutlineTour className="w-4 h-4 text-green-600" /> :
                   activity.type === "payment" ? <FiDollarSign className="w-4 h-4 text-blue-600" /> :
                   activity.type === "withdrawal" ? <GiMoneyStack className="w-4 h-4 text-amber-600" /> :
                   <FiUsers className="w-4 h-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-800">{activity.user?.name}</div>
                    <div className="text-xs text-slate-500">{activity.time}</div>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{activity.action}</div>
                  {activity.details && (
                    <div className="text-xs text-slate-500 mt-1">{activity.details}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {(!data?.recentActivities || data.recentActivities.length === 0) && (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-2">No recent activities</div>
              <div className="text-sm text-slate-500">Activities will appear here</div>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Stats Table */}
      {data?.tournamentStats && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Tournament Statistics</h3>
              <p className="text-sm text-slate-600">Performance by tournament type</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Total</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Active</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Participants</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Avg. Entry</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.tournamentStats.map((stat, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${
                          stat.type === "solo" ? "bg-blue-100" :
                          stat.type === "duo" ? "bg-green-100" : "bg-purple-100"
                        }`}>
                          {stat.type === "solo" ? <GiTargetPrize className="w-4 h-4 text-blue-600" /> :
                           stat.type === "duo" ? <BsFillPeopleFill className="w-4 h-4 text-green-600" /> :
                           <GiRank3 className="w-4 h-4 text-purple-600" />}
                        </div>
                        <span className="font-medium text-slate-800">{stat.type.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{stat.total}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {stat.active}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{stat.participants.toLocaleString()}</td>
                    <td className="py-3 px-4">₹{stat.avgEntry.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-green-600">₹{stat.revenue.toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}