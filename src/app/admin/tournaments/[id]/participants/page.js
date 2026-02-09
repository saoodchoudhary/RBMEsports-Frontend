"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { 
  FiUsers, 
  FiUser, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiAlertCircle,
  FiShield
} from "react-icons/fi";
import { 
  GiTrophy,
  GiRank3,
  GiTeamIdea,
  GiCrossedSwords
} from "react-icons/gi";
import { BsFillPeopleFill, BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlinePayment, MdOutlineVerified } from "react-icons/md";

export default function AdminParticipantsPage({ params }) {
  const { id } = React.use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("teams"); // 'teams' or 'individuals'

  useEffect(() => {
    loadParticipants();
  }, [id]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const res = await api.adminParticipants(id);
      setData(res.data);
      
      // Auto-detect view mode based on data type
      if (Array.isArray(res.data)) {
        setViewMode("teams");
      } else {
        setViewMode("individuals");
      }
    } catch (error) {
      console.error("Failed to load participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getRegistrationStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'registered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'disqualified': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredParticipants = () => {
    if (!data) return [];
    
    if (viewMode === "teams" && Array.isArray(data)) {
      let teams = [...data];
      
      // Search filter
      if (searchTerm) {
        teams = teams.filter(team =>
          team.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.captain?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.captain?.bgmiId?.includes(searchTerm) ||
          team.members?.some(m => 
            m.inGameName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.bgmiId?.includes(searchTerm)
          )
        );
      }
      
      // Status filter
      if (filterStatus !== "all") {
        teams = teams.filter(team => team.paymentStatus === filterStatus);
      }
      
      return teams;
    } else if (data?.participants) {
      let participants = [...data.participants];
      
      // Search filter
      if (searchTerm) {
        participants = participants.filter(p =>
          p.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.inGameName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.bgmiId?.includes(searchTerm)
        );
      }
      
      // Status filter
      if (filterStatus !== "all") {
        participants = participants.filter(p => p.paymentStatus === filterStatus);
      }
      
      return participants;
    }
    
    return [];
  };

  const totalParticipants = () => {
    if (viewMode === "teams" && Array.isArray(data)) {
      return data.reduce((total, team) => {
        return total + 1 + (team.members?.length || 0);
      }, 0);
    } else if (data?.participants) {
      return data.participants.length;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 skeleton rounded-lg mb-2"></div>
            <div className="h-4 w-48 skeleton rounded"></div>
          </div>
          <div className="h-10 w-32 skeleton rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 skeleton rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 skeleton rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tournament Participants</h1>
          <p className="text-slate-600 mt-1">Manage and view all registered participants</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FiDownload className="w-4 h-4" />
            Export CSV
          </Button>
          <Button className="flex items-center gap-2">
            <FiEye className="w-4 h-4" />
            View Tournament
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {viewMode === "teams" && Array.isArray(data) ? data.length : data?.participants?.length || 0}
              </div>
              <div className="text-sm text-slate-600">
                {viewMode === "teams" ? "Teams" : "Participants"}
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              {viewMode === "teams" ? (
                <GiTeamIdea className="w-6 h-6 text-blue-600" />
              ) : (
                <FiUser className="w-6 h-6 text-blue-600" />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-800">{totalParticipants()}</div>
              <div className="text-sm text-slate-600">Total Players</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {filteredParticipants().filter(p => 
                  viewMode === "teams" ? p.paymentStatus === "paid" : p.paymentStatus === "paid"
                ).length}
              </div>
              <div className="text-sm text-slate-600">Paid</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {filteredParticipants().filter(p => 
                  viewMode === "teams" ? p.paymentStatus === "pending" : p.paymentStatus === "pending"
                ).length}
              </div>
              <div className="text-sm text-slate-600">Pending</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <FiClock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, BGMI ID, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<FiSearch className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <FiFilter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Teams View */}
      {viewMode === "teams" && Array.isArray(data) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Registered Teams</h2>
            <div className="text-sm text-slate-600">
              Showing {filteredParticipants().length} of {data.length} teams
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredParticipants().map((team) => (
              <Card key={team._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <GiTeamIdea className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-800">{team.teamName || "Unnamed Team"}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRegistrationStatusColor(team.registrationStatus)}`}>
                          {team.registrationStatus || "Registered"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <FiUser className="w-3 h-3" />
                          {team.captain?.userId?.name || "Captain"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MdOutlinePayment className="w-3 h-3" />
                          BGMI: {team.captain?.bgmiId || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getPaymentStatusColor(team.paymentStatus)}`}>
                      {team.paymentStatus?.toUpperCase()}
                    </span>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <BsThreeDotsVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Team Members */}
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <BsFillPeopleFill className="w-4 h-4" />
                    Team Members ({team.members?.length || 0})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Captain */}
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-800">Captain</div>
                          <div className="text-sm text-slate-600">{team.captain?.inGameName || team.captain?.userId?.name}</div>
                        </div>
                        <GiCrossedSwords className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-xs text-slate-500 mt-2">BGMI: {team.captain?.bgmiId}</div>
                    </div>

                    {/* Members */}
                    {team.members?.map((member, idx) => (
                      <div key={idx} className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-800">Member {idx + 1}</div>
                            <div className="text-sm text-slate-600">{member.inGameName}</div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${
                            member.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            member.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {member.status}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">BGMI: {member.bgmiId}</div>
                        {member.position && (
                          <div className="text-xs text-purple-600 mt-1">
                            Role: {member.position}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Stats */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-slate-800">{team.totalKills || 0}</div>
                      <div className="text-xs text-slate-600">Total Kills</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-slate-800">{team.totalPoints || 0}</div>
                      <div className="text-xs text-slate-600">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-slate-800">#{team.placement || "N/A"}</div>
                      <div className="text-xs text-slate-600">Placement</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Individual Participants View */}
      {viewMode === "individuals" && data?.participants && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Individual Participants</h2>
            <div className="text-sm text-slate-600">
              Showing {filteredParticipants().length} of {data.participants.length} participants
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParticipants().map((participant, idx) => (
              <Card key={idx} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{participant.userId?.name}</h3>
                      <div className="text-sm text-slate-600">{participant.inGameName}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(participant.paymentStatus)}`}>
                    {participant.paymentStatus?.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">BGMI ID:</span>
                    <span className="font-medium">{participant.bgmiId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Registered:</span>
                    <span className="font-medium">
                      {new Date(participant.registeredAt).toLocaleDateString()}
                    </span>
                  </div>
                  {participant.partnerInfo && (
                    <div className="mt-3 p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-700 text-sm">
                        <BsFillPeopleFill className="w-3 h-3" />
                        <span>Duo Partner</span>
                      </div>
                      <div className="text-xs text-amber-800 mt-1">
                        {participant.partnerInfo.inGameName} ({participant.partnerInfo.bgmiId})
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="font-bold text-slate-800">{participant.totalKills || 0}</div>
                      <div className="text-xs text-slate-600">Kills</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{participant.totalPoints || 0}</div>
                      <div className="text-xs text-slate-600">Points</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">#{participant.finalRank || "N/A"}</div>
                      <div className="text-xs text-slate-600">Rank</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FiEye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BsThreeDotsVertical className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredParticipants().length === 0 && !loading && (
        <Card className="p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
            <FiUsers className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No Participants Found</h3>
          <p className="text-slate-600 mt-2 max-w-md mx-auto">
            {searchTerm || filterStatus !== "all" 
              ? "No participants match your search criteria. Try adjusting your filters."
              : "No participants have registered for this tournament yet."
            }
          </p>
          {(searchTerm || filterStatus !== "all") && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}