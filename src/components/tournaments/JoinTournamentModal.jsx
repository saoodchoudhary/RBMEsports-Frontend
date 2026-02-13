"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  FiAward,
  FiTag,
  FiCreditCard,
  FiCheckCircle,
  FiDollarSign,
  FiShield,
  FiInfo,
  FiUsers,
  FiClock,
  FiCalendar,
  FiArrowRight,
  FiAlertCircle,
  FiXCircle
} from "react-icons/fi";
import {
  GiTrophy,
  GiTeamIdea,
  GiSwordsPower,
  GiBattleGear,
  GiCash,
  GiMoneyStack,
  GiTakeMyMoney,
  GiShield as GiShieldIcon,
  GiConfirmed
} from "react-icons/gi";
import { BsFillPeopleFill, BsShieldCheck } from "react-icons/bs";
import { MdVerified, MdSecurity, MdOutlineEmojiEvents } from "react-icons/md";
import { FaCrown, FaRegGem } from "react-icons/fa";

// ✅ Use these (not toast(...) direct)
import { showToast } from "@/store/uiSlice";

function emptyMember() {
  return { bgmiId: "", inGameName: "" };
}

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

export default function JoinTournamentModal({ open, onClose, tournament }) {
  const router = useRouter();
  const dispatch = useDispatch();
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
      icon:
        tournament?.tournamentType === "duo" ? (
          <BsFillPeopleFill className="w-4 h-4" />
        ) : (
          <GiTeamIdea className="w-4 h-4" />
        )
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

        dispatch(
          showToast({
            type: "success",
            title: "Coupon Applied",
            message: `₹${safeNum(res.data.discountAmount, 0)} discount applied`
          })
        );
      } else {
        dispatch(
          showToast({
            type: "error",
            title: "Coupon Error",
            message: res?.message || "Failed to apply coupon"
          })
        );
      }
    } catch (error) {
      dispatch(
        showToast({
          type: "error",
          title: "Invalid Coupon",
          message: error?.message || "Please enter a valid coupon code"
        })
      );
      setCouponInfo(null);
    } finally {
      setVerifyingCoupon(false);
    }
  }

  async function registerNow() {
    if (!isRegistrationOpen) {
      dispatch(
        showToast({
          type: "error",
          title: "Registration Closed",
          message: "Registration is not open for this tournament"
        })
      );
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      dispatch(
        showToast({
          type: "error",
          title: "Validation Error",
          message: errors.profile || "Please fill all required fields"
        })
      );
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
        res = await api.registerSoloDuo(tournament._id, {
          ...payloadBase,
          partnerBgmiId: partnerBgmiId.trim(),
          partnerInGameName: partnerInGameName.trim()
        });
      } else {
        res = await api.registerSoloDuo(tournament._id, payloadBase);
      }

      if (res.success) {
        onClose();

        if (payable === 0) {
          router.refresh();
          dispatch(
            showToast({
              type: "success",
              title: "Registered Successfully",
              message: "You have been registered for the tournament"
            })
          );
        } else {
          dispatch(
            showToast({
              type: "success",
              title: "Registration Done",
              message: "Redirecting to payment..."
            })
          );
          router.push("/payments");
        }
      } else {
        dispatch(
          showToast({
            type: "error",
            title: "Registration Failed",
            message: res?.message || "Please try again"
          })
        );
      }
    } catch (error) {
      dispatch(
        showToast({
          type: "error",
          title: "Registration Failed",
          message: error?.message || "Please try again"
        })
      );
    } finally {
      setLoading(false);
    }
  }

  if (!tournament || !user) return null;

  return (
    <Modal open={open} onClose={onClose} title="Join Tournament" size="lg">
      <div className="space-y-5 sm:space-y-6">
        
        {/* ===== TOURNAMENT INFO CARD ===== */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">{tournament.title}</h3>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                  {tournament.tournamentType === "solo" ? (
                    <FiUsers className="w-3.5 h-3.5" />
                  ) : tournament.tournamentType === "duo" ? (
                    <BsFillPeopleFill className="w-3.5 h-3.5" />
                  ) : (
                    <GiTeamIdea className="w-3.5 h-3.5" />
                  )}
                  {getTournamentTypeText()}
                </span>

                <span className="text-xs sm:text-sm text-gray-600 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                  {tournament.isFree ? "FREE ENTRY" : `Entry: ₹${baseAmount}`}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 mt-2 flex items-center gap-1">
                <FiInfo className="w-3.5 h-3.5 text-blue-600" />
                {getMembersInfoText()}
              </div>

              {!isRegistrationOpen && (
                <div className="mt-3 text-xs sm:text-sm text-red-600 font-semibold flex items-center gap-1">
                  <FiXCircle className="w-4 h-4" />
                  Registration is currently closed for this tournament
                </div>
              )}
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">₹{safeNum(tournament.prizePool, 0).toLocaleString("en-IN")}</div>
              <div className="text-[10px] sm:text-xs text-gray-500">Prize Pool</div>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                <span className="text-blue-600">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className="space-y-5 sm:space-y-6">
          
          {/* ===== DETAILS TAB ===== */}
          {activeTab === "details" && (
            <>
              {formErrors.profile && (
                <div className="p-3 sm:p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs sm:text-sm flex items-start gap-2">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {formErrors.profile}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* Tournament Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 flex items-center gap-2">
                    <FiAward className="w-4 h-4 text-blue-600" />
                    Tournament Information
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg text-xs sm:text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">
                        {tournament.tournamentStartDate
                          ? new Date(tournament.tournamentStartDate).toLocaleDateString("en-IN")
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg text-xs sm:text-sm">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-gray-900">
                        {tournament.tournamentStartDate
                          ? new Date(tournament.tournamentStartDate).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg text-xs sm:text-sm">
                      <span className="text-gray-600">Map:</span>
                      <span className="font-medium text-gray-900">{tournament.map || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg text-xs sm:text-sm">
                      <span className="text-gray-600">Perspective:</span>
                      <span className="font-medium text-gray-900">{tournament.perspective || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Registration Status */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-blue-600" />
                    Registration Status
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg text-xs sm:text-sm">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium text-gray-900">
                        {safeNum(tournament.currentParticipants, 0)}/{safeNum(tournament.maxParticipants, 0) || "—"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg text-xs sm:text-sm">
                      <span className="text-gray-600">Spots Left:</span>
                      <span className="font-medium text-blue-600">
                        {typeof tournament.spotsRemaining === "number"
                          ? tournament.spotsRemaining
                          : Math.max(0, safeNum(tournament.maxParticipants, 0) - safeNum(tournament.currentParticipants, 0))}
                      </span>
                    </div>

                    <div className="p-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                          style={{
                            width: `${
                              safeNum(tournament.maxParticipants, 0) > 0
                                ? Math.min(
                                    100,
                                    (safeNum(tournament.currentParticipants, 0) / safeNum(tournament.maxParticipants, 0)) * 100
                                  )
                                : 0
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              {showCoupon && (
                <div className="border border-gray-200 rounded-lg p-4 sm:p-5">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-blue-600" />
                    Apply Coupon
                  </h4>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code (RBM50)"
                        icon={<FiTag className="w-4 h-4" />}
                        className="text-sm"
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={!couponCode || verifyingCoupon}
                      loading={verifyingCoupon}
                      className="sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm py-2.5"
                      type="button"
                    >
                      Apply
                    </Button>
                  </div>

                  {couponInfo && (
                    <div className="mt-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-50 border border-green-200 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-green-700">
                          <FiCheckCircle className="w-5 h-5" />
                          <div>
                            <div className="font-semibold text-sm sm:text-base">Coupon Applied!</div>
                            <div className="text-xs text-green-600">
                              Discount: ₹{safeNum(couponInfo.discountAmount, 0)}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-500 line-through">₹{baseAmount}</div>
                          <div className="text-lg sm:text-xl font-bold text-green-700">
                            ₹{safeNum(couponInfo.finalAmount, baseAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ===== TEAMMATES TAB ===== */}
          {activeTab === "teammates" && (tournament.tournamentType === "duo" || tournament.tournamentType === "squad") && (
            <div className="space-y-5 sm:space-y-6">
              
              {/* Captain Info */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                    <FaCrown className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Your Details (Captain)</h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Your information is automatically added as captain.
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md self-start sm:self-auto">
                        AUTO-FILLED
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Your BGMI ID</div>
                        <div className="font-medium text-gray-800 text-xs sm:text-sm flex items-center gap-2">
                          {user.bgmiId || "Not set"}
                          {user.bgmiId && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Your In-Game Name</div>
                        <div className="font-medium text-gray-800 text-xs sm:text-sm flex items-center gap-2">
                          {user.inGameName || "Not set"}
                          {user.inGameName && <FiCheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Name (Squad Only) */}
              {tournament.tournamentType === "squad" && (
                <Input
                  label="Team Name (Optional)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name (e.g., RBM Warriors)"
                  className="text-sm"
                />
              )}

              {/* Duo Form */}
              {tournament.tournamentType === "duo" && (
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
                      <BsFillPeopleFill className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">Partner</span>
                      <div className="text-xs text-gray-500">Your duo partner</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Partner BGMI ID"
                      value={partnerBgmiId}
                      onChange={(e) => setPartnerBgmiId(e.target.value)}
                      placeholder="Enter partner's BGMI ID"
                      error={formErrors.partnerBgmiId}
                      required
                      className="text-sm"
                    />
                    <Input
                      label="Partner In-Game Name"
                      value={partnerInGameName}
                      onChange={(e) => setPartnerInGameName(e.target.value)}
                      placeholder="Enter partner's in-game name"
                      error={formErrors.partnerInGameName}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Squad Members */}
              {tournament.tournamentType === "squad" &&
                members.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
                        <span className="font-bold text-blue-600 text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">Teammate {index + 1}</span>
                        <div className="text-xs text-gray-500">Required</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        className="text-sm"
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
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}

              {/* Important Note */}
              <div className="flex items-start gap-2 text-xs text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <FiInfo className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-700 mb-1 text-xs sm:text-sm">Important:</div>
                  <ul className="space-y-1 text-gray-600 text-xs">
                    <li>• Details must be correct (changes not allowed later)</li>
                    <li>• All BGMI IDs must be unique</li>
                    <li>• You are registered as captain automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ===== PAYMENT TAB ===== */}
          {activeTab === "payment" && (
            <div className="space-y-5">
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
                    <FiCreditCard className="w-5 h-5 text-blue-600" />
                    Payment Summary
                  </h4>
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <MdSecurity className="w-4 h-4" />
                    <span className="font-medium">Secure</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="text-gray-700">Entry Fee</div>
                    <div className="font-medium text-gray-900">₹{baseAmount}</div>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg text-sm">
                      <div className="text-green-700">Discount</div>
                      <div className="font-medium text-green-600">-₹{discount}</div>
                    </div>
                  )}

                  <div className="h-px bg-gray-200"></div>

                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg">
                    <div className="text-base sm:text-lg font-bold text-gray-800">Total Payable</div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">₹{payable}</div>
                  </div>
                </div>

                {payable === 0 ? (
                  <div className="mt-5 p-4 bg-gradient-to-r from-green-50 to-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                      <div>
                        <div className="font-bold text-green-800 text-sm sm:text-base">Free / ₹0 Payable</div>
                        <div className="text-xs text-green-700 mt-1">No payment required. Confirm registration to join.</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiCreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                      <div>
                        <div className="font-bold text-blue-800 text-sm sm:text-base">Razorpay Payment</div>
                        <div className="text-xs text-blue-700 mt-1">
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

        {/* ===== STICKY ACTION BUTTONS ===== */}
        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 px-5 sm:px-6 pb-5 sm:pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-600">
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
                  className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-semibold py-2.5"
                >
                  Back
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-semibold py-2.5"
                >
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
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold py-2.5 shadow-md"
                  disabled={
                    !isRegistrationOpen ||
                    Boolean(formErrors.profile) ||
                    (tournament.tournamentType === "duo" && (!partnerBgmiId.trim() || !partnerInGameName.trim())) ||
                    (tournament.tournamentType === "squad" && members.some((m) => !m.bgmiId.trim() || !m.inGameName.trim()))
                  }
                >
                  Continue
                  <FiArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={registerNow}
                  loading={loading}
                  disabled={!isRegistrationOpen}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold py-2.5 shadow-lg hover:shadow-xl"
                >
                  {payable === 0 ? (
                    <>
                      <GiConfirmed className="w-4 h-4 mr-2" />
                      Confirm Registration
                    </>
                  ) : (
                    <>
                      <FiCreditCard className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}