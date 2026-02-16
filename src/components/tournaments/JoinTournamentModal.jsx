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
  FiXCircle,
  FiArrowRight,
  FiArrowLeft,
  FiUser
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

function normalizePaymentStatus(s) {
  const x = String(s || "").toLowerCase().trim();
  if (x === "paid") return "success";
  return x;
}

function TabPill({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition",
        active
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-sm"
          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function StatChip({ icon, label, value, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-emerald-50 border-emerald-200 text-emerald-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    slate: "bg-slate-50 border-slate-200 text-slate-800"
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs sm:text-sm ${tones[tone] || tones.blue}`}>
      <span className="text-base">{icon}</span>
      <span className="font-semibold">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
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

  // Members for squad (EXCLUDING captain)
  const [members, setMembers] = useState([]);

  // ✅ Registration fetch state (fresh from backend)
  const [checkingReg, setCheckingReg] = useState(false);
  const [myReg, setMyReg] = useState(null); // { registered, paymentId, paymentStatus, teammates }

  // ✅ Manual payment modal state
  const [manualOpen, setManualOpen] = useState(false);
  const [manualPaymentId, setManualPaymentId] = useState(null);

  const baseAmount = tournament?.isFree ? 0 : safeNum(tournament?.serviceFee, 0);
  const isRegistrationOpen = Boolean(tournament?.isRegistrationOpen) && !Boolean(tournament?.isFull);

  const payable = useMemo(() => couponInfo?.finalAmount ?? baseAmount, [couponInfo, baseAmount]);
  const discount = safeNum(couponInfo?.discountAmount, 0);
  const showCoupon = !tournament?.isFree;

  const title = tournament?.title || "Tournament";
  const typeLabel =
    tournament?.tournamentType === "solo"
      ? "Solo"
      : tournament?.tournamentType === "duo"
        ? "Duo"
        : "Squad";

  const regStatus = normalizePaymentStatus(myReg?.paymentStatus);
  const regPaymentId = myReg?.paymentId || null;
  const regRegistered = Boolean(myReg?.registered);

  const isPendingLike = regRegistered && (regStatus === "pending" || regStatus === "on_hold");
  const isConfirmed = regRegistered && regStatus === "success";

  useEffect(() => {
    if (open && !user) {
      router.push(`/login?next=/tournaments/${tournament?._id}`);
    }
  }, [open, user, router, tournament]);

  function openManual(paymentId) {
    setManualPaymentId(paymentId);
    setManualOpen(true);
  }

  const initializeMembers = () => {
    if (!tournament) return;

    if (tournament.tournamentType === "squad") {
      const teamSize = tournament.teamSize || 4;
      const additionalMembers = Math.max(0, teamSize - 1);
      setMembers(Array(additionalMembers).fill(null).map(() => emptyMember()));
    } else {
      setMembers([]);
    }
  };

  const resetForm = () => {
    setActiveTab("details");
    setCouponCode("");
    setCouponInfo(null);
    setTeamName("");
    setPartnerBgmiId("");
    setPartnerInGameName("");
    setFormErrors({});
    setManualOpen(false);
    setManualPaymentId(null);

    setMyReg(null);
    setCheckingReg(false);

    if (tournament) initializeMembers();
  };

  useEffect(() => {
    if (!open) resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ✅ Fetch my-registration whenever modal opens (fresh, so pending state is accurate)
  useEffect(() => {
    async function fetchMyRegistration() {
      if (!open) return;
      if (!user?.id) return;
      if (!tournament?._id) return;

      setCheckingReg(true);
      try {
        const res = await api.getMyTournamentRegistration(tournament._id);
        const data = res?.data || null;
        setMyReg(data);

        // ✅ Prefill teammate data if already registered (so user doesn't re-enter)
        if (data?.registered && data?.teammates) {
          if (tournament.tournamentType === "squad") {
            if (data.teammates.teamName) setTeamName(data.teammates.teamName);

            const backendMembers = Array.isArray(data.teammates.members) ? data.teammates.members : [];
            const teamSize = tournament.teamSize || 4;
            const additionalMembers = Math.max(0, teamSize - 1);

            const filled = [];
            for (let i = 0; i < additionalMembers; i++) {
              filled.push({
                bgmiId: backendMembers[i]?.bgmiId || "",
                inGameName: backendMembers[i]?.inGameName || ""
              });
            }
            setMembers(filled);
          }

          if (tournament.tournamentType === "duo") {
            const p = data?.teammates?.partnerInfo;
            if (p?.bgmiId) setPartnerBgmiId(p.bgmiId);
            if (p?.inGameName) setPartnerInGameName(p.inGameName);
          }
        } else {
          // not registered => fresh empty init
          initializeMembers();
        }

        // ✅ If already confirmed, close modal (no need to open payment again)
        const st = normalizePaymentStatus(data?.paymentStatus);
        if (data?.registered && st === "success") {
          dispatch(
            showToast({
              type: "info",
              title: "Already Registered",
              message: "Your slot is confirmed."
            })
          );
          onClose?.();
        }
      } catch (e) {
        setMyReg(null);
      } finally {
        setCheckingReg(false);
      }
    }

    fetchMyRegistration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tournament?._id, user?.id]);

  const tabs = [
    { key: "details", label: "Details", icon: <FiAward className="w-4 h-4" /> },
    (tournament?.tournamentType === "squad" || tournament?.tournamentType === "duo") && {
      key: "teammates",
      label: tournament?.tournamentType === "duo" ? "Partner" : "Team",
      icon: tournament?.tournamentType === "duo"
        ? <BsFillPeopleFill className="w-4 h-4" />
        : <GiTeamIdea className="w-4 h-4" />
    },
    { key: "payment", label: "Payment", icon: <FiCreditCard className="w-4 h-4" /> }
  ].filter(Boolean);

  const validateForm = () => {
    const errors = {};

    if (!user?.bgmiId || !user?.inGameName) {
      errors.profile = "Please complete your profile (BGMI ID + In‑Game Name) before registering.";
    }

    // If already registered & pending, DON'T force re-validation (we will show prefilled locked UI)
    if (regRegistered) return errors;

    if (tournament?.tournamentType === "duo") {
      if (!partnerBgmiId.trim()) errors.partnerBgmiId = "Partner BGMI ID is required";
      if (!partnerInGameName.trim()) errors.partnerInGameName = "Partner In‑Game Name is required";
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
        dispatch(
          showToast({
            type: "success",
            title: "Coupon Applied",
            message: `₹${safeNum(res.data.discountAmount, 0)} discount applied`
          })
        );
      } else {
        dispatch(showToast({ type: "error", title: "Coupon Error", message: res?.message || "Failed to apply coupon" }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", title: "Invalid Coupon", message: error?.message || "Invalid coupon" }));
    } finally {
      setVerifyingCoupon(false);
    }
  }

  function canContinueToPayment() {
    if (!isRegistrationOpen && !regRegistered) return false;
    if (!user?.bgmiId || !user?.inGameName) return false;

    // If already registered, allow continue (so user can go to payment tab and pay)
    if (regRegistered) return true;

    if (tournament?.tournamentType === "duo") {
      return Boolean(partnerBgmiId.trim() && partnerInGameName.trim());
    }
    if (tournament?.tournamentType === "squad") {
      return members.every((m) => m.bgmiId.trim() && m.inGameName.trim());
    }
    return true;
  }

  async function handleProceedOrPayNow() {
    // ✅ If already registered & pending/on_hold => just open manual modal (no re-register, no re-enter)
    if (isPendingLike && regPaymentId) {
      openManual(regPaymentId);
      return;
    }

    // ✅ If registered and failed => allow retry by opening manual modal if paymentId exists
    if (regRegistered && regStatus === "failed" && regPaymentId) {
      openManual(regPaymentId);
      return;
    }

    // ✅ Not registered => do register
    await handleRegister();
  }

  async function handleRegister() {
    if (!tournament?._id) return;

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      dispatch(showToast({ type: "error", title: "Fix Errors", message: errors.profile || "Please fix the highlighted fields" }));
      return;
    }

    if (!isRegistrationOpen) {
      dispatch(showToast({ type: "error", title: "Registration Closed", message: "Registration is currently closed" }));
      return;
    }

    setLoading(true);
    try {
      let payload = {};
      if (!tournament?.isFree) payload.couponCode = couponCode.trim() || undefined;

      if (tournament.tournamentType === "duo") {
        payload.partnerBgmiId = partnerBgmiId.trim();
        payload.partnerInGameName = partnerInGameName.trim();
      }

      if (tournament.tournamentType === "squad") {
        payload.teamName = teamName.trim() || undefined;
        payload.members = members.map((m) => ({ bgmiId: m.bgmiId.trim(), inGameName: m.inGameName.trim() }));
      }

      const res =
        tournament.tournamentType === "squad"
          ? await api.registerSquad(tournament._id, payload)
          : await api.registerSoloDuo(tournament._id, payload);

      dispatch(showToast({ type: "success", title: "Registered", message: res?.message || "Registered successfully" }));

      const paymentId = res?.payment?.id || null;
      const paymentStatus = normalizePaymentStatus(res?.payment?.paymentStatus);

      // ✅ If payment required => open manual popup immediately
      if (paymentId && (paymentStatus === "pending" || paymentStatus === "on_hold")) {
        openManual(paymentId);

        // refresh myRegistration state so modal shows pending if user closes manual
        try {
          const fresh = await api.getMyTournamentRegistration(tournament._id);
          setMyReg(fresh?.data || null);
        } catch {}

        return;
      }

      // ✅ Free / ₹0 => close
      onClose?.();
      router.refresh();
    } catch (error) {
      dispatch(showToast({ type: "error", title: "Failed", message: error?.message || "Registration failed" }));
    } finally {
      setLoading(false);
    }
  }

  const paymentBanner = useMemo(() => {
    if (!regRegistered) return null;

    if (regStatus === "pending") {
      return {
        tone: "blue",
        title: "Payment Pending",
        msg: "Your slot is booked. Please pay via UPI and submit UTR to confirm.",
        cta: "Pay Now / Submit UTR"
      };
    }

    if (regStatus === "on_hold") {
      return {
        tone: "amber",
        title: "Under Review",
        msg: "Your UTR has been submitted. Admin will verify your payment soon.",
        cta: "View / Re-submit UTR"
      };
    }

    if (regStatus === "failed") {
      return {
        tone: "red",
        title: "Payment Failed / Rejected",
        msg: "Your payment was rejected. You can try again.",
        cta: "Try Again"
      };
    }

    if (regStatus === "success") {
      return {
        tone: "green",
        title: "Registration Confirmed",
        msg: "Your slot is confirmed.",
        cta: null
      };
    }

    return null;
  }, [regRegistered, regStatus]);

  function bannerClass(tone) {
    if (tone === "blue") return "border-blue-200 bg-blue-50 text-blue-900";
    if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-900";
    if (tone === "red") return "border-red-200 bg-red-50 text-red-900";
    if (tone === "green") return "border-emerald-200 bg-emerald-50 text-emerald-900";
    return "border-slate-200 bg-slate-50 text-slate-900";
  }

  // ✅ Get current tab index
  const currentTabIndex = tabs.findIndex((t) => t.key === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  // ✅ Navigation functions
  function goToPreviousTab() {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].key);
    }
  }

  function goToNextTab() {
    if (!isLastTab) {
      setActiveTab(tabs[currentTabIndex + 1].key);
    }
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title="Join Tournament" maxWidth="max-w-4xl">
        <div className="space-y-5">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-white p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <FiAward className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Tournament</div>
                    <div className="text-lg sm:text-xl font-black text-slate-900">{title}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatChip icon={<FiShield className="w-4 h-4" />} label="Type" value={typeLabel} tone="slate" />
                  <StatChip
                    icon={<FiUsers className="w-4 h-4" />}
                    label="Spots"
                    value={`${safeNum(tournament?.currentParticipants, 0)} / ${safeNum(tournament?.maxParticipants, 0)}`}
                    tone="blue"
                  />
                  <StatChip
                    icon={<FiDollarSign className="w-4 h-4" />}
                    label="Entry"
                    value={tournament?.isFree ? "FREE" : `₹${baseAmount}`}
                    tone={tournament?.isFree ? "green" : "amber"}
                  />
                </div>

                {!isRegistrationOpen && !regRegistered && (
                  <div className="mt-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm flex gap-2">
                    <FiXCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="font-semibold">Registration is currently closed for this tournament.</div>
                  </div>
                )}

                {formErrors.profile && (
                  <div className="mt-4 p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm flex gap-2">
                    <FiInfo className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold">Profile incomplete</div>
                      <div className="text-amber-800">{formErrors.profile}</div>
                    </div>
                  </div>
                )}

                {/* ✅ Payment pending banner */}
                {paymentBanner && (
                  <div className={`mt-4 p-3 rounded-xl border text-sm flex items-start gap-2 ${bannerClass(paymentBanner.tone)}`}>
                    <FiInfo className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-black">{paymentBanner.title}</div>
                      <div className="opacity-90">{paymentBanner.msg}</div>

                      {paymentBanner.cta && regPaymentId && (
                        <div className="mt-2">
                          <Button type="button" onClick={() => openManual(regPaymentId)} size="sm">
                            {paymentBanner.cta}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Payable card */}
              <div className="sm:w-72 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs text-slate-500">Payable</div>
                <div className="text-3xl font-black text-slate-900">
                  ₹{safeNum(isPendingLike && myReg?.paymentStatus ? (myReg?.amount ?? payable) : payable, 0)}
                </div>

                {discount > 0 ? (
                  <div className="mt-2 text-sm text-emerald-700 flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4" />
                    Discount applied: ₹{discount}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-slate-500">
                    {tournament?.isFree ? "No payment required" : "Apply coupon to reduce amount"}
                  </div>
                )}

                <div className="mt-3 text-[11px] text-slate-500">
                  Manual UPI payments are verified by admin.
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            {tabs.map((t) => (
              <TabPill
                key={t.key}
                active={activeTab === t.key}
                onClick={() => setActiveTab(t.key)}
                icon={t.icon}
                label={t.label}
              />
            ))}
          </div>

          {/* Loading registration */}
          {checkingReg ? (
            <div className="p-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm">
              Checking your registration status...
            </div>
          ) : null}

          {/* Content */}
          <div className="space-y-5">
            {/* DETAILS */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <FiInfo className="w-4 h-4 text-blue-600" />
                    Summary
                  </div>

                  <div className="mt-3 text-sm text-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Tournament Type</span>
                      <span className="font-bold">{typeLabel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Entry Fee</span>
                      <span className="font-bold">{tournament?.isFree ? "FREE" : `₹${baseAmount}`}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Payable (after coupon)</span>
                      <span className="font-extrabold text-blue-600">₹{safeNum(payable, 0)}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-sm flex gap-2">
                    <FiShield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold">How it works</div>
                      <div className="text-blue-800">
                        Register → Pay via UPI → Submit UTR → Admin verifies → Slot confirmed.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <FiUser className="w-4 h-4 text-indigo-600" />
                    Your Auto Details
                  </div>

                  <div className="mt-3 space-y-3">
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="text-xs text-slate-500">BGMI ID</div>
                      <div className="font-mono text-sm font-bold text-slate-900">{user?.bgmiId || "—"}</div>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="text-xs text-slate-500">In‑Game Name</div>
                      <div className="text-sm font-bold text-slate-900">{user?.inGameName || "—"}</div>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      These are auto-filled as Captain (You).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEAM / PARTNER */}
            {activeTab === "teammates" && tournament?.tournamentType === "duo" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <BsFillPeopleFill className="w-4 h-4 text-blue-600" />
                    Partner Details
                  </div>
                  <div className="text-xs text-slate-500">{regRegistered ? "Locked (already registered)" : "Required"}</div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Partner BGMI ID"
                    value={partnerBgmiId}
                    onChange={(e) => setPartnerBgmiId(e.target.value)}
                    error={formErrors.partnerBgmiId}
                    placeholder="Enter partner BGMI ID"
                    disabled={regRegistered}
                  />
                  <Input
                    label="Partner In‑Game Name"
                    value={partnerInGameName}
                    onChange={(e) => setPartnerInGameName(e.target.value)}
                    error={formErrors.partnerInGameName}
                    placeholder="Enter partner IGN"
                    disabled={regRegistered}
                  />
                </div>
              </div>
            )}

            {activeTab === "teammates" && tournament?.tournamentType === "squad" && (
              <div className="space-y-4">
                {/* Captain card (auto) */}
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center text-white">
                        <FiUsers className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-black text-slate-900">Captain (You)</div>
                        <div className="text-xs text-slate-600">Auto-filled from your profile</div>
                      </div>
                    </div>
                    <div className="text-[11px] px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                      AUTO
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-emerald-200 bg-white">
                      <div className="text-xs text-slate-500">BGMI ID</div>
                      <div className="font-mono font-black text-slate-900">{user?.bgmiId || "—"}</div>
                    </div>
                    <div className="p-3 rounded-xl border border-emerald-200 bg-white">
                      <div className="text-xs text-slate-500">In‑Game Name</div>
                      <div className="font-black text-slate-900">{user?.inGameName || "—"}</div>
                    </div>
                  </div>
                </div>

                {/* Team name */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <GiTeamIdea className="w-4 h-4 text-indigo-600" />
                    Team Info
                  </div>
                  <div className="mt-3">
                    <Input
                      label="Team Name (optional)"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g., RBM Warriors"
                      disabled={regRegistered}
                    />
                  </div>
                </div>

                {/* Other teammates */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-black text-slate-900">Teammates</div>
                    <div className="text-xs text-slate-500">{regRegistered ? "Locked (already registered)" : "Required"}</div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {members.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-slate-800">Teammate {idx + 1}</div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            label="BGMI ID"
                            value={m.bgmiId}
                            onChange={(e) => {
                              const next = [...members];
                              next[idx] = { ...next[idx], bgmiId: e.target.value };
                              setMembers(next);
                            }}
                            error={formErrors[`member${idx}BgmiId`]}
                            placeholder="Enter BGMI ID"
                            disabled={regRegistered}
                          />
                          <Input
                            label="In‑Game Name"
                            value={m.inGameName}
                            onChange={(e) => {
                              const next = [...members];
                              next[idx] = { ...next[idx], inGameName: e.target.value };
                              setMembers(next);
                            }}
                            error={formErrors[`member${idx}InGameName`]}
                            placeholder="Enter IGN"
                            disabled={regRegistered}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT */}
            {activeTab === "payment" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Coupon */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <FiTag className="w-4 h-4 text-blue-600" />
                    Coupon
                  </div>

                  {!showCoupon ? (
                    <div className="mt-3 text-sm text-slate-600">This tournament is free. No coupon needed.</div>
                  ) : (
                    <>
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                          <Input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            disabled={regRegistered} // lock if already registered
                          />
                        </div>
                        <Button type="button" onClick={applyCoupon} disabled={regRegistered || verifyingCoupon || !couponCode.trim()}>
                          {verifyingCoupon ? "Applying..." : "Apply"}
                        </Button>
                      </div>

                      {couponInfo ? (
                        <div className="mt-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm flex gap-2">
                          <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-bold">Coupon applied</div>
                            <div className="text-emerald-800">
                              Discount: ₹{safeNum(couponInfo.discountAmount, 0)} | Final: ₹{safeNum(couponInfo.finalAmount, 0)}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>

                {/* Amount summary */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <FiCreditCard className="w-4 h-4 text-indigo-600" />
                    Payment Summary
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Base</span>
                      <span className="font-bold">₹{baseAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Discount</span>
                      <span className={`font-bold ${discount > 0 ? "text-emerald-700" : ""}`}>-₹{discount}</span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-black">Payable</span>
                      <span className="text-blue-600 font-black text-xl">₹{safeNum(payable, 0)}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-sm flex gap-2">
                    <FiInfo className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold">Manual UPI</div>
                      <div className="text-blue-800">Proceed will open UPI + UTR submit popup.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Footer Navigation - Back/Next/Proceed Buttons */}
          <div className="sticky bottom-0 bg-white pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-slate-600 flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 text-blue-600" />
                <span>
                  Total: <span className="font-black text-slate-900">₹{safeNum(payable, 0)}</span>
                </span>
              </div>

              <div className="flex gap-2">
                {/* ✅ Back Button */}
                {!isFirstTab && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={goToPreviousTab}
                    className="flex items-center gap-1"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}

                {/* ✅ Close Button (only on first tab OR when on payment tab) */}
                {(isFirstTab || isLastTab) && (
                  <Button type="button" variant="outline" onClick={onClose}>
                    Close
                  </Button>
                )}

                {/* ✅ Next Button (not on last tab) */}
                {!isLastTab && (
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    // disabled={!canContinueToPayment()}
                    className="flex items-center gap-1"
                  >
                    Next
                    <FiArrowRight className="w-4 h-4" />
                  </Button>
                )}

                {/* ✅ Proceed Button (only on payment tab) */}
                {isLastTab && (
                  <Button
                    type="button"
                    onClick={handleProceedOrPayNow}
                    disabled={loading || (!isRegistrationOpen && !regRegistered) || checkingReg}
                    loading={loading}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    {regRegistered
                      ? (regStatus === "on_hold" ? "View / Update UTR" : "Pay Now / Submit UTR")
                      : (payable === 0 ? "Confirm Registration" : "Proceed & Pay")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Manual Payment Modal */}
      <ManualPaymentModal
        open={manualOpen}
        paymentId={manualPaymentId}
        onClose={async () => {
          setManualOpen(false);
          setManualPaymentId(null);

          // ✅ After closing manual modal, refresh reg state so UI shows pending/under review correctly
          if (user?.id && tournament?._id) {
            try {
              const fresh = await api.getMyTournamentRegistration(tournament._id);
              setMyReg(fresh?.data || null);
            } catch {}
          }
        }}
        amount={payable}
        tournamentTitle={tournament?.title}
      />
    </>
  );
}