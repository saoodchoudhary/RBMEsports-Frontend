"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import JoinTournamentModal from "@/components/tournaments/JoinTournamentModal";
import { GiSwordsPower, GiMachineGun, GiBattleGear } from "react-icons/gi";
import { FiShield, FiUsers } from "react-icons/fi";

export default function JoinClient({ tournament }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isRegistrationOpen = Boolean(tournament?.isRegistrationOpen) && !Boolean(tournament?.isFull);

  const feeLabel = tournament?.isFree ? "FREE" : `₹${tournament?.serviceFee || 0}`;

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        disabled={!isRegistrationOpen}
        className={`w-full font-bold text-sm sm:text-base py-3 sm:py-3.5 lg:py-4 flex items-center justify-center gap-2 transition-all ${
          isRegistrationOpen
            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105"
            : tournament?.isFull
              ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed"
              : "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed"
        }`}
        size="lg"
        type="button"
      >
        {isRegistrationOpen ? (
          <>
            <GiSwordsPower className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>JOIN TOURNAMENT</span>
            <span className="ml-1 sm:ml-2 bg-white/20 px-2 py-1 rounded-md text-xs sm:text-sm font-bold">
              {feeLabel}
            </span>
          </>
        ) : tournament?.isFull ? (
          <>
            <FiUsers className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>TOURNAMENT FULL</span>
          </>
        ) : (
          <>
            <FiShield className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>REGISTRATION CLOSED</span>
          </>
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