"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  
  FiAward,
  FiTag,
  FiCreditCard,
  FiCheckCircle,
  FiDollarSign,
  FiShield,
  FiInfo,
  FiUsers
} from "react-icons/fi";
import { GiTeamIdea } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { toast } from "@/store/uiSlice";

function emptyMember() {
  return { bgmiId: "", inGameName: "" };
}

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
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

  // Members for squad
  const [members, setMembers] = useState([]);

  const baseAmount = tournament?.isFree ? 0 : safeNum(tournament?.serviceFee, 0);

  const isRegistrationOpen = Boolean(tournament?.isRegistrationOpen) && !Boolean(tournament?.isFull);

  useEffect(() => {
    if (open && !user) {
      router.push(`/login?next=/tournaments/${tournament?._id}`);
    }
  }, [open, user, router, tournament]);

  useEffect(() => {
    if (!open) resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const initializeMembers = () => {
    if (!tournament || !user) return;

    if (tournament.tournamentType === "squad") {
      const teamSize = tournament.teamSize || 4;
      const additionalMembers = Math.max(0, teamSize - 1);
      setMembers(Array(additionalMembers).fill(null).map(() => emptyMember()));
    } else {
      setMembers([]);
    }
  };

  useEffect(() => {
    if (tournament && user) initializeMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournament, user]);

  const resetForm = () => {
    setActiveTab("details");
    setCouponCode("");
    setCouponInfo(null);
    setTeamName("");
    setPartnerBgmiId("");
    setPartnerInGameName("");
    setFormErrors({});
    if (tournament && user) initializeMembers();
  };

  const payable = useMemo(() => couponInfo?.finalAmount ?? baseAmount, [couponInfo, baseAmount]);
  const discount = safeNum(couponInfo?.discountAmount, 0);
  const showCoupon = !tournament?.isFree;

  const getTournamentTypeText = () => {
    if (!tournament) return "";
    switch (tournament.tournamentType) {
      case "solo":
        return "Solo (You Only)";
      case "duo":
        return "Duo (You + 1 Partner)";
      case "squad": {
        const teamSize = tournament.teamSize || 4;
        return `Squad (You + ${teamSize - 1} Teammates)`;
      }
      default:
        return "";
    }
  };

  const getMembersInfoText = () => {
    if (!tournament) return "";
    switch (tournament.tournamentType) {
      case "solo":
        return "No teammates required - you'll play alone";
      case "duo":
        return "Add 1 partner's details";
      case "squad": {
        const teamSize = tournament.teamSize || 4;
        return `Add ${teamSize - 1} teammates' details`;
      }
      default:
        return "";
    }
  };

  const tabs = [
    { key: "details", label: "Tournament Details", icon: <FiAward className="w-4 h-4" /> },
    (tournament?.tournamentType === "squad" || tournament?.tournamentType === "duo") && {
      key: "teammates",
      label: tournament?.tournamentType === "duo" ? "Partner" : "Teammates",
      icon: tournament?.tournamentType === "duo" ? <BsFillPeopleFill className="w-4 h-4" /> : <GiTeamIdea className="w-4 h-4" />
    },
    { key: "payment", label: "Payment", icon: <FiCreditCard className="w-4 h-4" /> }
  ].filter(Boolean);

  const validateForm = () => {
    const errors = {};

    // Backend validation requires partner fields for duo
    if (tournament?.tournamentType === "duo") {
      if (!partnerBgmiId.trim()) errors.partnerBgmiId = "Partner BGMI ID is required";
      if (!partnerInGameName.trim()) errors.partnerInGameName = "Partner In-Game Name is required";
    }

    // Backend requires all members for squad (exact size)
    if (tournament?.tournamentType === "squad") {
      members.forEach((member, index) => {
        if (!member.bgmiId.trim()) errors[`member${index}BgmiId`] = `Teammate ${index + 1} BGMI ID required`;
        if (!member.inGameName.trim()) errors[`member${index}InGameName`] = `Teammate ${index + 1} IGN required`;
      });
    }

    // user must have bgmiId + inGameName for backend (registerForTournament checks)
    if (!user?.bgmiId || !user?.inGameName) {
      errors.profile = "Please complete your profile (BGMI ID + In-Game Name) before registering.";
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
          message: `₹${safeNum(res.data.discountAmount, 0)} discount applied`
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
    if (!isRegistrationOpen) {
      toast({ title: "Registration Closed", message: "Registration is not open for this tournament", type: "error" });
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Validation Error",
        message: errors.profile || "Please fill all required fields",
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

        // Backend: POST /api/tournaments/:id/register-squad
        res = await api.registerSquad(tournament._id, {
          ...payloadBase,
          teamName: teamName?.trim() || undefined,
          members: cleanedMembers
        });
      } else if (tournament.tournamentType === "duo") {
        // Backend: POST /api/tournaments/:id/register  (expects partnerBgmiId, partnerInGameName)
        res = await api.registerSoloDuo(tournament._id, {
          ...payloadBase,
          partnerBgmiId: partnerBgmiId.trim(),
          partnerInGameName: partnerInGameName.trim()
        });
      } else {
        // Backend: POST /api/tournaments/:id/register
        res = await api.registerSoloDuo(tournament._id, payloadBase);
      }

      if (res.success) {
        onClose();

        // Backend response returns payableAmount too; but we already compute payable in UI (after coupon check)
        if (payable === 0) {
          router.refresh();
          toast({ title: "Registered Successfully!", message: "You have been registered for the tournament" });
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
        {/* Tournament Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">{tournament.title}</h3>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {tournament.tournamentType === "solo" ? (
                    <FiUsers className="w-4 h-4" />
                  ) : tournament.tournamentType === "duo" ? (
                    <BsFillPeopleFill className="w-4 h-4" />
                  ) : (
                    <GiTeamIdea className="w-4 h-4" />
                  )}
                  {getTournamentTypeText()}
                </span>

                <span className="text-sm text-slate-600">
                  {tournament.isFree ? "Free Entry" : `Entry Fee: ₹${baseAmount}`}
                </span>
              </div>

              <div className="text-sm text-slate-500 mt-2">{getMembersInfoText()}</div>

              {!isRegistrationOpen && (
                <div className="mt-3 text-sm text-red-600 font-medium">
                  Registration is currently closed for this tournament.
                </div>
              )}
            </div>

            <div className="mt-2 md:mt-0">
              <div className="text-2xl font-bold text-blue-600">₹{safeNum(tournament.prizePool, 0).toLocaleString("en-IN")}</div>
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
                type="button"
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

        {/* Content */}
        <div className="space-y-6">
          {/* DETAILS */}
          {activeTab === "details" && (
            <>
              {/* Profile required notice */}
              {formErrors.profile && (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
                  {formErrors.profile}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <FiAward className="w-4 h-4" />
                    Tournament Information
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Date:</span>
                      <span className="font-medium">
                        {tournament.tournamentStartDate ? new Date(tournament.tournamentStartDate).toLocaleDateString("en-IN") : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Time:</span>
                      <span className="font-medium">
                        {tournament.tournamentStartDate
                          ? new Date(tournament.tournamentStartDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Map:</span>
                      <span className="font-medium">{tournament.map || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Perspective:</span>
                      <span className="font-medium">{tournament.perspective || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Registration */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <FiUsers className="w-4 h-4" />
                    Registration Status
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Participants:</span>
                      <span className="font-medium">
                        {safeNum(tournament.currentParticipants, 0)}/{safeNum(tournament.maxParticipants, 0) || "—"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Spots Remaining:</span>
                      <span className="font-medium">
                        {typeof tournament.spotsRemaining === "number"
                          ? tournament.spotsRemaining
                          : Math.max(0, safeNum(tournament.maxParticipants, 0) - safeNum(tournament.currentParticipants, 0))}
                      </span>
                    </div>

                    <div className="p-2">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              safeNum(tournament.maxParticipants, 0) > 0
                                ? Math.min(100, (safeNum(tournament.currentParticipants, 0) / safeNum(tournament.maxParticipants, 0)) * 100)
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon */}
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
                      type="button"
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
                            <div className="text-xs text-green-600">
                              Discount: ₹{safeNum(couponInfo.discountAmount, 0)}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-green-600 line-through">₹{baseAmount}</div>
                          <div className="text-xl font-bold text-green-700">₹{safeNum(couponInfo.finalAmount, baseAmount)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* TEAMMATES */}
          {activeTab === "teammates" && (tournament.tournamentType === "duo" || tournament.tournamentType === "squad") && (
            <div className="space-y-6">
              {/* Captain info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <FiUsers className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800">Your Details (Captain)</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Your information is automatically added as captain.
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
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-green-100">
                        <div className="text-xs text-slate-500 mb-1">Your In-Game Name</div>
                        <div className="font-medium text-slate-800 flex items-center gap-2">
                          {user.inGameName || "Not set"}
                          {user.inGameName && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team name */}
              {tournament.tournamentType === "squad" && (
                <Input
                  label="Team Name (Optional)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name (e.g., RBM Warriors)"
                />
              )}

              {/* Duo */}
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

              {/* Squad */}
              {tournament.tournamentType === "squad" &&
                members.map((member, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-800">Teammate {index + 1}</span>
                        <div className="text-xs text-slate-500">Required</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="BGMI ID"
                        value={member.bgmiId}
                        onChange={(e) => {
                          const v = e.target.value;
                          setMembers((prev) => prev.map((x, i) => (i === index ? { ...x, bgmiId: v } : x)));
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
                          setMembers((prev) => prev.map((x, i) => (i === index ? { ...x, inGameName: v } : x)));
                        }}
                        placeholder="Enter teammate's in-game name"
                        error={formErrors[`member${index}InGameName`]}
                        required
                      />
                    </div>
                  </div>
                ))}

              <div className="flex items-start gap-2 text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                <FiInfo className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-slate-700 mb-1">Important:</div>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Details must be correct (changes not allowed later)</li>
                    <li>• All BGMI IDs must be unique</li>
                    <li>• You are registered as captain automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT */}
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
                    <span className="text-sm font-medium">Secure</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-slate-700">Entry Fee</div>
                    <div className="font-medium">₹{baseAmount}</div>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="text-green-700">Discount</div>
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
                        <div className="font-bold text-green-800">Free / ₹0 Payable</div>
                        <div className="text-sm text-green-700 mt-1">
                          No payment required. Confirm registration to join.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiCreditCard className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-bold text-blue-800">Razorpay Payment</div>
                        <div className="text-sm text-blue-700 mt-1">
                          You will be redirected to the payments page after registration.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky actions */}
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
                  <span>
                    Total: <span className="font-bold text-blue-600">₹{payable}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {activeTab !== "details" ? (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    const tabIndex = tabs.findIndex((t) => t.key === activeTab);
                    if (tabIndex > 0) setActiveTab(tabs[tabIndex - 1].key);
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Back
                </Button>
              ) : (
                <Button variant="outline" type="button" onClick={onClose} className="flex-1 sm:flex-none">
                  Cancel
                </Button>
              )}

              {activeTab !== "payment" ? (
                <Button
                  type="button"
                  onClick={() => {
                    const tabIndex = tabs.findIndex((t) => t.key === activeTab);
                    if (tabIndex < tabs.length - 1) setActiveTab(tabs[tabIndex + 1].key);
                  }}
                  className="flex-1 sm:flex-none"
                  disabled={
                    !isRegistrationOpen ||
                    Boolean(formErrors.profile) ||
                    (tournament.tournamentType === "duo" && (!partnerBgmiId.trim() || !partnerInGameName.trim())) ||
                    (tournament.tournamentType === "squad" && members.some((m) => !m.bgmiId.trim() || !m.inGameName.trim()))
                  }
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={registerNow}
                  loading={loading}
                  disabled={!isRegistrationOpen}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl"
                >
                  {payable === 0 ? "Confirm Registration" : "Proceed"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}