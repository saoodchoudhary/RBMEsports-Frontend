"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import {
  FiSave,
  FiUsers,
  FiAward,
  FiBarChart2,
  FiSettings,
  FiCalendar,
  FiDollarSign,
  FiEye,
  FiLock,
  FiArrowLeft
} from "react-icons/fi";
import { GiTrophy, GiTeamIdea } from "react-icons/gi";
import { MdOutlineSecurity } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";

const defaultPlacementPoints = [
  { placement: 1, points: 15 },
  { placement: 2, points: 12 },
  { placement: 3, points: 10 },
  { placement: 4, points: 8 },
  { placement: 5, points: 6 },
  { placement: 6, points: 4 },
  { placement: 7, points: 2 },
  { placement: 8, points: 1 }
];

// Convert ISO date -> datetime-local string WITHOUT timezone shifting logic changes:
// We want to show the stored date in local inputs safely.
// NOTE: if backend stores UTC, this shows local time equivalent.
function toDatetimeLocal(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toISOFromDatetimeLocal(v) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function EditTournamentPage({ params }) {
  const {id} = React.use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [jsonError, setJsonError] = useState(null);

  function set(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const res = await api.getTournament(id);
        setForm(res.data);
      } catch (error) {
        console.error("Failed to load tournament:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function save(e) {
    e.preventDefault();

    if (!id) {
      alert("Tournament ID missing. Please reload the page.");
      return;
    }
    if (!form?._id) {
      alert("Tournament data not loaded yet.");
      return;
    }

    // Validate placementPoints JSON (if edited)
    if (!Array.isArray(form.placementPoints)) {
      alert("Placement points must be a valid JSON array.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        // Only send fields that matter; safer than spreading entire form
        title: form.title,
        description: form.description,

        tournamentType: form.tournamentType,
        teamSize: Number(form.teamSize),
        maxParticipants: Number(form.maxParticipants),

        registrationStartDate: toISOFromDatetimeLocal(form.registrationStartDate) || form.registrationStartDate,
        registrationEndDate: toISOFromDatetimeLocal(form.registrationEndDate) || form.registrationEndDate,
        tournamentStartDate: toISOFromDatetimeLocal(form.tournamentStartDate) || form.tournamentStartDate,
        tournamentEndDate: toISOFromDatetimeLocal(form.tournamentEndDate) || form.tournamentEndDate,

        isFree: Boolean(form.isFree),
        serviceFee: Number(form.isFree ? 0 : form.serviceFee || 0),

        prizePool: Number(form.prizePool || 0),

        killPoints: Number(form.killPoints || 0),
        placementPoints: form.placementPoints,

        totalMatches: Number(form.totalMatches || 1),
        matchesPerDay: Number(form.matchesPerDay || 1),

        map: form.map,
        perspective: form.perspective,

        status: form.status,

        bannerImage: form.bannerImage || "",
        featuredImage: form.featuredImage || "",

        discordLink: form.discordLink || "",

        roomId: form.roomId || "",
        roomPassword: form.roomPassword || ""
      };

      await api.adminUpdateTournament(id, payload);
      alert("✅ Changes saved successfully!");
      router.refresh();
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "basic", label: "Basic Info", icon: <FiSettings className="w-4 h-4" /> },
    { id: "pricing", label: "Pricing", icon: <FiDollarSign className="w-4 h-4" /> },
    { id: "schedule", label: "Schedule", icon: <FiCalendar className="w-4 h-4" /> },
    { id: "room", label: "Room Details", icon: <FiLock className="w-4 h-4" /> },
    { id: "advanced", label: "Advanced", icon: <MdOutlineSecurity className="w-4 h-4" /> }
  ];

  const getTypeIcon = () => {
    switch (form?.tournamentType) {
      case "solo": return <BsFillPeopleFill className="w-5 h-5" />;
      case "duo": return <GiTeamIdea className="w-5 h-5" />;
      case "squad": return <GiTeamIdea className="w-5 h-5" />;
      default: return <GiTrophy className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "registration_open": return "bg-green-100 text-green-800";
      case "ongoing": return "bg-amber-100 text-amber-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "upcoming": return "bg-cyan-100 text-cyan-800";
      case "registration_closed": return "bg-slate-200 text-slate-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  // Derived preview values (safe)
  const prizePoolText = useMemo(() => `₹${Number(form?.prizePool || 0).toLocaleString()}`, [form?.prizePool]);

  if (!id) {
    return (
      <div className="card p-8 text-center">
        <div className="text-red-500 text-xl mb-3">⚠️</div>
        <div className="text-lg font-bold text-slate-800 mb-2">Invalid Tournament</div>
        <div className="text-slate-600 mb-4">Tournament ID is missing</div>
        <Button onClick={() => router.push("/admin/tournaments")}>Back to Tournaments</Button>
      </div>
    );
  }

  if (loading && !form) {
    return (
      <div className="space-y-6">
        <div className="h-10 skeleton rounded-lg w-64"></div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 skeleton rounded-lg"></div>)}
        </div>
        <div className="h-64 skeleton rounded-xl"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">🎮</div>
        <div className="text-lg font-bold text-slate-800 mb-2">Tournament Not Found</div>
        <div className="text-slate-600 mb-4">The requested tournament could not be loaded</div>
        <Button onClick={() => router.push("/admin/tournaments")}>Back to Tournaments</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => router.push("/admin/tournaments")}
              className="flex items-center gap-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(form.status)}`}>
              {String(form.status || "").replace("_", " ").toUpperCase()}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Edit Tournament</h1>
          <p className="text-slate-600 mt-1">Make changes to tournament configuration</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={`/admin/tournaments/${id}/participants`} className="btn btn-outline flex items-center gap-2">
            <FiUsers className="w-4 h-4" />
            Participants
          </a>
          <a href={`/admin/tournaments/${id}/results`} className="btn btn-outline flex items-center gap-2">
            <FiBarChart2 className="w-4 h-4" />
            Results
          </a>
          <a href={`/admin/tournaments/${id}/winners`} className="btn btn-outline flex items-center gap-2">
            <FiAward className="w-4 h-4" />
            Winners
          </a>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              {getTypeIcon()}
            </div>
            <div>
              <div className="text-sm text-slate-600">Type</div>
              <div className="font-bold text-slate-800">{String(form.tournamentType || "").toUpperCase()}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <GiTrophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Prize Pool</div>
              <div className="font-bold text-green-600">{prizePoolText}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Participants</div>
              <div className="font-bold text-slate-800">
                {Number(form.currentParticipants || 0)}/{Number(form.maxParticipants || 0)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Service Fee</div>
              <div className="font-bold text-slate-800">
                {form.isFree ? "FREE" : `₹${Number(form.serviceFee || 0)}`}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <Card className="p-4 lg:col-span-1">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className={activeTab === tab.id ? "text-white" : "text-slate-500"}>
                  {tab.icon}
                </span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Info */}
          <div className="mt-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
            <h4 className="font-semibold text-slate-800 mb-3">Tournament ID</h4>
            <div className="font-mono text-sm bg-white px-2 py-1 rounded border border-slate-200">
              {id}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Created: {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "—"}
            </div>
          </div>
        </Card>

        {/* Main Form */}
        <div className="lg:col-span-3">
          <form onSubmit={save}>
            <Card className="p-6">
              {/* BASIC */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <FiSettings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
                      <p className="text-slate-600 text-sm">Edit tournament title and description</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Tournament Title" value={form.title || ""} onChange={(e) => set("title", e.target.value)} required />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                      <select className="input" value={form.status || "draft"} onChange={(e) => set("status", e.target.value)}>
                        <option value="draft">Draft</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="registration_open">Registration Open</option>
                        <option value="registration_closed">Registration Closed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Description"
                      value={form.description || ""}
                      onChange={(e) => set("description", e.target.value)}
                      multiline
                      rows={6}
                      helperText="Detailed description for participants"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tournament Type</label>
                      <div className="input bg-slate-50">{String(form.tournamentType || "").toUpperCase()}</div>
                    </div>
                    <Input label="Team Size" type="number" value={form.teamSize || 4} onChange={(e) => set("teamSize", e.target.value)} min="1" max="4" />
                    <Input label="Max Participants" type="number" value={form.maxParticipants || 25} onChange={(e) => set("maxParticipants", e.target.value)} min="1" />
                  </div>
                </div>
              )}

              {/* PRICING */}
              {activeTab === "pricing" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                      <FiDollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Pricing & Prize</h3>
                      <p className="text-slate-600 text-sm">Update service fee and prize pool</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isFree"
                          checked={!!form.isFree}
                          onChange={(e) => set("isFree", e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        <label htmlFor="isFree" className="text-sm font-medium text-slate-700">
                          Free Tournament
                        </label>
                      </div>
                      {form.isFree && (
                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          No service fee required
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Service Fee (₹)"
                      type="number"
                      value={form.isFree ? 0 : (form.serviceFee || 0)}
                      onChange={(e) => set("serviceFee", e.target.value)}
                      disabled={!!form.isFree}
                      min="0"
                    />
                    <Input
                      label="Prize Pool (₹)"
                      type="number"
                      value={form.prizePool || 0}
                      onChange={(e) => set("prizePool", e.target.value)}
                      min="0"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">Featured Images</label>
                      <span className="text-xs text-slate-500">Optional</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Banner Image URL" value={form.bannerImage || ""} onChange={(e) => set("bannerImage", e.target.value)} />
                      <Input label="Featured Image URL" value={form.featuredImage || ""} onChange={(e) => set("featuredImage", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* SCHEDULE */}
              {activeTab === "schedule" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                      <FiCalendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Schedule</h3>
                      <p className="text-slate-600 text-sm">Update tournament dates and timing</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Registration Start</label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={toDatetimeLocal(form.registrationStartDate)}
                        onChange={(e) => set("registrationStartDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Registration End</label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={toDatetimeLocal(form.registrationEndDate)}
                        onChange={(e) => set("registrationEndDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tournament Start</label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={toDatetimeLocal(form.tournamentStartDate)}
                        onChange={(e) => set("tournamentStartDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tournament End</label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={toDatetimeLocal(form.tournamentEndDate)}
                        onChange={(e) => set("tournamentEndDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Total Matches" type="number" value={form.totalMatches || 1} onChange={(e) => set("totalMatches", e.target.value)} min="1" />
                    <Input label="Matches per Day" type="number" value={form.matchesPerDay || 1} onChange={(e) => set("matchesPerDay", e.target.value)} min="1" />
                    <Input label="Kill Points" type="number" value={form.killPoints || 1} onChange={(e) => set("killPoints", e.target.value)} min="0" step="0.5" />
                  </div>
                </div>
              )}

              {/* ROOM */}
              {activeTab === "room" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                      <FiLock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Room Details</h3>
                      <p className="text-slate-600 text-sm">Configure match room information</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Room ID"
                      value={form.roomId || ""}
                      onChange={(e) => set("roomId", e.target.value)}
                      placeholder="Enter custom room ID"
                      helperText="Visible only to paid participants via Room page."
                    />
                    <Input
                      label="Room Password"
                      value={form.roomPassword || ""}
                      onChange={(e) => set("roomPassword", e.target.value)}
                      placeholder="Enter room password"
                      helperText="Visible only to paid participants via Room page."
                      type="password"
                    />
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FiEye className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-slate-800">Visibility Note</div>
                        <div className="text-sm text-slate-600 mt-1">
                          Room details are visible only to users who are registered and payment status is <b>paid</b> (or admin).
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ADVANCED */}
              {activeTab === "advanced" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                      <MdOutlineSecurity className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Advanced Settings</h3>
                      <p className="text-slate-600 text-sm">Map, perspective, scoring, and links</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Map</label>
                      <select className="input" value={form.map || "Erangel"} onChange={(e) => set("map", e.target.value)}>
                        {["Erangel","Miramar","Sanhok","Vikendi","Livik","Karakin","Deston"].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Perspective</label>
                      <select className="input" value={form.perspective || "TPP"} onChange={(e) => set("perspective", e.target.value)}>
                        <option value="TPP">TPP</option>
                        <option value="FPP">FPP</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-sm font-medium text-slate-700">Placement Points Configuration</label>
                    </div>
                    <textarea
                      className="input font-mono text-sm"
                      rows={8}
                      value={JSON.stringify(form.placementPoints || defaultPlacementPoints, null, 2)}
                      onChange={(e) => {
                        try {
                          setJsonError(null);
                          set("placementPoints", JSON.parse(e.target.value));
                        } catch {
                          setJsonError("Invalid JSON");
                        }
                      }}
                    />
                    {jsonError && <div className="text-xs text-red-600 mt-2">{jsonError}</div>}
                    <div className="text-xs text-slate-500 mt-2">Edit JSON array to modify placement points</div>
                  </div>

                  <div className="mt-6">
                    <Input
                      label="Discord Link (Optional)"
                      value={form.discordLink || ""}
                      onChange={(e) => set("discordLink", e.target.value)}
                      placeholder="https://discord.gg/invite-code"
                      helperText="Community Discord server link"
                    />
                  </div>
                </div>
              )}

              {/* Save */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Make changes and save to update tournament</div>
                  <Button type="submit" loading={loading} className="bg-gradient-to-r from-green-500 to-emerald-500">
                    <FiSave className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}