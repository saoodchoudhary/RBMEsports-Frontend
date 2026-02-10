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
  FiTrash2,
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
  return { teamId: "", userId: "", placement: 1, kills: 0 };
}

export default function AdminResultsPage({ params }) {
  const {id} = React.use(params);

  const [t, setT] = useState(null);
  const [participantsData, setParticipantsData] = useState(null); // squad: array teams, solo/duo: tournament object
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [matchNumber, setMatchNumber] = useState(1);
  const [matchDay, setMatchDay] = useState(1);
  const [map, setMap] = useState("Erangel");
  const [matchType, setMatchType] = useState("TPP");

  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()]);
  const [validationErrors, setValidationErrors] = useState({});

  const mapIcons = {
    Erangel: <GiBurningForest className="w-5 h-5" />,
    Miramar: <GiDesert className="w-5 h-5" />,
    Sanhok: <GiJungle className="w-5 h-5" />,
    Vikendi: <GiSnowflake1 className="w-5 h-5" />,
    Livik: <GiIsland className="w-5 h-5" />,
    Karakin: <GiCaveEntrance className="w-5 h-5" />,
    Deston: <GiModernCity className="w-5 h-5" />
  };

  useEffect(() => {
    if (!id) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const [tRes, pRes] = await Promise.all([api.getTournament(id), api.adminParticipants(id)]);
      setT(tRes.data);
      setParticipantsData(pRes.data);
      setMap(tRes.data.map || "Erangel");
    } catch (error) {
      console.error("Failed to load data:", error);
      alert("Failed to load tournament/participants");
    } finally {
      setLoading(false);
    }
  }

  const isSquad = useMemo(() => t?.tournamentType === "squad", [t]);

  // Squad teams from adminParticipants (array)
  const squadTeams = useMemo(() => {
    if (!isSquad || !Array.isArray(participantsData)) return [];
    return participantsData.map((x) => ({
      id: x._id,
      name: x.teamName,
      captain: x.captain?.inGameName || x.captain?.userId?.name || "Captain"
    }));
  }, [participantsData, isSquad]);

  // Solo/duo players from adminParticipants (tournament object w/ participants)
  const soloDuoPlayers = useMemo(() => {
    if (isSquad) return [];
    const list = participantsData?.participants || [];
    return list.map((p) => ({
      id: p.userId?._id || p.userId, // populated or raw
      label: `${p.inGameName || p.userId?.name || "Player"} • ${p.bgmiId || "BGMI"}`
    }));
  }, [participantsData, isSquad]);

  const participantCount = useMemo(() => {
    if (!t) return 0;
    if (isSquad) return Array.isArray(participantsData) ? participantsData.length : 0;
    return (participantsData?.participants || []).length;
  }, [participantsData, isSquad, t]);

  function updateRow(i, key, value) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
    if (validationErrors[`row_${i}_${key}`]) {
      setValidationErrors((prev) => {
        const n = { ...prev };
        delete n[`row_${i}_${key}`];
        return n;
      });
    }
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(index) {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function validateForm() {
    const errors = {};

    const mn = Number(matchNumber);
    const md = Number(matchDay);

    if (!mn || mn < 1) errors.matchNumber = "Match number must be at least 1";
    if (t?.totalMatches && mn > Number(t.totalMatches)) errors.matchNumber = `Max match is ${t.totalMatches}`;
    if (!md || md < 1) errors.matchDay = "Day must be at least 1";

    const used = new Set();

    rows.forEach((row, index) => {
      if (isSquad) {
        if (!row.teamId) errors[`row_${index}_teamId`] = "Team required";
        if (row.teamId && used.has(row.teamId)) errors[`row_${index}_teamId`] = "Duplicate team";
        if (row.teamId) used.add(row.teamId);
      } else {
        if (!row.userId) errors[`row_${index}_userId`] = "Player required";
        if (row.userId && used.has(row.userId)) errors[`row_${index}_userId`] = "Duplicate player";
        if (row.userId) used.add(row.userId);
      }

      const placement = Number(row.placement);
      if (Number.isNaN(placement) || placement < 1 || placement > 100) {
        errors[`row_${index}_placement`] = "Placement must be 1-100";
      }

      const kills = Number(row.kills);
      if (Number.isNaN(kills) || kills < 0 || kills > 99) {
        errors[`row_${index}_kills`] = "Kills must be 0-99";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit() {
    if (!t) return;
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const results = rows
        .filter((r) => (isSquad ? r.teamId : r.userId))
        .map((r) => {
          if (isSquad) {
            const team = squadTeams.find((x) => x.id === r.teamId);
            return {
              teamName: team?.name, // backend expects teamName
              placement: Number(r.placement),
              kills: Number(r.kills)
            };
          }
          return {
            userId: String(r.userId), // backend expects ObjectId string
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

      alert("✅ Results submitted successfully!");
      setRows([emptyRow(), emptyRow(), emptyRow()]);
      setMatchNumber((p) => Number(p) + 1);
      await loadData();
    } catch (e) {
      alert(`❌ Error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (!id) return <div className="text-sm text-red-600">Missing tournament id.</div>;

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

  if (!t) return <div className="text-sm text-slate-600">Unable to load tournament.</div>;

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
          <Button variant="outline" onClick={loadData} disabled={loading}>
            Refresh
          </Button>
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
                {participantCount}/{t.maxParticipants}
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
                {Number(matchNumber) - 1} / {t.totalMatches}
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
              <div className="text-xl font-bold text-slate-800">{t.tournamentType.toUpperCase()}</div>
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
          <Input
            label="Day"
            type="number"
            value={matchDay}
            onChange={(e) => setMatchDay(e.target.value)}
            min="1"
            error={validationErrors.matchDay}
            icon={<FiCalendar className="w-4 h-4" />}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Map</label>
            <div className="relative">
              <select className="input pl-10" value={map} onChange={(e) => setMap(e.target.value)}>
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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Perspective</label>
            <select className="input" value={matchType} onChange={(e) => setMatchType(e.target.value)}>
              <option value="TPP">TPP</option>
              <option value="FPP">FPP</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
            <FiAward className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Match Results</h3>
            <p className="text-slate-600 text-sm">
              Enter results for each {isSquad ? "team" : "player"}{" "}
              <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                Total entries: {rows.length}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-4 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">{isSquad ? "Team" : "Player"}</th>
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
                      <>
                        <select
                          className={`input ${validationErrors[`row_${idx}_teamId`] ? "border-red-500" : ""}`}
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
                          <div className="text-xs text-red-500 mt-1">{validationErrors[`row_${idx}_teamId`]}</div>
                        )}
                      </>
                    ) : (
                      <>
                        <select
                          className={`input ${validationErrors[`row_${idx}_userId`] ? "border-red-500" : ""}`}
                          value={row.userId}
                          onChange={(e) => updateRow(idx, "userId", e.target.value)}
                        >
                          <option value="">Select player</option>
                          {soloDuoPlayers.map((p) => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                          ))}
                        </select>
                        {validationErrors[`row_${idx}_userId`] && (
                          <div className="text-xs text-red-500 mt-1">{validationErrors[`row_${idx}_userId`]}</div>
                        )}
                      </>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <Input
                      type="number"
                      value={row.placement}
                      onChange={(e) => updateRow(idx, "placement", e.target.value)}
                      min="1"
                      max="100"
                      error={validationErrors[`row_${idx}_placement`]}
                      className="w-24"
                    />
                  </td>

                  <td className="py-3 px-4">
                    <Input
                      type="number"
                      value={row.kills}
                      onChange={(e) => updateRow(idx, "kills", e.target.value)}
                      min="0"
                      max="99"
                      error={validationErrors[`row_${idx}_kills`]}
                      className="w-24"
                    />
                  </td>

                  <td className="py-3 px-4">
                    <button
                      type="button"
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

          <div className="flex gap-3">
            <Button variant="outline" onClick={addRow} className="flex items-center gap-2" type="button">
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

      {/* Submit */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
        <div>
          <div className="font-medium text-slate-800">Ready to submit results?</div>
          <div className="text-sm text-slate-600">
            {rows.filter((r) => (isSquad ? r.teamId : r.userId)).length} valid entries
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setRows([emptyRow(), emptyRow(), emptyRow()])} type="button">
            Clear All
          </Button>

          <Button
            onClick={submit}
            loading={submitting}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            type="button"
          >
            <FiUpload className="w-4 h-4 mr-2" />
            {submitting ? "Submitting..." : "Submit Match Results"}
          </Button>
        </div>
      </div>
    </div>
  );
}