import LegalPage from "@/components/legal/LegalPage";
import {
  FiAlertTriangle,
  FiUserCheck,
  FiUserX,
  FiClock,
  FiFileText,
  FiSmartphone
} from "react-icons/fi";
import {
  GiTrophy,
  GiSwordsPower
} from "react-icons/gi";
import { MdGavel, MdVerified } from "react-icons/md";

export const metadata = {
  title: "Terms & Conditions | RBM ESports",
  description: "Terms & Conditions governing use of RBM ESports platform."
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      subtitle="These Terms & Conditions govern your use of RBM ESports tournaments and services."
      lastUpdated="2026-02-10"
    >
      <div className="space-y-6">

        {/* 1 Acceptance */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-2">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm text-gray-700">
            By registering on <strong>RBM ESports</strong>, users agree to comply
            with all tournament rules, policies, and platform guidelines.
          </p>
        </div>

        {/* 2 Platform Nature */}
        <div className="bg-gray-200 border border-gray-700 text-white p-5 rounded-lg">
          <div className="flex gap-3">
            <GiTrophy className="w-6 h-6" />
            <p className="text-sm text-gray-300">
              RBM ESports is a <strong className="text-white">skill-based esports
              tournament platform</strong>. We do not provide gambling, betting,
              lottery, or chance-based gaming services.
            </p>
          </div>
        </div>

        {/* 3 Eligibility */}
        <div>
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <FiUserCheck /> 3. User Eligibility
          </h2>

          <ul className="space-y-2 text-sm text-gray-700">
            <li>Users must provide correct BGMI details.</li>
            <li>Multiple accounts are prohibited.</li>
            <li>Violation may lead to permanent suspension.</li>
          </ul>
        </div>

        {/* 4 Tournament Rules */}
        <div>
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <GiSwordsPower /> 4. Tournament Rules
          </h2>

          <ul className="space-y-2 text-sm text-gray-700">
            <li>Players must join matches on time.</li>
            <li>Cheats / hacks strictly prohibited.</li>
            <li>Organizer decisions are final.</li>
          </ul>
        </div>

        {/* 5 Payments - Updated Manual UPI */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            <FiSmartphone /> 5. Payments (Manual UPI System)
          </h2>

          <p className="text-sm text-gray-700 mb-2">
            Tournament participation fees are collected via manual UPI / QR
            payments. Users must upload valid payment proof.
          </p>

          <ul className="text-sm text-gray-700 space-y-1">
            <li>UPI Transaction ID (UTR) required.</li>
            <li>Screenshot proof mandatory.</li>
            <li>Fake / edited proofs lead to ban.</li>
          </ul>
        </div>

        {/* 6 Prize Distribution */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            <GiTrophy /> 6. Prize Distribution
          </h2>

          <p className="text-sm text-gray-700">
            Prize winnings are credited after result verification.
            Payouts are processed via UPI / bank transfer / wallet.
          </p>
        </div>

        {/* 7 Refund */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            <FiFileText /> 7. Refund Policy
          </h2>

          <p className="text-sm text-gray-700">
            Entry fees are non-refundable once tournament begins.
            Refunds apply only if tournament is cancelled.
          </p>
        </div>

        {/* 8 Suspension */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            <FiUserX /> 8. Account Suspension
          </h2>

          <p className="text-sm text-gray-700">
            Fraud payments, fake screenshots, abuse, or cheating may lead
            to permanent suspension.
          </p>
        </div>

        {/* 9 Liability */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            <FiAlertTriangle /> 9. Limitation of Liability
          </h2>

          <p className="text-sm text-gray-700">
            RBM ESports is not responsible for server crashes,
            connectivity issues, or technical disruptions.
          </p>
        </div>

        {/* 10 Modifications */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            <FiClock /> 10. Modifications
          </h2>

          <p className="text-sm text-gray-700">
            Terms may be updated anytime. Continued use means acceptance.
          </p>
        </div>

        {/* 11 Contact */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex gap-3">
            <MdGavel className="w-5 h-5" />
            <div>
              <h2 className="font-bold">11. Contact</h2>
              <p className="text-sm text-gray-700">
                rbmesports04@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Compliance badge */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <MdVerified className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-gray-500">
            Skill-based esports platform • No gambling
          </span>
        </div>

      </div>
    </LegalPage>
  );
}
