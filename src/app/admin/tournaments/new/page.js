"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { 
  FiPlus, 
  FiCalendar, 
  FiDollarSign, 
  FiUsers,
  FiMapPin,
  FiEye,
  FiAward,
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

export default function NewTournamentPage() {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

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

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        teamSize: Number(form.teamSize),
        maxParticipants: Number(form.maxParticipants),
        serviceFee: Number(form.serviceFee),
        prizePool: Number(form.prizePool),
        killPoints: Number(form.killPoints),
        totalMatches: Number(form.totalMatches),
        matchesPerDay: Number(form.matchesPerDay)
      };

      const res = await api.adminCreateTournament(payload);
      alert("✅ Tournament created successfully!");
      window.location.href = `/admin/tournaments/${res.data._id}/edit`;
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const sections = [
    { id: "basic", label: "Basic Info", icon: <GiTrophy className="w-4 h-4" /> },
    { id: "schedule", label: "Schedule", icon: <FiCalendar className="w-4 h-4" /> },
    { id: "pricing", label: "Pricing", icon: <FiDollarSign className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <FiSettings className="w-4 h-4" /> },
    { id: "scoring", label: "Scoring", icon: <GiRank3 className="w-4 h-4" /> },
    { id: "advanced", label: "Advanced", icon: <MdSecurity className="w-4 h-4" /> }
  ];

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
            <Button variant="outline" onClick={() => window.history.back()}>
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={onSubmit} loading={loading}>
              <FiSave className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Tournament"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
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

            {/* Preview Stats */}
            <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-slate-800 mb-3">Tournament Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium">{form.tournamentType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Prize Pool:</span>
                  <span className="font-bold text-green-600">₹{form.prizePool}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Entry:</span>
                  <span className="font-medium">
                    {form.isFree ? "FREE" : `₹${form.serviceFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    form.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                    form.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    form.status === 'registration_open' ? 'bg-green-100 text-green-700' :
                    form.status === 'ongoing' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {form.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3">
          <form onSubmit={onSubmit}>
            {/* Basic Info Section */}
            {activeSection === "basic" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <GiTrophy className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
                      <p className="text-slate-600 text-sm">Set up tournament title, description and basic details</p>
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
                      placeholder="Describe your tournament rules, format, and other details..."
                      multiline
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Map
                      </label>
                      <select 
                        className="input"
                        value={form.map}
                        onChange={(e) => set("map", e.target.value)}
                      >
                        {["Erangel","Miramar","Sanhok","Vikendi","Livik","Karakin","Deston"].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Perspective
                      </label>
                      <select 
                        className="input"
                        value={form.perspective}
                        onChange={(e) => set("perspective", e.target.value)}
                      >
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
                    />
                    <Input
                      label="Max Participants"
                      type="number"
                      value={form.maxParticipants}
                      onChange={(e) => set("maxParticipants", e.target.value)}
                      min="1"
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* Schedule Section */}
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
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Registration Start
                      </label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={form.registrationStartDate}
                        onChange={(e) => set("registrationStartDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Registration End
                      </label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={form.registrationEndDate}
                        onChange={(e) => set("registrationEndDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Tournament Start
                      </label>
                      <input
                        type="datetime-local"
                        className="input"
                        value={form.tournamentStartDate}
                        onChange={(e) => set("tournamentStartDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Tournament End
                      </label>
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
                    />
                    <Input
                      label="Matches per Day"
                      type="number"
                      value={form.matchesPerDay}
                      onChange={(e) => set("matchesPerDay", e.target.value)}
                      min="1"
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Status
                      </label>
                      <select 
                        className="input"
                        value={form.status}
                        onChange={(e) => set("status", e.target.value)}
                      >
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

            {/* Pricing Section */}
            {activeSection === "pricing" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                      <FiDollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Pricing & Prize Pool</h3>
                      <p className="text-slate-600 text-sm">Configure entry fees and prize distribution</p>
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
                          No entry fee required
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
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Fee Type
                      </label>
                      <div className="input bg-slate-50 text-slate-500">
                        {form.isFree ? "Free Entry" : "Paid Entry"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-slate-700">
                        Featured Images (Optional)
                      </label>
                      <span className="text-xs text-slate-500">Recommended size: 1200x400</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Banner Image URL"
                        value={form.bannerImage}
                        onChange={(e) => set("bannerImage", e.target.value)}
                      />
                      <Input
                        placeholder="Featured Image URL"
                        value={form.featuredImage}
                        onChange={(e) => set("featuredImage", e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Settings Section */}
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
                    <Input
                      label="Total Matches"
                      type="number"
                      value={form.totalMatches}
                      onChange={(e) => set("totalMatches", e.target.value)}
                      min="1"
                    />
                    <Input
                      label="Matches per Day"
                      type="number"
                      value={form.matchesPerDay}
                      onChange={(e) => set("matchesPerDay", e.target.value)}
                      min="1"
                    />
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
                      <label className="text-sm font-medium text-slate-700">
                        Placement Points Configuration
                      </label>
                    </div>
                    <textarea
                      className="input font-mono text-sm"
                      rows={10}
                      value={JSON.stringify(form.placementPoints, null, 2)}
                      onChange={(e) => {
                        try {
                          set("placementPoints", JSON.parse(e.target.value));
                        } catch {}
                      }}
                    />
                    <div className="text-xs text-slate-500 mt-2">
                      Edit the JSON array to modify placement points. Format: [{"{"}"placement": 1, "points": 15{"}"}]
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Scoring Section */}
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
                        Each kill awards {form.killPoints} point{form.killPoints !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <GiRank3 className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-slate-800">Placement Points</h4>
                      </div>
                      <div className="text-sm text-slate-600">
                        Current configuration for top 8 placements
                      </div>
                      <div className="mt-3 max-h-40 overflow-y-auto">
                        {form.placementPoints.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 border-b border-slate-200 last:border-0">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold">
                                #{item.placement}
                              </div>
                              <span className="text-sm text-slate-700">
                                {item.placement === 1 ? '1st Place' : 
                                 item.placement === 2 ? '2nd Place' : 
                                 item.placement === 3 ? '3rd Place' : 
                                 `${item.placement}th Place`}
                              </span>
                            </div>
                            <span className="font-bold text-green-600">{item.points} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-sm font-medium text-slate-700 mb-2">
                      Quick Calculation Example
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
                      A player with 5 kills and 2nd place would get: (5 × {form.killPoints}) + {form.placementPoints.find(p => p.placement === 2)?.points || 12} = {5 * form.killPoints + (form.placementPoints.find(p => p.placement === 2)?.points || 12)} points
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Advanced Section */}
            {activeSection === "advanced" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                      <MdSecurity className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Advanced Settings</h3>
                      <p className="text-slate-600 text-sm">Room details and additional configurations</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Room ID"
                      value={form.roomId}
                      onChange={(e) => set("roomId", e.target.value)}
                      placeholder="Enter custom room ID"
                      helperText="Custom room ID for tournament matches"
                    />
                    <Input
                      label="Room Password"
                      value={form.roomPassword}
                      onChange={(e) => set("roomPassword", e.target.value)}
                      placeholder="Enter room password"
                      helperText="Password for room access"
                      type="password"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FiEye className="w-4 h-4 text-slate-600" />
                      <label className="text-sm font-medium text-slate-700">
                        Additional Configuration
                      </label>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                      <div className="text-sm text-slate-600">
                        These settings are optional. You can configure them after tournament creation.
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
                  Fill all required fields and click "Create Tournament"
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => {
                      const sectionIndex = sections.findIndex(s => s.id === activeSection);
                      if (sectionIndex > 0) setActiveSection(sections[sectionIndex - 1].id);
                    }}
                    disabled={activeSection === "basic"}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      const sectionIndex = sections.findIndex(s => s.id === activeSection);
                      if (sectionIndex < sections.length - 1) setActiveSection(sections[sectionIndex + 1].id);
                    }}
                    disabled={activeSection === "advanced"}
                  >
                    Next
                  </Button>
                  <Button type="submit" loading={loading} className="bg-gradient-to-r from-green-500 to-emerald-500">
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