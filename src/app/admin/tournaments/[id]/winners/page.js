"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  FiAward,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiPlus,
  FiSave,
  FiX,
  FiCheck,
  FiUser,
  FiHash
} from "react-icons/fi";
import { GiTrophy, GiTeamIdea, GiCrossedSwords } from "react-icons/gi";
import { MdOutlineEmojiEvents } from "react-icons/md";

function emptyWinner() {
  return { teamId: "", userId: "", rank: 1, prizeAmount: 0, totalKills: 0, totalPoints: 0 };
}

export default function AdminWinnersPage({ params }) {
  const {id} = React.use(params);

  const [tournament, setTournament] = useState(null);
  const [participantsData, setParticipantsData] = useState(null); // squad: array teams, solo/duo: tournament object
  const [winners, setWinners] = useState([emptyWinner(), emptyWinner(), emptyWinner()]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const [tRes, pRes] = await Promise.all([api.getTournament(id), api.adminParticipants(id)]);
        setTournament(tRes.data);
        setParticipantsData(pRes.data);
      } catch (error) {
        console.error("Failed to load data:", error);
        alert("Failed to load tournament/participants");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const isSquad = tournament?.tournamentType === "squad";

  const squadTeams = useMemo(() => {
    if (!isSquad || !Array.isArray(participantsData)) return [];
    return participantsData.map((team, index) => ({
      id: team._id,
      name: team.teamName || `Team ${index + 1}`,
      captain: team.captain?.userId?.name || team.captain?.inGameName || "Unknown",
      points: team.totalPoints || 0,
      kills: team.totalKills || 0
    }));
  }, [participantsData, isSquad]);

  const soloDuoPlayers = useMemo(() => {
    if (isSquad) return [];
    const list = participantsData?.participants || [];
    return list.map((p, index) => ({
      id: p.userId?._id || p.userId,
      name: p.userId?.name || p.inGameName || `Player ${index + 1}`,
      bgmiId: p.bgmiId || "N/A",
      points: p.totalPoints || 0,
      kills: p.totalKills || 0
    }));
  }, [participantsData, isSquad]);

  function updateWinner(index, key, value) {
    setWinners((prev) => prev.map((w, idx) => (idx === index ? { ...w, [key]: value } : w)));
  }

  function addWinner() {
    setWinners((prev) => [...prev, { ...emptyWinner(), rank: prev.length + 1 }]);
  }

  function removeWinner(index) {
    if (winners.length <= 1) return;
    setWinners((prev) => prev.filter((_, idx) => idx !== index));
  }

  const totalPrize = useMemo(() => {
    return winners.reduce((sum, w) => sum + Number(w.prizeAmount || 0), 0);
  }, [winners]);

  const pool = Number(tournament?.prizePool || 0);
  const remaining = pool - totalPrize;

  function validateBeforeSubmit() {
    if (totalPrize > pool) return "Prize pool exceeded. Reduce prize amounts.";

    const ranks = winners
      .filter((w) => Number(w.prizeAmount) > 0)
      .map((w) => Number(w.rank))
      .filter((r) => r > 0);

    const unique = new Set(ranks);
    if (unique.size !== ranks.length) return "Ranks must be unique.";

    for (const w of winners) {
      if (Number(w.prizeAmount || 0) <= 0) continue;
      if (isSquad && !w.teamId) return "Select team for all winners having prize.";
      if (!isSquad && !w.userId) return "Select player for all winners having prize.";
    }

    return null;
  }

  async function submitWinners() {
    const err = validateBeforeSubmit();
    if (err) return alert(err);

    setSubmitting(true);
    try {
      const payload = {
        winners: winners
          .filter((w) => Number(w.rank) > 0 && Number(w.prizeAmount) > 0)
          .map((w) => ({
            teamId: isSquad ? w.teamId : undefined,
            userId: !isSquad ? w.userId : undefined,
            rank: Number(w.rank),
            prizeAmount: Number(w.prizeAmount),
            totalKills: Number(w.totalKills || 0),
            totalPoints: Number(w.totalPoints || 0)
          }))
      };

      if (payload.winners.length === 0) {
        alert("Please add at least one winner with valid prize amount");
        return;
      }

      await api.adminDeclareWinners(id, payload);
      alert("✅ Winners declared successfully!");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (!id) return <div className="text-sm text-red-600">Missing tournament id.</div>;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 skeleton rounded-lg w-48"></div>
        <div className="h-4 skeleton rounded w-64"></div>
        <div className="card p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 skeleton rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl text-slate-400 mb-4">🏆</div>
        <div className="text-lg font-medium text-slate-700">Tournament not found</div>
        <div className="text-slate-600 mt-2">Unable to load tournament data</div>
      </div>
    );
  }

  const joinedCount = isSquad
    ? (Array.isArray(participantsData) ? participantsData.length : 0)
    : (participantsData?.participants?.length || 0);

  const availableCount = isSquad ? squadTeams.length : soloDuoPlayers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Declare Winners</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-sm font-medium">
                {tournament.tournamentType.toUpperCase()}
              </div>
              <div className="text-slate-600">{tournament.title}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">₹{pool.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Total Prize Pool</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <GiTrophy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Tournament Type</div>
              <div className="font-bold text-slate-800">
                {tournament.tournamentType.charAt(0).toUpperCase() + tournament.tournamentType.slice(1)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Joined</div>
              <div className="font-bold text-slate-800">{joinedCount}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <MdOutlineEmojiEvents className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Available</div>
              <div className="font-bold text-slate-800">{availableCount}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FiAward className="w-5 h-5" />
            Winners Configuration
          </h2>
          <p className="text-slate-600 text-sm mt-1">Assign ranks and prize amounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addWinner} className="flex items-center gap-2" type="button">
            <FiPlus className="w-4 h-4" />
            Add Winner
          </Button>
          <Button
            onClick={submitWinners}
            loading={submitting}
            disabled={totalPrize > pool}
            className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center gap-2"
            type="button"
          >
            <FiSave className="w-4 h-4" />
            {submitting ? "Declaring..." : "Declare Winners"}
          </Button>
        </div>
      </div>

      {/* Summary */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Total Prize Distribution</div>
              <div className="text-xl font-bold text-green-700">₹{totalPrize.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600">Remaining Prize Pool</div>
            <div className={`text-lg font-bold ${remaining < 0 ? "text-red-600" : "text-blue-600"}`}>
              ₹{remaining.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Winners List */}
      <div className="space-y-4">
        {winners.map((winner, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold
                    ${index === 0 ? "bg-gradient-to-br from-yellow-500 to-amber-500" :
                      index === 1 ? "bg-gradient-to-br from-slate-400 to-slate-500" :
                      index === 2 ? "bg-gradient-to-br from-amber-700 to-amber-800" :
                      "bg-gradient-to-br from-slate-700 to-slate-800"}
                  `}
                >
                  #{winner.rank || index + 1}
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    {index === 0 ? "1st Place" : index === 1 ? "2nd Place" : index === 2 ? "3rd Place" : `${index + 1}th Place`}
                  </div>
                  <div className="text-sm text-slate-600">Winner Configuration</div>
                </div>
              </div>

              {winners.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWinner(index)}
                  className="text-red-500 hover:text-red-600"
                  type="button"
                >
                  <FiX className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <FiHash className="w-4 h-4" /> Rank
                </label>
                <Input
                  type="number"
                  value={winner.rank}
                  onChange={(e) => updateWinner(index, "rank", e.target.value)}
                  min="1"
                  className="text-center font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  {isSquad ? <GiTeamIdea className="w-4 h-4" /> : <FiUser className="w-4 h-4" />}
                  {isSquad ? "Select Team" : "Select Player"}
                </label>

                {isSquad ? (
                  <select className="input" value={winner.teamId} onChange={(e) => updateWinner(index, "teamId", e.target.value)}>
                    <option value="">-- Select Team --</option>
                    {squadTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} • Captain: {team.captain} • {team.points} pts
                      </option>
                    ))}
                  </select>
                ) : (
                  <select className="input" value={winner.userId} onChange={(e) => updateWinner(index, "userId", e.target.value)}>
                    <option value="">-- Select Player --</option>
                    {soloDuoPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} • {p.bgmiId} • {p.points} pts
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4" /> Prize (₹)
                </label>
                <Input
                  type="number"
                  value={winner.prizeAmount}
                  onChange={(e) => updateWinner(index, "prizeAmount", e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <GiCrossedSwords className="w-4 h-4" /> Kills
                </label>
                <Input
                  type="number"
                  value={winner.totalKills}
                  onChange={(e) => updateWinner(index, "totalKills", e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  <FiBarChart2 className="w-4 h-4" /> Points
                </label>
                <Input
                  type="number"
                  value={winner.totalPoints}
                  onChange={(e) => updateWinner(index, "totalPoints", e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Notes */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
            <FiCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-slate-700">
            <div className="font-medium text-slate-800 mb-1">Important Notes:</div>
            <ul className="space-y-1">
              <li>• Winners must be from tournament participants.</li>
              <li>• Total prize distribution must not exceed prize pool.</li>
              <li>• Squad tournaments: select team (payout is handled in backend logic if you implemented wallet credit).</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Warning */}
      {totalPrize > pool && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
          <div className="font-medium text-red-800">Prize Pool Exceeded!</div>
          <div className="text-sm text-red-700">
            Distribution ₹{totalPrize.toLocaleString()} exceeds pool ₹{pool.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}