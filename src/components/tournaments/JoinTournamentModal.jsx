// components/tournaments/JoinTournamentModal.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiUsers,
  FiAward,
  FiTag,
  FiCreditCard,
  FiCheckCircle,
  FiAlertCircle,
  FiDollarSign,
  FiShield,
  FiInfo
} from "react-icons/fi";
import { GiTrophy, GiTeamIdea } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { toast } from "@/store/uiSlice";

function emptyMember() {
  return { bgmiId: "", inGameName: "" };
}

export default function JoinTournamentModal({ open, onClose, tournament }) {
  const router = useRouter();
  const user = useSelector((s) => s.auth.user);

  const [activeTab, setActiveTab] = useState("details");
  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Squad fields
  const [teamName, setTeamName] = useState("");

  // Duo fields
  const [partnerBgmiId, setPartnerBgmiId] = useState("");
  const [partnerInGameName, setPartnerInGameName] = useState("");

  // Dynamic members based on tournament type
  const [members, setMembers] = useState([]);

  const baseAmount = tournament?.isFree ? 0 : (tournament?.serviceFee || 0);

  useEffect(() => {
    if (open && !user) {
      router.push(`/login?next=/tournaments/${tournament._id}`);
    }
  }, [open, user, router, tournament]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setCouponInfo(null);
    setCouponCode("");
    setTeamName("");
    setPartnerBgmiId("");
    setPartnerInGameName("");
    setFormErrors({});
    setActiveTab("details");
    // Reset members based on tournament type
    if (tournament) {
      initializeMembers();
    }
  };

  // Initialize members based on tournament type
  const initializeMembers = () => {
    if (!tournament || !user) return;

    if (tournament.tournamentType === "squad") {
      // Squad: teamSize - 1 additional members (user is already included as captain)
      const teamSize = tournament.teamSize || 4;
      const additionalMembers = teamSize - 1; // 3 additional members for 4 player squad
      const initialMembers = Array(additionalMembers).fill(null).map(() => emptyMember());
      setMembers(initialMembers);
    } else if (tournament.tournamentType === "duo") {
      // Duo: Only 1 partner needed
      setMembers([emptyMember()]);
    } else {
      // Solo: No additional members needed
      setMembers([]);
    }
  };

  useEffect(() => {
    if (tournament && user) {
      initializeMembers();
    }
  }, [tournament, user]);

  const payable = useMemo(() => couponInfo?.finalAmount ?? baseAmount, [couponInfo, baseAmount]);
  const discount = couponInfo?.discountAmount || 0;
  const showCoupon = !tournament?.isFree;

  // Get tournament type display text
  const getTournamentTypeText = () => {
    if (!tournament) return "";
    
    switch(tournament.tournamentType) {
      case "solo":
        return "Solo (You Only)";
      case "duo":
        return "Duo (You + 1 Partner)";
      case "squad":
        const teamSize = tournament.teamSize || 4;
        return `Squad (You + ${teamSize - 1} Teammates)`;
      default:
        return "";
    }
  };

  // Get member info text
  const getMembersInfoText = () => {
    if (!tournament) return "";
    
    switch(tournament.tournamentType) {
      case "solo":
        return "No teammates required - you'll play alone";
      case "duo":
        return "Add 1 partner's details";
      case "squad":
        const teamSize = tournament.teamSize || 4;
        return `Add ${teamSize - 1} teammates' details`;
      default:
        return "";
    }
  };

  const tabs = [
    { key: "details", label: "Tournament Details", icon: <FiAward className="w-4 h-4" /> },
    (tournament?.tournamentType === "squad" || tournament?.tournamentType === "duo") && { 
      key: "teammates", 
      label: tournament?.tournamentType === "duo" ? "Partner" : "Teammates",
      icon: tournament?.tournamentType === "duo" ? 
        <BsFillPeopleFill className="w-4 h-4" /> : 
        <GiTeamIdea className="w-4 h-4" />
    },
    { key: "payment", label: "Payment", icon: <FiCreditCard className="w-4 h-4" /> }
  ].filter(Boolean);

  const validateForm = () => {
    const errors = {};

    if (tournament?.tournamentType === "duo") {
      if (!partnerBgmiId.trim()) errors.partnerBgmiId = "Partner BGMI ID is required";
      if (!partnerInGameName.trim()) errors.partnerInGameName = "Partner In-Game Name is required";
    }

    if (tournament?.tournamentType === "squad") {
      members.forEach((member, index) => {
        if (!member.bgmiId.trim()) errors[`member${index}BgmiId`] = `Teammate ${index + 1} BGMI ID required`;
        if (!member.inGameName.trim()) errors[`member${index}InGameName`] = `Teammate ${index + 1} IGN required`;
      });
    }

    return errors;
  };

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    
    setVerifyingCoupon(true);
    try {
      const res = await api.validateCoupon({
        tournamentId: tournament._id,
        couponCode: couponCode.trim(),
        amount: baseAmount
      });
      
      if (res.success) {
        setCouponInfo(res.data);
        toast({ 
          title: "Coupon Applied!", 
          message: `₹${res.data.discountAmount} discount applied` 
        });
      }
    } catch (error) {
      toast({ 
        title: "Invalid Coupon", 
        message: error.message || "Please enter a valid coupon code",
        type: "error"
      });
      setCouponInfo(null);
    } finally {
      setVerifyingCoupon(false);
    }
  }

  async function registerNow() {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({ 
        title: "Validation Error", 
        message: "Please fill all required fields",
        type: "error"
      });
      return;
    }

    setLoading(true);
    try {
      const payloadBase = { 
        couponCode: couponCode?.trim() || undefined 
      };

      let res;
      if (tournament.tournamentType === "squad") {
        const cleanedMembers = members.map((m) => ({
          bgmiId: m.bgmiId.trim(),
          inGameName: m.inGameName.trim()
        }));

        res = await api.registerSquad(tournament._id, {
          ...payloadBase,
          teamName: teamName?.trim() || undefined,
          members: cleanedMembers
        });
      } else if (tournament.tournamentType === "duo") {
        // For duo, use the partner fields
        res = await api.registerSoloDuo(tournament._id, {
          ...payloadBase,
          partnerBgmiId: partnerBgmiId.trim(),
          partnerInGameName: partnerInGameName.trim()
        });
      } else {
        // For solo, no partner/members needed
        res = await api.registerSoloDuo(tournament._id, payloadBase);
      }

      if (res.success) {
        onClose();
        if (payable === 0) {
          router.refresh();
          toast({ 
            title: "Registered Successfully!", 
            message: "You have been registered for the tournament" 
          });
        } else {
          router.push("/payments");
        }
      }
    } catch (error) {
      toast({ 
        title: "Registration Failed", 
        message: error.message || "Please try again",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  if (!tournament || !user) return null;

  return (
    <Modal open={open} onClose={onClose} title="Join Tournament" size="lg">
      <div className="space-y-6">
        {/* Tournament Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">{tournament.title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {tournament.tournamentType === "solo" ? <FiUser className="w-4 h-4" /> : 
                   tournament.tournamentType === "duo" ? <BsFillPeopleFill className="w-4 h-4" /> : 
                   <GiTeamIdea className="w-4 h-4" />}
                  {getTournamentTypeText()}
                </span>
                <span className="text-sm text-slate-600">
                  {tournament.isFree ? "Free Entry" : `Entry Fee: ₹${baseAmount}`}
                </span>
              </div>
              <div className="text-sm text-slate-500 mt-2">
                {getMembersInfoText()}
              </div>
            </div>
            <div className="mt-2 md:mt-0">
              <div className="text-2xl font-bold text-blue-600">₹{tournament.prizePool.toLocaleString()}</div>
              <div className="text-xs text-slate-600">Prize Pool</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-blue-500"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Details Tab */}
          {activeTab === "details" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <FiAward className="w-4 h-4" />
                      Tournament Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                        <span className="text-slate-600">Date:</span>
                        <span className="font-medium">{new Date(tournament.tournamentStartDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                        <span className="text-slate-600">Time:</span>
                        <span className="font-medium">{new Date(tournament.tournamentStartDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                        <span className="text-slate-600">Map:</span>
                        <span className="font-medium">{tournament.map}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                        <span className="text-slate-600">Perspective:</span>
                        <span className="font-medium">{tournament.perspective}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <FiUsers className="w-4 h-4" />
                      Registration Status
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                        <span className="text-slate-600">Participants:</span>
                        <span className="font-medium">{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                        <span className="text-slate-600">Spots Remaining:</span>
                        <span className="font-medium">{tournament.maxParticipants - tournament.currentParticipants}</span>
                      </div>
                      <div className="p-2">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min(100, (tournament.currentParticipants / tournament.maxParticipants) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 text-right">
                          {Math.round((tournament.currentParticipants / tournament.maxParticipants) * 100)}% filled
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              {showCoupon && (
                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <FiTag className="w-4 h-4" />
                    Apply Coupon
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code (RBM50)"
                        icon={<FiTag className="w-4 h-4" />}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={applyCoupon} 
                      disabled={!couponCode || verifyingCoupon}
                      loading={verifyingCoupon}
                      className="sm:w-auto"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponInfo && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-green-700">
                          <FiCheckCircle className="w-5 h-5" />
                          <div>
                            <div className="font-medium">Coupon Applied!</div>
                            <div className="text-xs text-green-600">Valid for this tournament</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-600 line-through">₹{baseAmount}</div>
                          <div className="text-xl font-bold text-green-700">₹{couponInfo.finalAmount}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Teammates Tab - For Duo and Squad */}
          {activeTab === "teammates" && (tournament.tournamentType === "duo" || tournament.tournamentType === "squad") && (
            <div className="space-y-6">
              {/* User's Own Info Card (Auto-filled) */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800">Your Details (Captain)</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Your information is automatically added as the team captain.
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        AUTO-FILLED
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-green-100">
                        <div className="text-xs text-slate-500 mb-1">Your BGMI ID</div>
                        <div className="font-medium text-slate-800 flex items-center gap-2">
                          {user.bgmiId || "Not set"}
                          {user.bgmiId && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        {!user.bgmiId && (
                          <div className="text-xs text-amber-600 mt-1">
                            Please set your BGMI ID in profile settings
                          </div>
                        )}
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-green-100">
                        <div className="text-xs text-slate-500 mb-1">Your In-Game Name</div>
                        <div className="font-medium text-slate-800 flex items-center gap-2">
                          {user.inGameName || user.name || "Not set"}
                          {user.inGameName && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Name (For Squad only) */}
              {tournament.tournamentType === "squad" && (
                <div>
                  <Input
                    label="Team Name (Optional)"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name (e.g., RBM Warriors)"
                    helperText="A unique name for your squad"
                  />
                </div>
              )}

              {/* Additional Teammates Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                      {tournament.tournamentType === "duo" ? (
                        <BsFillPeopleFill className="w-5 h-5 text-amber-600" />
                      ) : (
                        <GiTeamIdea className="w-5 h-5 text-purple-600" />
                      )}
                      {tournament.tournamentType === "duo" ? "Partner Details" : "Teammates Details"}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {tournament.tournamentType === "duo" 
                        ? "Add your partner's information below"
                        : `Add ${members.length} teammates' information below`}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Required: {tournament.tournamentType === "duo" ? "1" : members.length}
                  </div>
                </div>

                {/* Partner Input for Duo */}
                {tournament.tournamentType === "duo" && (
                  <div className="border border-slate-200 rounded-xl p-4 hover:border-amber-300 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                        <span className="font-bold text-amber-700">P</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">Partner</span>
                        <div className="text-xs text-slate-500">Your duo partner</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="Partner BGMI ID"
                        value={partnerBgmiId}
                        onChange={(e) => setPartnerBgmiId(e.target.value)}
                        placeholder="Enter partner's 10-12 digit BGMI ID"
                        error={formErrors.partnerBgmiId}
                        required
                      />
                      <Input
                        label="Partner In-Game Name"
                        value={partnerInGameName}
                        onChange={(e) => setPartnerInGameName(e.target.value)}
                        placeholder="Enter partner's in-game name"
                        error={formErrors.partnerInGameName}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Teammates Input for Squad */}
                {tournament.tournamentType === "squad" && members.map((member, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">Teammate {index + 1}</span>
                        <div className="text-xs text-slate-500">
                          {index === 0 ? "Main fragger" : 
                           index === 1 ? "Support player" : 
                           index === 2 ? "Sniper" : "Flex player"}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="BGMI ID"
                        value={member.bgmiId}
                        onChange={(e) => {
                          const v = e.target.value;
                          setMembers(prev => prev.map((x, i) => 
                            i === index ? { ...x, bgmiId: v } : x
                          ));
                        }}
                        placeholder="Enter teammate's BGMI ID"
                        error={formErrors[`member${index}BgmiId`]}
                        required
                      />
                      <Input
                        label="In-Game Name"
                        value={member.inGameName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setMembers(prev => prev.map((x, i) => 
                            i === index ? { ...x, inGameName: v } : x
                          ));
                        }}
                        placeholder="Enter teammate's in-game name"
                        error={formErrors[`member${index}InGameName`]}
                        required
                      />
                    </div>
                  </div>
                ))}

                {/* Info Box */}
                <div className="flex items-start gap-2 text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                  <FiInfo className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-700 mb-1">Important Notes:</div>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Make sure all BGMI IDs and In-Game Names are correct</li>
                      <li>• Once registered, changes cannot be made</li>
                      <li>• All team members must have unique BGMI IDs</li>
                      <li>• You are automatically registered as the team captain</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FiCreditCard className="w-5 h-5" />
                    Payment Summary
                  </h4>
                  <div className="flex items-center gap-2 text-green-600">
                    <FiShield className="w-4 h-4" />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-slate-700">Entry Fee</div>
                    <div className="font-medium">₹{baseAmount}</div>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="text-green-700">Discount Applied</div>
                      <div className="font-medium text-green-600">-₹{discount}</div>
                    </div>
                  )}
                  <div className="h-px bg-slate-200"></div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-800">Total Payable</div>
                    <div className="text-2xl font-bold text-blue-600">₹{payable}</div>
                  </div>
                </div>

                {payable === 0 ? (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiCheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="font-bold text-green-800">Free Registration!</div>
                        <div className="text-sm text-green-700 mt-1">
                          No payment required. Click confirm to complete your registration.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiCreditCard className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-bold text-blue-800">Secure Payment Gateway</div>
                        <div className="text-sm text-blue-700 mt-1">
                          You will be redirected to Razorpay for secure payment processing.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Sticky at bottom */}
        <div className="sticky bottom-0 bg-white pt-4 border-t border-slate-200 -mx-6 -mb-6 px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              {payable === 0 ? (
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-green-600">No payment required</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-blue-500" />
                  <span>Total: <span className="font-bold text-blue-600">₹{payable}</span></span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              {activeTab !== "details" ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const tabIndex = tabs.findIndex(t => t.key === activeTab);
                    if (tabIndex > 0) setActiveTab(tabs[tabIndex - 1].key);
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Back
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              )}
              
              {activeTab !== "payment" ? (
                <Button 
                  onClick={() => {
                    const tabIndex = tabs.findIndex(t => t.key === activeTab);
                    if (tabIndex < tabs.length - 1) {
                      setActiveTab(tabs[tabIndex + 1].key);
                    }
                  }}
                  className="flex-1 sm:flex-none"
                  disabled={
                    (tournament.tournamentType === "duo" && (!partnerBgmiId.trim() || !partnerInGameName.trim())) ||
                    (tournament.tournamentType === "squad" && 
                      members.some(m => !m.bgmiId.trim() || !m.inGameName.trim()))
                  }
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={registerNow}
                  loading={loading}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl"
                >
                  {payable === 0 ? "Confirm Registration" : "Proceed to Payment"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}