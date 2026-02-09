"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Card from "@/components/ui/Card";
import { 
  FiSearch, 
  FiFilter, 
  FiRefreshCw, 
  FiUserCheck, 
  FiUserX,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUser,
  FiMail,
  FiSmartphone,
  FiShield
} from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";
import { MdOutlineEmojiEvents } from "react-icons/md";

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    banned: 0,
    admins: 0,
    activeToday: 0
  });

  async function load() {
    setLoading(true);
    try {
      const res = await api.adminUsers(q ? `?q=${encodeURIComponent(q)}` : "");
      setRows(res.data || []);
      
      // Calculate stats from data
      const bannedCount = res.data?.filter(user => user.isBanned).length || 0;
      const adminCount = res.data?.filter(user => user.role === 'admin' || user.role === 'super_admin').length || 0;
      
      setStats({
        total: res.data?.length || 0,
        banned: bannedCount,
        admins: adminCount,
        activeToday: Math.floor(Math.random() * 50) + 10 // Mock data for demo
      });
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  async function ban(id, userName) {
    const reason = prompt(`Ban reason for ${userName}?`, "Violation of fair play rules");
    if (reason) {
      try {
        await api.adminBanUser(id, reason);
        await load();
        alert(`User ${userName} has been banned.`);
      } catch (error) {
        alert("Failed to ban user: " + error.message);
      }
    }
  }

  async function unban(id, userName) {
    if (confirm(`Are you sure you want to unban ${userName}?`)) {
      try {
        await api.adminUnbanUser(id);
        await load();
        alert(`User ${userName} has been unbanned.`);
      } catch (error) {
        alert("Failed to unban user: " + error.message);
      }
    }
  }

  async function makeAdmin(id, userName) {
    if (confirm(`Make ${userName} an admin?`)) {
      try {
        await api.adminUpdateUserRole(id, "admin");
        await load();
        alert(`${userName} is now an admin.`);
      } catch (error) {
        alert("Failed to update role: " + error.message);
      }
    }
  }

  const columns = [
    { 
      key: "user", 
      title: "User", 
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <FiUser className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-slate-800">{r.name}</div>
            <div className="text-xs text-slate-500">{r.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: "game", 
      title: "Game Info", 
      render: (r) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-600">ID:</span>
            <span className="font-medium">{r.bgmiId || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-600">IGN:</span>
            <span className="font-medium">{r.inGameName || "N/A"}</span>
          </div>
        </div>
      )
    },
    { 
      key: "stats", 
      title: "Stats", 
      render: (r) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs">
            <GiTrophy className="w-3 h-3 text-amber-500" />
            <span>{r.tournamentsWon || 0} wins</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MdOutlineEmojiEvents className="w-3 h-3 text-blue-500" />
            <span>{r.totalTournaments || 0} tournaments</span>
          </div>
        </div>
      )
    },
    { 
      key: "role", 
      title: "Role", 
      render: (r) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
          r.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
          r.role === 'admin' ? 'bg-blue-100 text-blue-800' :
          'bg-slate-100 text-slate-800'
        }`}>
          {r.role.replace('_', ' ')}
        </span>
      )
    },
    { 
      key: "status", 
      title: "Status", 
      render: (r) => (
        <div className="flex flex-col gap-1">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            r.isBanned 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {r.isBanned ? 'Banned' : 'Active'}
          </span>
          {r.isBanned && r.banReason && (
            <span className="text-xs text-red-600 truncate max-w-[150px]" title={r.banReason}>
              {r.banReason}
            </span>
          )}
        </div>
      )
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </Button>
          
          {r.role !== 'super_admin' && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
              onClick={() => makeAdmin(r._id, r.name)}
              title="Make Admin"
            >
              <FiShield className="w-4 h-4" />
            </Button>
          )}
          
          {!r.isBanned ? (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={() => ban(r._id, r.name)}
              title="Ban User"
            >
              <FiUserX className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
              onClick={() => unban(r._id, r.name)}
              title="Unban User"
            >
              <FiUserCheck className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-600 mt-1">Manage and monitor all platform users</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={load}
            loading={loading}
            className="flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FiFilter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Total Users</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-600 font-medium">+12 new today</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Banned Users</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.banned}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
              <FiUserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-red-600 font-medium">+2 this week</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Administrators</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.admins}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
              <FiShield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-purple-600 font-medium">System admins</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Active Today</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.activeToday}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <FiUserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-green-600 font-medium">Active users</span>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-bold text-slate-800 mb-2">Search Users</h2>
            <p className="text-sm text-slate-600">Search by name, email, BGMI ID, or in-game name</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name/email/bgmiId/inGameName..."
                icon={<FiSearch className="w-4 h-4" />}
                onKeyPress={(e) => e.key === 'Enter' && load()}
              />
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={load}
                loading={loading}
                className="flex items-center gap-2"
              >
                <FiSearch className="w-4 h-4" />
                Search
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setQ("");
                  load();
                }}
                disabled={!q && !loading}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">All Users ({rows.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="h-12 w-12 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto mb-4"></div>
            <div className="text-slate-700 font-medium">Loading users...</div>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-700">No users found</h3>
            <p className="text-slate-600 mt-2">
              {q ? `No results for "${q}"` : "No users in the system yet"}
            </p>
            {q && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setQ("");
                  load();
                }}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {rows.map((row) => (
                  <tr 
                    key={row._id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td
                        key={`${row._id}-${column.key}`}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination (Optional) */}
        {rows.length > 0 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {Math.min(rows.length, 10)} of {rows.length} users
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}