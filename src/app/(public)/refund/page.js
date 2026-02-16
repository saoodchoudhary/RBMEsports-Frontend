import LegalPage from "@/components/legal/LegalPage";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiSmartphone
} from "react-icons/fi";
import { GiTrophy, GiWallet } from "react-icons/gi";

export const metadata = {
  title: "Refund & Cancellation Policy | RBM ESports",
  description:
    "Refund & Cancellation Policy for RBM ESports skill-based BGMI tournaments."
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      subtitle="Refund rules for tournament entry fees, UPI payments, and cancellations."
      lastUpdated="2026-02-10"
    >
      <div className="space-y-6">

        {/* Platform Nature */}
        <div className="bg-gray-200  text-white p-5 rounded-lg">
          <div className="flex gap-3">
            <GiTrophy className="w-6 h-6" />
            <p className="text-sm text-gray-300">
              RBM ESports is a <strong className="text-white">
              skill-based esports tournament platform</strong>. 
              We do not provide gambling, betting, or chance-based games.
            </p>
          </div>
        </div>

        {/* Eligible Refunds */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <FiCheckCircle className="text-green-600" />
            1. Eligible Refund Scenarios
          </h2>

          <div className="space-y-3">

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="font-semibold text-sm">
                Tournament cancelled by RBM ESports
              </p>
              <p className="text-xs text-gray-600">
                Full refund issued after verification.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="font-semibold text-sm">
                Match cancelled due to technical/server issues
              </p>
              <p className="text-xs text-gray-600">
                Refund processed after admin review.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="font-semibold text-sm">
                Duplicate UPI payment
              </p>
              <p className="text-xs text-gray-600">
                Extra amount refunded after transaction verification.
              </p>
            </div>

          </div>
        </div>

        {/* Non Refundable */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <FiXCircle className="text-red-600" />
            2. Non-Refundable Cases
          </h2>

          <ul className="space-y-2 text-sm text-gray-700">
            <li>No-show after room ID shared</li>
            <li>User cancels after registration</li>
            <li>Incorrect BGMI details submitted</li>
            <li>Match already started/completed</li>
            <li>Disqualification due to cheating</li>
          </ul>
        </div>

        {/* Manual UPI Payments */}
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            <FiSmartphone />
            3. Manual UPI Payments
          </h2>

          <p className="text-sm text-gray-700 mb-2">
            Payments are collected via manual UPI / QR transfer.
            Users must submit valid payment proof.
          </p>

          <ul className="text-sm text-gray-700 space-y-1">
            <li>Valid UTR number required</li>
            <li>Screenshot must be unedited</li>
            <li>Fake proofs = no refund + ban</li>
          </ul>
        </div>

        {/* Wallet */}
        <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg">
          <div className="flex gap-3">
            <GiWallet className="w-5 h-5" />
            <p className="text-sm text-gray-700">
              Wallet credits, winnings, and bonuses are
              <strong> non-refundable</strong> once credited.
            </p>
          </div>
        </div>

        {/* Processing Time */}
        <div className="bg-white border border-gray-200 p-5 rounded-lg">
          <div className="flex gap-3">
            <FiClock />
            <p className="text-sm text-gray-700">
              Approved refunds are processed within
              <strong> 5–7 business days</strong> via UPI or bank transfer.
            </p>
          </div>
        </div>

        {/* Chargeback */}
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-lg">
          <div className="flex gap-3">
            <FiAlertTriangle />
            <p className="text-sm text-gray-700">
              Fraud complaints or false payment disputes may lead
              to permanent suspension.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="text-sm">
            Refund queries:{' '}
            <a
              href="mailto:rbmesports04@gmail.com"
              className="text-blue-600 font-semibold"
            >
              rbmesports04@gmail.com
            </a>
          </p>
        </div>

      </div>
    </LegalPage>
  );
}
