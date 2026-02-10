"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  FiCalendar,
  FiDollarSign,
  FiEye,
  FiSettings,
  FiSave,
  FiX,
  FiCheck
} from "react-icons/fi";
import {
  GiTrophy,
  GiCrossedSwords,
  GiTargetPrize,
  GiRank3
} from "react-icons/gi";
import { MdOutlineEmojiEvents, MdSecurity } from "react-icons/md";

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

function toISOIfPresent(v) {
  if (!v) return "";
  // v comes like "2026-02-09T12:30"
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

export default function NewTournamentPage() {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [jsonError, setJsonError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    tournamentType: "squad",
    teamSize: 4,
    maxParticipants: 25,
    registrationStartDate: "",
    registrationEndDate: "",
    tournamentStartDate: "",
    tournamentEndDate: "",
    isFree: false,
    serviceFee: 100,
    prizePool: 5000,
    killPoints: 1,
    placementPoints: defaultPlacementPoints,
    totalMatches: 3,
    matchesPerDay: 1,
    map: "Erangel",
    perspective: "TPP",
    status: "draft",
    bannerImage: "",
    featuredImage: "",
    roomId: "",
    roomPassword: ""
  });

  function set(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  // Helpful auto team size (optional)
  useEffect(() => {
    if (form.tournamentType === "solo") set("teamSize", 1);
    if (form.tournamentType === "duo") set("teamSize", 2);
    if (form.tournamentType === "squad") set("teamSize", 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.tournamentType]);

  // Keep serviceFee consistent
  useEffect(() => {
    if (form.isFree) set("serviceFee", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.isFree]);

  async function handleSubmit() {
    setLoading(true);
    setJsonError(null);

    try {
      // convert placementPoints safely
      const placementPoints = Array.isArray(form.placementPoints) ? form.placementPoints : defaultPlacementPoints;

      const payload = {
        title: form.title?.trim(),
        description: form.description?.trim(),
        tournamentType: form.tournamentType,
        teamSize: Number(form.teamSize),
        maxParticipants: Number(form.maxParticipants),

        // Send ISO to backend
        registrationStartDate: toISOIfPresent(form.registrationStartDate),
        registrationEndDate: toISOIfPresent(form.registrationEndDate),
        tournamentStartDate: toISOIfPresent(form.tournamentStartDate),
        tournamentEndDate: toISOIfPresent(form.tournamentEndDate),

        isFree: Boolean(form.isFree),
        serviceFee: Number(form.isFree ? 0 : form.serviceFee),
        prizePool: Number(form.prizePool),

        killPoints: Number(form.killPoints),
        placementPoints,

        totalMatches: Number(form.totalMatches),
        matchesPerDay: Number(form.matchesPerDay),
        map: form.map,
        perspective: form.perspective,
        status: form.status,

        bannerImage: form.bannerImage?.trim() || undefined,
        featuredImage: form.featuredImage?.trim() || undefined,

        roomId: form.roomId?.trim() || undefined,
        roomPassword: form.roomPassword?.trim() || undefined
      };

      // Basic required validation (UI level)
      if (!payload.title) throw new Error("Tournament title is required");
      if (!payload.description) throw new Error("Description is required");
      if (!payload.registrationStartDate || !payload.registrationEndDate) throw new Error("Registration dates required");
      if (!payload.tournamentStartDate || !payload.tournamentEndDate) throw new Error("Tournament dates required");

      const res = await api.adminCreateTournament(payload);
      alert("✅ Tournament created successfully!");
      window.location.href = `/admin/tournaments/${res.data._id}/edit`;
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    handleSubmit();
  }

  const sections = [
    { id: "basic", label: "Basic Info", icon: <GiTrophy className="w-4 h-4" /> },
    { id: "schedule", label: "Schedule", icon: <FiCalendar className="w-4 h-4" /> },
    { id: "pricing", label: "Pricing", icon: <FiDollarSign className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <FiSettings className="w-4 h-4" /> },
    { id: "scoring", label: "Scoring", icon: <GiRank3 className="w-4 h-4" /> },
    { id: "advanced", label: "Advanced", icon: <MdSecurity className="w-4 h-4" /> }
  ];

  const previewStatusClass = useMemo(() => {
    if (form.status === "draft") return "bg-slate-100 text-slate-700";
    if (form.status === "upcoming") return "bg-blue-100 text-blue-700";
    if (form.status === "registration_open") return "bg-green-100 text-green-700";
    if (form.status === "ongoing") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  }, [form.status]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Create Tournament</h1>
            <p className="text-slate-600 mt-1">Setup professional BGMI tournaments with detailed configuration</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} loading={loading}>
              <FiSave className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Tournament"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className={activeSection === section.id ? "text-white" : "text-slate-500"}>
                    {section.icon}
                  </span>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-slate-800 mb-3">Tournament Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium">{String(form.tournamentType).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Prize Pool:</span>
                  <span className="font-bold text-green-600">₹{Number(form.prizePool || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Entry:</span>
                  <span className="font-medium">{form.isFree ? "FREE" : `₹${Number(form.serviceFee || 0)}`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${previewStatusClass}`}>
                    {String(form.status).replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3">
          <form onSubmit={onSubmit}>
            {/* BASIC */}
            {activeSection === "basic" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <GiTrophy className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
                      <p className="text-slate-600 text-sm">Set title, description and basic details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Tournament Title"
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      placeholder="e.g., Weekend BGMI Championship"
                      required
                      icon={<MdOutlineEmojiEvents className="w-4 h-4" />}
                    />

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Tournament Type
                      </label>
                      <select
                        className="input"
                        value={form.tournamentType}
                        onChange={(e) => set("tournamentType", e.target.value)}
                      >
                        <option value="solo">Solo</option>
                        <option value="duo">Duo</option>
                        <option value="squad">Squad</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Input
                      label="Description"
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Describe rules, format, etc..."
                      multiline
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Map</label>
                      <select className="input" value={form.map} onChange={(e) => set("map", e.target.value)}>
                        {["Erangel","Miramar","Sanhok","Vikendi","Livik","Karakin","Deston"].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Perspective</label>
                      <select className="input" value={form.perspective} onChange={(e) => set("perspective", e.target.value)}>
                        <option value="TPP">TPP</option>
                        <option value="FPP">FPP</option>
                      </select>
                    </div>
                    <Input
                      label="Team Size"
                      type="number"
                      value={form.teamSize}
                      onChange={(e) => set("teamSize", e.target.value)}
                      min="1"
                      max="4"
                      required
                    />
                    <Input
                      label="Max Participants"
                      type="number"
                      value={form.maxParticipants}
                      onChange={(e) => set("maxParticipants", e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* SCHEDULE */}
            {activeSection === "schedule" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                      <FiCalendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Schedule & Timing</h3>
                      <p className="text-slate-600 text-sm">Set registration and tournament dates</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Registration Start</label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={form.registrationStartDate}
                        onChange={(e) => set("registrationStartDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Registration End</label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={form.registrationEndDate}
                        onChange={(e) => set("registrationEndDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tournament Start</label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={form.tournamentStartDate}
                        onChange={(e) => set("tournamentStartDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tournament End</label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={form.tournamentEndDate}
                        onChange={(e) => set("tournamentEndDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Input
                      label="Total Matches"
                      type="number"
                      value={form.totalMatches}
                      onChange={(e) => set("totalMatches", e.target.value)}
                      min="1"
                      required
                    />
                    <Input
                      label="Matches per Day"
                      type="number"
                      value={form.matchesPerDay}
                      onChange={(e) => set("matchesPerDay", e.target.value)}
                      min="1"
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                      <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
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
                </Card>
              </div>
            )}

            {/* PRICING */}
            {activeSection === "pricing" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                      <FiDollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Pricing & Prize Pool</h3>
                      <p className="text-slate-600 text-sm">Configure service fee and prize pool</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isFree"
                          checked={form.isFree}
                          onChange={(e) => set("isFree", e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        <label htmlFor="isFree" className="text-sm font-medium text-slate-700">
                          Free Tournament
                        </label>
                      </div>
                      {form.isFree && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          <FiCheck className="w-3 h-3" />
                          No service fee required
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Service Fee (₹)"
                      type="number"
                      value={form.serviceFee}
                      onChange={(e) => set("serviceFee", e.target.value)}
                      disabled={form.isFree}
                      min="0"
                    />
                    <Input
                      label="Prize Pool (₹)"
                      type="number"
                      value={form.prizePool}
                      onChange={(e) => set("prizePool", e.target.value)}
                      min="0"
                      icon={<GiTrophy className="w-4 h-4" />}
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Fee Type</label>
                      <div className="input bg-slate-50 text-slate-500">
                        {form.isFree ? "Free Entry" : "Paid Entry"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">Featured Images (Optional)</label>
                      <span className="text-xs text-slate-500">Recommended: 1200x400</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Banner Image URL" value={form.bannerImage} onChange={(e) => set("bannerImage", e.target.value)} />
                      <Input placeholder="Featured Image URL" value={form.featuredImage} onChange={(e) => set("featuredImage", e.target.value)} />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* SETTINGS */}
            {activeSection === "settings" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                      <FiSettings className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Tournament Settings</h3>
                      <p className="text-slate-600 text-sm">Configure match settings and rules</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Total Matches" type="number" value={form.totalMatches} onChange={(e) => set("totalMatches", e.target.value)} min="1" />
                    <Input label="Matches per Day" type="number" value={form.matchesPerDay} onChange={(e) => set("matchesPerDay", e.target.value)} min="1" />
                    <Input
                      label="Kill Points"
                      type="number"
                      value={form.killPoints}
                      onChange={(e) => set("killPoints", e.target.value)}
                      min="0"
                      step="0.5"
                      helperText="Points awarded per kill"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <GiCrossedSwords className="w-5 h-5 text-slate-600" />
                      <label className="text-sm font-medium text-slate-700">Placement Points Configuration</label>
                    </div>

                    <textarea
                      className="input font-mono text-sm"
                      rows={10}
                      value={JSON.stringify(form.placementPoints, null, 2)}
                      onChange={(e) => {
                        try {
                          setJsonError(null);
                          set("placementPoints", JSON.parse(e.target.value));
                        } catch {
                          setJsonError("Invalid JSON in placement points.");
                        }
                      }}
                    />

                    {jsonError && <div className="mt-2 text-xs text-red-600">{jsonError}</div>}

                    <div className="text-xs text-slate-500 mt-2">
                      Format: [{"{"}"placement": 1, "points": 15{"}"}]
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* SCORING */}
            {activeSection === "scoring" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center">
                      <GiRank3 className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Scoring System</h3>
                      <p className="text-slate-600 text-sm">Configure points for kills and placements</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <GiTargetPrize className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-slate-800">Kill Points</h4>
                      </div>

                      <Input
                        label="Points per Kill"
                        type="number"
                        value={form.killPoints}
                        onChange={(e) => set("killPoints", e.target.value)}
                        min="0"
                        step="0.5"
                      />

                      <div className="text-xs text-slate-600 mt-2">
                        Each kill awards {Number(form.killPoints || 0)} points
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <GiRank3 className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-slate-800">Placement Points</h4>
                      </div>

                      <div className="text-sm text-slate-600">Current configuration</div>

                      <div className="mt-3 max-h-40 overflow-y-auto">
                        {(form.placementPoints || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 border-b border-slate-200 last:border-0">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold">
                                #{item.placement}
                              </div>
                              <span className="text-sm text-slate-700">{item.placement} Place</span>
                            </div>
                            <span className="font-bold text-green-600">{item.points} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ADVANCED */}
            {activeSection === "advanced" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                      <MdSecurity className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Advanced Settings</h3>
                      <p className="text-slate-600 text-sm">Room details and additional configs</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Room ID"
                      value={form.roomId}
                      onChange={(e) => set("roomId", e.target.value)}
                      placeholder="Enter custom room ID"
                      helperText="Visible only to paid participants (Room page)."
                    />
                    <Input
                      label="Room Password"
                      value={form.roomPassword}
                      onChange={(e) => set("roomPassword", e.target.value)}
                      placeholder="Enter room password"
                      helperText="Visible only to paid participants (Room page)."
                      type="password"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FiEye className="w-4 h-4 text-slate-600" />
                      <label className="text-sm font-medium text-slate-700">Additional Configuration</label>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                      <div className="text-sm text-slate-600">
                        You can create the tournament now and update any optional fields later from Edit page.
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Fill required fields and click "Create Tournament"
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const sectionIndex = sections.findIndex((s) => s.id === activeSection);
                      if (sectionIndex > 0) setActiveSection(sections[sectionIndex - 1].id);
                    }}
                    disabled={activeSection === "basic"}
                  >
                    Previous
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      const sectionIndex = sections.findIndex((s) => s.id === activeSection);
                      if (sectionIndex < sections.length - 1) setActiveSection(sections[sectionIndex + 1].id);
                    }}
                    disabled={activeSection === "advanced"}
                  >
                    Next
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    loading={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    <FiSave className="w-4 h-4 mr-2" />
                    {loading ? "Creating..." : "Create Tournament"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}