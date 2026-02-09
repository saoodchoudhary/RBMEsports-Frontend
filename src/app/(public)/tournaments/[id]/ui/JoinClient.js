// app/(public)/tournaments/[id]/ui/JoinClient.js
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import JoinTournamentModal from "@/components/tournaments/JoinTournamentModal";

export default function JoinClient({ tournament }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isRegistrationOpen = tournament?.isRegistrationOpen && !tournament?.isFull;

  return (
    <>
      <Button 
        onClick={() => setModalOpen(true)}
        disabled={!isRegistrationOpen}
        className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        size="lg"
      >
        {isRegistrationOpen ? (
          <>
            Join Tournament
            <span className="ml-2">₹{tournament?.isFree ? 'FREE' : tournament?.serviceFee}</span>
          </>
        ) : (
          tournament?.isFull ? "Tournament Full" : "Registration Closed"
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