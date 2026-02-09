"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { 
  FiUpload, 
  FiPlus, 
  FiUsers, 
  FiTarget, 
  FiAward,
  FiCalendar,
  FiMap,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { 
  GiTrophy,
  GiRank3,
  GiCrossedSwords,
  GiBurningForest,
  GiDesert,
  GiJungle,
  GiSnowflake1,
  GiIsland,
  GiCaveEntrance,
  GiModernCity
} from "react-icons/gi";
import { MdOutlineEmojiEvents } from "react-icons/md";

function emptyRow() {
  return { teamId: "", teamName: "", userId: "", placement: 1, kills: 0 };
}

export default function AdminResultsPage({ params }) {
  const { id } = React.use(params);
  const [t, setT] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [matchNumber, setMatchNumber] = useState(1);
  const [matchDay, setMatchDay] = useState(1);
  const [map, setMap] = useState("Erangel");
  const [matchType, setMatchType] = useState("TPP");

  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, pRes] = await Promise.all([
        api.getTournament(id),
        api.adminParticipants(id)
      ]);
      setT(tRes.data);
      setParticipants(pRes.data);
      setMap(tRes.data.map || "Erangel");
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isSquad = useMemo(() => t?.tournamentType === "squad", [t]);

  const squadTeams = useMemo(() => {
    if (!isSquad || !Array.isArray(participants)) return [];
    return participants.map((x) => ({
      id: x._id,
      name: x.teamName,
      captain: x.captain?.inGameName
    }));
  }, [participants, isSquad]);

  const mapIcons = {
    "Erangel": <GiBurningForest className="w-5 h-5" />,
    "Miramar": <GiDesert className="w-5 h-5" />,
    "Sanhok": <GiJungle className="w-5 h-5" />,
    "Vikendi": <GiSnowflake1 className="w-5 h-5" />,
    "Livik": <GiIsland className="w-5 h-5" />,
    "Karakin": <GiCaveEntrance className="w-5 h-5" />,
    "Deston": <GiModernCity className="w-5 h-5" />
  };

  function updateRow(i, key, value) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
    // Clear validation error for this field
    if (validationErrors[`row_${i}_${key}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`row_${i}_${key}`];
        return newErrors;
      });
    }
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(index) {
    if (rows.length > 1) {
      setRows(prev => prev.filter((_, i) => i !== index));
      // Clear validation errors for removed row
      const newErrors = { ...validationErrors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`row_${index}_`)) {
          delete newErrors[key];
        }
      });
      setValidationErrors(newErrors);
    }
  }

  function validateForm() {
    const errors = {};
    
    if (!matchNumber || matchNumber < 1) {
      errors.matchNumber = "Match number must be at least 1";
    }
    
    if (!matchDay || matchDay < 1) {
      errors.matchDay = "Day must be at least 1";
    }

    rows.forEach((row, index) => {
      if (isSquad) {
        if (!row.teamId) {
          errors[`row_${index}_teamId`] = "Team selection required";
        }
      } else {
        if (!row.userId?.trim()) {
          errors[`row_${index}_userId`] = "User ID required";
        }
      }
      
      const placement = Number(row.placement);
      if (isNaN(placement) || placement < 1 || placement > 100) {
        errors[`row_${index}_placement`] = "Placement must be between 1-100";
      }
      
      const kills = Number(row.kills);
      if (isNaN(kills) || kills < 0 || kills > 99) {
        errors[`row_${index}_kills`] = "Kills must be 0-99";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit() {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const results = rows
        .filter((r) => (isSquad ? r.teamId : r.userId.trim()))
        .map((r) => {
          if (isSquad) {
            const team = squadTeams.find((t) => t.id === r.teamId);
            return {
              teamName: team?.name,
              placement: Number(r.placement),
              kills: Number(r.kills)
            };
          }
          return {
            userId: r.userId.trim(),
            placement: Number(r.placement),
            kills: Number(r.kills)
          };
        });

      await api.adminSubmitResults(id, {
        matchNumber: Number(matchNumber),
        matchDay: Number(matchDay),
        map,
        matchType,
        results
      });

      // Reset form with success feedback
      setRows([emptyRow(), emptyRow(), emptyRow()]);
      setMatchNumber(prev => prev + 1);
      
      // Show success message
      alert("✅ Results submitted successfully!");
      
      // Optionally reload data
      await loadData();
    } catch (e) {
      alert(`❌ Error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <div className="text-slate-700 font-medium">Loading tournament data...</div>
        </div>
      </div>
    );
  }

  if (!t) return <div className="text-sm text-slate-600">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Upload Match Results</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                <GiTrophy className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-slate-800">{t.title}</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-slate-400"></div>
              <div className="text-sm text-slate-600">{t.tournamentType.toUpperCase()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={loadData}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Tournament Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Participants</div>
              <div className="text-xl font-bold text-slate-800">
                {participants?.length || 0}/{t.maxParticipants}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <GiRank3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Matches Played</div>
              <div className="text-xl font-bold text-slate-800">
                {matchNumber - 1} / {t.totalMatches}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
              <GiCrossedSwords className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Type</div>
              <div className="text-xl font-bold text-slate-800">
                {t.tournamentType.toUpperCase()}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Match Details */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
            <FiCalendar className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Match Details</h3>
            <p className="text-slate-600 text-sm">Enter match information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              label="Match Number"
              type="number"
              value={matchNumber}
              onChange={(e) => setMatchNumber(e.target.value)}
              min="1"
              max={t.totalMatches}
              error={validationErrors.matchNumber}
              icon={<MdOutlineEmojiEvents className="w-4 h-4" />}
            />
          </div>
          
          <div>
            <Input
              label="Day"
              type="number"
              value={matchDay}
              onChange={(e) => setMatchDay(e.target.value)}
              min="1"
              error={validationErrors.matchDay}
              icon={<FiCalendar className="w-4 h-4" />}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Map
            </label>
            <div className="relative">
              <select 
                className="input pl-10"
                value={map}
                onChange={(e) => setMap(e.target.value)}
              >
                {["Erangel","Miramar","Sanhok","Vikendi","Livik","Karakin","Deston"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                {mapIcons[map]}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Perspective
            </label>
            <select 
              className="input"
              value={matchType}
              onChange={(e) => setMatchType(e.target.value)}
            >
              <option value="TPP">TPP</option>
              <option value="FPP">FPP</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
            <FiAward className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Match Results</h3>
            <p className="text-slate-600 text-sm">
              Enter results for each {isSquad ? 'team' : 'player'}
              <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                Total entries: {rows.length}
              </span>
            </p>
          </div>
        </div>

        {/* Results Form */}
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">#</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    {isSquad ? "Team" : "User ID"}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Placement</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Kills</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {isSquad ? (
                        <div>
                          <select
                            className={`input ${validationErrors[`row_${idx}_teamId`] ? 'border-red-500' : ''}`}
                            value={row.teamId}
                            onChange={(e) => updateRow(idx, "teamId", e.target.value)}
                          >
                            <option value="">Select team</option>
                            {squadTeams.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.name} ({team.captain})
                              </option>
                            ))}
                          </select>
                          {validationErrors[`row_${idx}_teamId`] && (
                            <div className="text-xs text-red-500 mt-1">
                              {validationErrors[`row_${idx}_teamId`]}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <Input
                            value={row.userId}
                            onChange={(e) => updateRow(idx, "userId", e.target.value)}
                            placeholder="User ID (e.g., 65f...)"
                            error={validationErrors[`row_${idx}_userId`]}
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <Input
                          type="number"
                          value={row.placement}
                          onChange={(e) => updateRow(idx, "placement", e.target.value)}
                          min="1"
                          max="100"
                          error={validationErrors[`row_${idx}_placement`]}
                          className="w-24"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <Input
                          type="number"
                          value={row.kills}
                          onChange={(e) => updateRow(idx, "kills", e.target.value)}
                          min="0"
                          max="99"
                          error={validationErrors[`row_${idx}_kills`]}
                          className="w-24"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => removeRow(idx)}
                        disabled={rows.length <= 1}
                        className="h-8 w-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Remove row"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={addRow}
              className="flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Add Another Row
            </Button>
            
            <div className="text-sm text-slate-600 flex items-center gap-2 ml-auto">
              <FiAlertCircle className="w-4 h-4" />
              Fill all fields for each row
            </div>
          </div>
        </div>
      </Card>

      {/* Points Preview */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center">
            <FiTarget className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Points Calculation</h3>
            <p className="text-slate-600 text-sm">Based on tournament scoring system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <h4 className="font-semibold text-slate-800 mb-3">Current Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Kill Points:</span>
                <span className="font-bold">{t.killPoints} per kill</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Scoring Type:</span>
                <span className="font-bold">{t.perspective}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Matches:</span>
                <span className="font-bold">{t.totalMatches}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <h4 className="font-semibold text-slate-800 mb-3">Example Calculation</h4>
            <div className="text-sm text-slate-600">
              <div className="mb-2">For a player with 5 kills and 2nd place:</div>
              <div className="font-mono bg-white/50 p-2 rounded">
                (5 × {t.killPoints}) + 12 = {5 * t.killPoints + 12} points
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Submit Section */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
        <div>
          <div className="font-medium text-slate-800">Ready to submit results?</div>
          <div className="text-sm text-slate-600">
            {rows.filter(r => isSquad ? r.teamId : r.userId.trim()).length} valid entries
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setRows([emptyRow(), emptyRow(), emptyRow()])}
          >
            Clear All
          </Button>
          
          <Button 
            onClick={submit}
            loading={submitting}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <FiUpload className="w-4 h-4 mr-2" />
            {submitting ? "Submitting..." : "Submit Match Results"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-slate-600">Tournament Status</div>
          <div className="font-medium text-slate-800 capitalize">
            {t.status.replace('_', ' ')}
          </div>
        </div>
        
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-slate-600">Participants Registered</div>
          <div className="font-medium text-slate-800">
            {participants?.length || 0} / {t.maxParticipants}
          </div>
        </div>
        
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-slate-600">Next Match</div>
          <div className="font-medium text-slate-800">
            #{matchNumber} of {t.totalMatches}
          </div>
        </div>
      </div>
    </div>
  );
}