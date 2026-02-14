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
  FiXCircle
} from "react-icons/fi";
import { GiTeamIdea } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";

import { showToast } from "@/store/uiSlice";
import ManualPaymentModal from "@/components/tournaments/ManualPaymentModal";

function emptyMember() {
  return { bgmiId: "", inGameName: "" };
}

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function normalizeId(x) {
  if (!x) return null;
  if (typeof x === "string") return x;
  if (typeof x === "object" && x._id) return String(x._id);
  return null;
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

  // ✅ Manual payment popup state
  const [manualOpen, setManualOpen] = useState(false);
  const [manualCtx, setManualCtx] = useState(null); // { paymentId, amount, tournamentTitle }

  // ✅ Keep a fresh tournament snapshot (to detect already registered + paymentId)
  const [freshTournament, setFreshTournament] = useState(null);

  const baseAmount = tournament?.isFree ? 0 : safeNum(tournament?.serviceFee, 0);
  const isRegistrationOpen = Boolean(tournament?.isRegistrationOpen) && !Boolean(tournament?.isFull);

  useEffect(() => {
    if (open && !user) {
      router.push(`/login?next=/tournaments/${tournament?._id}`);
    }
  }, [open, user, router, tournament]);

  // ✅ Fetch fresh tournament details on open
  useEffect(() => {
    async function fetchFresh() {
      try {
        if (!open || !tournament?._id) return;
        const res = await api.getTournament(tournament._id);
        setFreshTournament(res?.data || null);
      } catch {
        // ignore (modal can still work)
        setFreshTournament(null);
      }
    }
    fetchFresh();
  }, [open, tournament?._id]);

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
    setManualOpen(false);
    setManualCtx(null);
    setFreshTournament(null);
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

  // ✅ Find existing paymentId if already registered
  function findExistingPaymentId() {
    const t = freshTournament;
    if (!t || !user?.id) return null;

    if (t.tournamentType === "squad") {
      // tournament.teams might exist in some backend versions, but in your backend getTournament populates winners/participants only.
      // So squad paymentId often comes from TournamentTeam. If not present in getTournament, we can't detect here.
      // We'll rely on backend register-squad response paymentId OR add a backend endpoint later if needed.
      return null;
    }

    const participant = (t.participants || []).find((p) => String(p.userId?._id || p.userId) === String(user.id));
    return normalizeId(participant?.paymentId);
  }

  function openManual(paymentId) {
    setManualCtx({
      paymentId: paymentId || null,
      amount: payable,
      tournamentTitle: tournament?.title || ""
    });
    setManualOpen(true);
  }

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
      dispatch(showToast({ type: "error", title: "Registration Closed", message: "Registration is not open for this tournament" }));
      return;
    }

    // ✅ If payable > 0 and user already registered, DON'T re-register.
    if (payable > 0) {
      const existingPaymentId = findExistingPaymentId();
      if (existingPaymentId) {
        onClose?.();
        dispatch(showToast({ type: "info", title: "Already registered", message: "Payment pending. Please pay and submit UTR." }));
        openManual(existingPaymentId);
        return;
      }
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      dispatch(showToast({ type: "error", title: "Validation Error", message: errors.profile || "Please fill all required fields" }));
      return;
    }

    setLoading(true);
    try {
      const payloadBase = { couponCode: couponCode?.trim() || undefined };
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

      if (!res.success) {
        dispatch(showToast({ type: "error", title: "Registration Failed", message: res?.message || "Please try again" }));
        return;
      }

      onClose?.();

      if (payable === 0) {
        router.refresh();
        dispatch(showToast({ type: "success", title: "Registered Successfully", message: "You have been registered for the tournament" }));
        return;
      }

      // ✅ Use returned paymentId (backend payments/create-order expects paymentId)
      const paymentId = res?.data?.paymentId || res?.paymentId;

      if (paymentId) {
        dispatch(showToast({ type: "success", title: "Registration Done", message: "Pay via UPI and submit UTR for verification." }));
        openManual(paymentId);
        return;
      }

      // Fallback: re-fetch tournament to find paymentId (solo/duo)
      try {
        const fresh = await api.getTournament(tournament._id);
        setFreshTournament(fresh?.data || null);
        const pid = (() => {
          const t = fresh?.data;
          if (!t) return null;
          const participant = (t.participants || []).find((p) => String(p.userId?._id || p.userId) === String(user.id));
          return normalizeId(participant?.paymentId);
        })();

        if (pid) {
          dispatch(showToast({ type: "success", title: "Registration Done", message: "Pay via UPI and submit UTR for verification." }));
          openManual(pid);
          return;
        }
      } catch {
        // ignore
      }

      dispatch(showToast({ type: "error", title: "Payment Error", message: "PaymentId not found. Please contact support." }));
    } catch (error) {
      // If backend says already registered, recover by opening existing payment modal (solo/duo)
      const msg = String(error?.message || "");
      if (msg.toLowerCase().includes("already registered")) {
        try {
          const fresh = await api.getTournament(tournament._id);
          setFreshTournament(fresh?.data || null);
          const pid = (() => {
            const t = fresh?.data;
            if (!t) return null;
            const participant = (t.participants || []).find((p) => String(p.userId?._id || p.userId) === String(user.id));
            return normalizeId(participant?.paymentId);
          })();

          if (pid) {
            onClose?.();
            dispatch(showToast({ type: "info", title: "Already registered", message: "Payment pending. Please pay and submit UTR." }));
            openManual(pid);
            return;
          }
        } catch {
          // ignore
        }
      }

      dispatch(showToast({ type: "error", title: "Registration Failed", message: error?.message || "Please try again" }));
    } finally {
      setLoading(false);
    }
  }

  if (!tournament || !user) return null;

  return (
    <>
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
                <div className="text-2xl font-bold text-blue-600">
                  ₹{safeNum(tournament.prizePool, 0).toLocaleString("en-IN")}
                </div>
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
                {formErrors.profile && (
                  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
                    {formErrors.profile}
                  </div>
                )}

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
                            <div className="text-xl font-bold text-green-700">
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
                      placeholder="Enter partner's BGMI ID"
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
                          <div className="text-sm text-green-700 mt-1">No payment required. Confirm registration to join.</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FiInfo className="w-8 h-8 text-blue-600" />
                        <div>
                          <div className="font-bold text-blue-800">Manual UPI Payment</div>
                          <div className="text-sm text-blue-700 mt-1">
                            Proceed will open UPI + UTR submit popup (no redirect).
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

          {/* close icon slot for header if your Modal supports custom close */}
          <button className="hidden" type="button">
            <FiXCircle />
          </button>
        </div>
      </Modal>

      <ManualPaymentModal
        open={manualOpen}
        onClose={() => {
          setManualOpen(false);
          setManualCtx(null);
        }}
        paymentId={manualCtx?.paymentId}
        amount={manualCtx?.amount}
        tournamentTitle={manualCtx?.tournamentTitle}
      />
    </>
  );
}