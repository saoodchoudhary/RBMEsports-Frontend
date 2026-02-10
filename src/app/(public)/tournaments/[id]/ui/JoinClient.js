"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import JoinTournamentModal from "@/components/tournaments/JoinTournamentModal";

export default function JoinClient({ tournament }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isRegistrationOpen = Boolean(tournament?.isRegistrationOpen) && !Boolean(tournament?.isFull);

  const feeLabel = tournament?.isFree ? "FREE" : `₹${tournament?.serviceFee || 0}`;

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        disabled={!isRegistrationOpen}
        className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        size="lg"
        type="button"
      >
        {isRegistrationOpen ? (
          <>
            Join Tournament
            <span className="ml-2">{feeLabel}</span>
          </>
        ) : tournament?.isFull ? (
          "Tournament Full"
        ) : (
          "Registration Closed"
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