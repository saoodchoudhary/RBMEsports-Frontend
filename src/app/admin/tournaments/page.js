// app/admin/tournaments/page.js
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiPlus,
  FiEdit2,
  FiUsers,
  FiAward,
  FiBarChart2,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiDollarSign
} from "react-icons/fi";
import { GiTrophy, GiRank3, GiTeamIdea } from "react-icons/gi";
import { MdOutlineEmojiEvents } from "react-icons/md";

export default function AdminTournamentsPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  async function load() {
    setLoading(true);
    try {
      const qs = `?limit=100&page=1${q ? `&status=${encodeURIComponent(q)}` : ""}`;
      const res = await api.listTournaments(qs);
      setRows(res.data || []);
    } catch (error) {
      console.error("Failed to load tournaments:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  async function del(id) {
    if (!confirm("Are you sure you want to delete this tournament? This action cannot be undone.")) return;
    
    try {
      await api.adminDeleteTournament(id);
      await load();
      // Show success toast
      alert("Tournament deleted successfully!");
    } catch (error) {
      alert("Failed to delete tournament: " + (error.message || "Please try again"));
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'registration_open': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'solo': return <GiTrophy className="w-4 h-4" />;
      case 'duo': return <GiTeamIdea className="w-4 h-4" />;
      case 'squad': return <GiRank3 className="w-4 h-4" />;
      default: return <GiTrophy className="w-4 h-4" />;
    }
  };

  const columns = [
    { 
      key: "title", 
      title: "Tournament",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
            <GiTrophy className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-slate-800">{r.title}</div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1">
                {getTypeIcon(r.tournamentType)}
                {r.tournamentType.toUpperCase()}
              </span>
              <span>•</span>
              <FiCalendar className="w-3 h-3" />
              <span>{new Date(r.tournamentStartDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      key: "status", 
      title: "Status",
      render: (r) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>
          {r.status.replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    { 
      key: "participants", 
      title: "Participants",
      render: (r) => (
        <div className="text-center">
          <div className="font-bold text-slate-800">{r.currentParticipants || 0}/{r.maxParticipants}</div>
          <div className="h-1 w-16 bg-slate-200 rounded-full overflow-hidden mx-auto mt-1">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              style={{ 
                width: `${Math.min(100, ((r.currentParticipants || 0) / r.maxParticipants) * 100)}%` 
              }}
            ></div>
          </div>
        </div>
      )
    },
    { 
      key: "prize", 
      title: "Prize Pool",
      render: (r) => (
        <div className="text-right">
          <div className="font-bold text-slate-800">₹{r.prizePool.toLocaleString()}</div>
          <div className="text-xs text-slate-500">
            {r.isFree ? 'Free' : `₹${r.serviceFee} fee`}
          </div>
        </div>
      )
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="flex items-center gap-2">
          <a 
            href={`/admin/tournaments/${r._id}/edit`}
            className="h-8 w-8 rounded-lg border border-slate-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center transition-colors"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4 text-slate-600 hover:text-blue-600" />
          </a>
          <a 
            href={`/admin/tournaments/${r._id}/participants`}
            className="h-8 w-8 rounded-lg border border-slate-300 hover:border-green-500 hover:bg-green-50 flex items-center justify-center transition-colors"
            title="Participants"
          >
            <FiUsers className="w-4 h-4 text-slate-600 hover:text-green-600" />
          </a>
          <a 
            href={`/admin/tournaments/${r._id}/results`}
            className="h-8 w-8 rounded-lg border border-slate-300 hover:border-purple-500 hover:bg-purple-50 flex items-center justify-center transition-colors"
            title="Results"
          >
            <FiBarChart2 className="w-4 h-4 text-slate-600 hover:text-purple-600" />
          </a>
          <a 
            href={`/admin/tournaments/${r._id}/winners`}
            className="h-8 w-8 rounded-lg border border-slate-300 hover:border-amber-500 hover:bg-amber-50 flex items-center justify-center transition-colors"
            title="Winners"
          >
            <FiAward className="w-4 h-4 text-slate-600 hover:text-amber-600" />
          </a>
          <button
            onClick={() => del(r._id)}
            className="h-8 w-8 rounded-lg border border-slate-300 hover:border-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4 text-slate-600 hover:text-red-600" />
          </button>
        </div>
      )
    }
  ];

  const filteredRows = rows.filter(row => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") {
      return ["registration_open", "ongoing", "upcoming"].includes(row.status);
    }
    return row.status === statusFilter;
  });

  // Calculate stats
  const stats = {
    total: rows.length,
    active: rows.filter(r => ["registration_open", "ongoing"].includes(r.status)).length,
    upcoming: rows.filter(r => r.status === "upcoming").length,
    completed: rows.filter(r => r.status === "completed").length,
    totalPrize: rows.reduce((sum, r) => sum + r.prizePool, 0),
    totalParticipants: rows.reduce((sum, r) => sum + (r.currentParticipants || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tournaments Management</h1>
          <p className="text-slate-600 mt-1">Create, update, and manage all tournaments</p>
        </div>
        <a 
          href="/admin/tournaments/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          New Tournament
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          <div className="text-sm text-slate-600">Total</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-slate-600">Active</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
          <div className="text-sm text-slate-600">Upcoming</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
          <div className="text-sm text-slate-600">Completed</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">₹{stats.totalPrize.toLocaleString()}</div>
          <div className="text-sm text-slate-600">Total Prize</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-cyan-600">{stats.totalParticipants}</div>
          <div className="text-sm text-slate-600">Participants</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tournaments by title or status..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
              <FiFilter className="w-4 h-4 text-slate-600" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="registration_open">Registration Open</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={load}
              loading={loading}
              className="flex items-center gap-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Tournaments Table */}
      {loading ? (
        <Card className="p-8 text-center">
          <div className="h-12 w-12 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <div className="text-slate-700 font-medium">Loading tournaments...</div>
        </Card>
      ) : filteredRows.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
            <MdOutlineEmojiEvents className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">No tournaments found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your filters or create a new tournament</p>
          <a href="/admin/tournaments/new" className="btn btn-primary inline-flex items-center gap-2">
            <FiPlus className="w-4 h-4" />
            Create Tournament
          </a>
        </Card>
      ) : (
        <Table columns={columns} rows={filteredRows} />
      )}

      {/* Quick Tips */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
            <FiEye className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Quick Tips</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Click on tournament title to view details</li>
              <li>• Use status filter to view specific tournament types</li>
              <li>• Deleting tournaments is permanent - use with caution</li>
              <li>• You can edit participants and winners after tournament completion</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}