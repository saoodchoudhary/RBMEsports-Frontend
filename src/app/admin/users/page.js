"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiUserCheck,
  FiUserX,
  FiEye,
  FiShield,
  FiUser,
  FiMail,
  FiSmartphone
} from "react-icons/fi";

function isActiveWithin24Hours(lastActive) {
  if (!lastActive) return false;
  const t = new Date(lastActive).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 24 * 60 * 60 * 1000;
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load(nextQ) {
    const query = typeof nextQ === "string" ? nextQ : q;

    setLoading(true);
    try {
      const res = await api.adminUsers(query ? `?q=${encodeURIComponent(query)}` : "");
      setRows(res.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      alert(error?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const banned = rows.filter((u) => u.isBanned).length;
    const admins = rows.filter((u) => u.role === "admin" || u.role === "super_admin").length;
    const activeToday = rows.filter((u) => isActiveWithin24Hours(u.lastActive)).length;
    return { total, banned, admins, activeToday };
  }, [rows]);

  async function ban(id, userName) {
    const reason = prompt(`Ban reason for ${userName}?`, "Violation of fair play rules");
    if (!reason) return;

    try {
      await api.adminBanUser(id, reason);
      await load();
      alert(`User ${userName} has been banned.`);
    } catch (error) {
      alert("Failed to ban user: " + (error?.message || "Unknown error"));
    }
  }

  async function unban(id, userName) {
    if (!confirm(`Are you sure you want to unban ${userName}?`)) return;

    try {
      await api.adminUnbanUser(id);
      await load();
      alert(`User ${userName} has been unbanned.`);
    } catch (error) {
      alert("Failed to unban user: " + (error?.message || "Unknown error"));
    }
  }

  async function makeAdmin(id, userName) {
    if (!confirm(`Make ${userName} an admin?`)) return;

    try {
      await api.adminUpdateUserRole(id, "admin");
      await load();
      alert(`${userName} is now an admin.`);
    } catch (error) {
      alert("Failed to update role: " + (error?.message || "Unknown error"));
    }
  }

  const columns = [
    {
      key: "user",
      title: "User",
      render: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
            <FiUser className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-slate-800 truncate">{r.name || "—"}</div>
            <div className="text-xs text-slate-500 truncate flex items-center gap-1">
              <FiMail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{r.email || "—"}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: "contact",
      title: "Contact",
      render: (r) => (
        <div className="space-y-1 min-w-[200px]">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <FiSmartphone className="w-4 h-4 text-slate-500" />
            <span className="truncate">{r.phone || "N/A"}</span>
          </div>
          <div className="text-xs text-slate-500">
            Email:{" "}
            <span className={r.emailVerified ? "text-green-700 font-medium" : "text-amber-700 font-medium"}>
              {r.emailVerified ? "Verified" : "Not verified"}
            </span>
          </div>
        </div>
      )
    },
    {
      key: "game",
      title: "Game Profile",
      render: (r) => (
        <div className="space-y-1 min-w-[220px]">
          <div className="text-sm">
            <span className="text-slate-600">BGMI ID:</span>{" "}
            <span className="font-medium text-slate-800">{r.bgmiId || "N/A"}</span>
          </div>
          <div className="text-sm">
            <span className="text-slate-600">IGN:</span>{" "}
            <span className="font-medium text-slate-800">{r.inGameName || "N/A"}</span>
          </div>
          <div className="text-xs text-slate-500">
            Profile:{" "}
            <span className={r.profileCompleted ? "text-green-700 font-medium" : "text-slate-600"}>
              {r.profileCompleted ? "Completed" : "Incomplete"}
            </span>
          </div>
        </div>
      )
    },
    {
      key: "role",
      title: "Role",
      render: (r) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${
            r.role === "super_admin"
              ? "bg-purple-100 text-purple-800"
              : r.role === "admin"
                ? "bg-blue-100 text-blue-800"
                : "bg-slate-100 text-slate-800"
          }`}
        >
          {String(r.role || "user").replace("_", " ")}
        </span>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (r) => (
        <div className="flex flex-col gap-1 min-w-[180px]">
          <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              r.isBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {r.isBanned ? "Banned" : "Active"}
          </span>
          <span className="text-[11px] text-slate-500">
            Last active: {formatDateTime(r.lastActive)}
          </span>
          {r.isBanned && r.banReason && (
            <span className="text-xs text-red-600 truncate max-w-[180px]" title={r.banReason}>
              {r.banReason}
            </span>
          )}
        </div>
      )
    },
    {
      key: "actions",
      title: "Actions",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0" title="View Details" type="button">
            <FiEye className="w-4 h-4" />
          </Button>

          {r.role !== "super_admin" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700"
              onClick={() => makeAdmin(r._id, r.name || "User")}
              title="Make Admin"
              type="button"
            >
              <FiShield className="w-4 h-4" />
            </Button>
          )}

          {!r.isBanned ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
              onClick={() => ban(r._id, r.name || "User")}
              title="Ban User"
              type="button"
            >
              <FiUserX className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-green-600 hover:text-green-700"
              onClick={() => unban(r._id, r.name || "User")}
              title="Unban User"
              type="button"
            >
              <FiUserCheck className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-600 mt-1">Manage and monitor all platform users</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => load()} loading={loading} className="flex items-center gap-2">
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2" type="button">
            <FiFilter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
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
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Active (24h)</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.activeToday}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <FiUserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-bold text-slate-800 mb-2">Search Users</h2>
            <p className="text-sm text-slate-600">Search by name, email, BGMI ID, phone, or in-game name</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name/email/bgmiId/phone/inGameName..."
                icon={<FiSearch className="w-4 h-4" />}
                onKeyDown={(e) => e.key === "Enter" && load()}
              />
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button onClick={() => load()} loading={loading} className="flex items-center gap-2">
                <FiSearch className="w-4 h-4" />
                Search
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setQ("");
                  load("");
                }}
                disabled={!q && !loading}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
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
            <p className="text-slate-600 mt-2">{q ? `No results for "${q}"` : "No users in the system yet"}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table-base">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={column.headerClassName ? column.headerClassName : ""}
                      scope="col"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row._id}>
                    {columns.map((column) => (
                      <td
                        key={`${row._id}-${column.key}`}
                        className={column.cellClassName ? column.cellClassName : ""}
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

        {rows.length > 0 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">Showing {rows.length} users</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled type="button">
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled type="button">
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}