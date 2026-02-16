"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import JoinTournamentModal from "@/components/tournaments/JoinTournamentModal";
import { api } from "@/lib/api";
import { showToast } from "@/store/uiSlice";
import { GiSwordsPower, GiMachineGun } from "react-icons/gi";
import { FiShield, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";

export default function JoinClient({ tournament }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const isRegistrationOpen = Boolean(tournament?.isRegistrationOpen) && !Boolean(tournament?.isFull);
  const feeLabel = tournament?.isFree ? "FREE" : `₹${tournament?.serviceFee || 0}`;

  // ✅ Check registration status on mount
  useEffect(() => {
    async function checkStatus() {
      if (!user || !tournament?._id) return;

      try {
        const res = await api.getMyTournamentRegistration(tournament._id);
        if (res.success && res.data?.registered) {
          setRegistrationStatus(res.data);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    }

    checkStatus();
  }, [user, tournament?._id]);

  // ✅ Get button state based on registration
  function getButtonState() {
    if (!user) {
      return {
        text: "LOGIN TO JOIN",
        icon: <FiShield className="w-4 h-4 sm:w-5 sm:h-5" />,
        className: "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed",
        disabled: true
      };
    }

    if (checking) {
      return {
        text: "CHECKING...",
        icon: <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>,
        className: "bg-gray-400 text-white cursor-wait",
        disabled: true
      };
    }

    // ✅ Already registered with payment done
    if (registrationStatus && (registrationStatus.paymentStatus === "paid" || registrationStatus.paymentStatus === "success")) {
      return {
        text: "ALREADY REGISTERED",
        icon: <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
        className: "bg-green-500 text-white cursor-not-allowed",
        disabled: true
      };
    }

    // ✅ Payment pending - allow click to open payment modal
    if (registrationStatus && (registrationStatus.paymentStatus === "pending" || registrationStatus.paymentStatus === "on_hold")) {
      return {
        text: "PAYMENT PENDING",
        icon: <FiClock className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />,
        className: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-105",
        disabled: false,
        fee: "Complete Payment"
      };
    }

    // ✅ Tournament full
    if (tournament?.isFull) {
      return {
        text: "TOURNAMENT FULL",
        icon: <FiUsers className="w-4 h-4 sm:w-5 sm:h-5" />,
        className: "bg-red-500 text-white cursor-not-allowed",
        disabled: true
      };
    }

    // ✅ Registration closed
    if (!isRegistrationOpen) {
      return {
        text: "REGISTRATION CLOSED",
        icon: <FiShield className="w-4 h-4 sm:w-5 sm:h-5" />,
        className: "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed",
        disabled: true
      };
    }

    // ✅ Normal join state
    return {
      text: "JOIN TOURNAMENT",
      icon: <GiSwordsPower className="w-4 h-4 sm:w-5 sm:h-5" />,
      className: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105",
      disabled: false,
      fee: feeLabel
    };
  }

  // ✅ Handle button click
  async function handleClick() {
    if (!user) {
      dispatch(showToast({ type: "error", title: "Login Required", message: "Please login to join tournament" }));
      return;
    }

    if (!isRegistrationOpen && !registrationStatus) {
      return;
    }

    setChecking(true);
    try {
      const res = await api.getMyTournamentRegistration(tournament._id);
      
      if (res.success && res.data?.registered) {
        setRegistrationStatus(res.data);

        // ✅ Payment done - show message
        if (res.data.paymentStatus === "paid" || res.data.paymentStatus === "success") {
          dispatch(showToast({ 
            type: "info", 
            title: "Already Registered", 
            message: "You are already registered for this tournament" 
          }));
          return;
        }

        // ✅ Payment pending - open modal (will trigger payment popup)
        if (res.data.paymentId && (res.data.paymentStatus === "pending" || res.data.paymentStatus === "on_hold")) {
          setModalOpen(true);
          return;
        }
      }

      // ✅ Not registered - open modal normally
      setModalOpen(true);
    } catch (error) {
      console.error("Error checking registration:", error);
      // On error, still open modal (safe default)
      setModalOpen(true);
    } finally {
      setChecking(false);
    }
  }

  const buttonState = getButtonState();

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={buttonState.disabled}
        className={`w-full font-bold text-sm sm:text-base py-3 sm:py-3.5 lg:py-4 flex items-center justify-center gap-2 transition-all ${buttonState.className}`}
        size="lg"
        type="button"
      >
        {buttonState.icon}
        <span>{buttonState.text}</span>
        {buttonState.fee && (
          <span className="ml-1 sm:ml-2 bg-white/20 px-2 py-1 rounded-md text-xs sm:text-sm font-bold">
            {buttonState.fee}
          </span>
        )}
      </Button>

      <JoinTournamentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tournament={tournament}
      />
    </>
  );
}