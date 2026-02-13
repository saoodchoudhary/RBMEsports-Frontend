import LegalPage from "@/components/legal/LegalPage";
import { FiCheckCircle, FiXCircle, FiClock, FiAlertTriangle, FiCreditCard } from "react-icons/fi";
import { GiMoneyStack, GiTrophy, GiWallet } from "react-icons/gi";
import { MdCancel, MdVerified } from "react-icons/md";

export const metadata = {
  title: "Refund & Cancellation Policy | RBM ESports",
  description: "Refund & Cancellation Policy for RBM ESports skill-based BGMI tournaments."
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      subtitle="Refund rules for tournament entry fees, wallet payments, and cancellations."
      lastUpdated="2026-02-10"
    >
      <div className="space-y-6">

        {/* Platform Nature - Highlighted */}
        <div className="bg-gradient-to-br  text-white p-5 rounded-lg border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
              <GiTrophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">1. Platform Nature</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                RBM ESports is a <strong className="text-white">skill-based esports tournament platform</strong> for BGMI. 
                We do not offer gambling, betting, lottery, or chance-based games. Entry fees are charged 
                only for tournament organization, technology, and operational services.
              </p>
            </div>
          </div>
        </div>

        {/* Eligible Refund Scenarios */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            2. Eligible Refund Scenarios
          </h2>
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Tournament cancelled by RBM ESports</p>
                  <p className="text-sm text-gray-700 mt-1">Full entry fee refund processed within 5-7 business days.</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Match cancelled due to server/technical issues</p>
                  <p className="text-sm text-gray-700 mt-1">Refund processed after verification by our support team.</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Duplicate payment</p>
                  <p className="text-sm text-gray-700 mt-1">Extra amount refunded after manual review.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Non-Refundable Cases */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiXCircle className="w-5 h-5 text-red-600" />
            3. Non-Refundable Cases
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-red-600 font-bold text-lg leading-none">•</span>
              <span className="text-sm text-gray-700">Player fails to join match (No-show)</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-red-600 font-bold text-lg leading-none">•</span>
              <span className="text-sm text-gray-700">User cancels after registration confirmation</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-red-600 font-bold text-lg leading-none">•</span>
              <span className="text-sm text-gray-700">Disqualification due to cheating or rule violation</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-red-600 font-bold text-lg leading-none">•</span>
              <span className="text-sm text-gray-700">Incorrect BGMI ID / details submitted by user</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 sm:col-span-2">
              <span className="text-red-600 font-bold text-lg leading-none">•</span>
              <span className="text-sm text-gray-700">Match already started or completed</span>
            </div>
          </div>
        </div>

        {/* Wallet & Prize Refunds */}
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
              <GiWallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">4. Wallet & Prize Refunds</h2>
              <p className="text-sm text-gray-700">
                Wallet credits, winnings, and bonus amounts are <strong className="text-gray-900">non-refundable and non-reversible</strong> once credited.
              </p>
            </div>
          </div>
        </div>

        {/* Processing Time */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0">
              <FiClock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">5. Refund Processing Time</h2>
              <p className="text-sm text-gray-700 mb-1">
                Approved refunds are processed within <strong className="text-gray-900">5–7 business days</strong>.
              </p>
              <p className="text-xs text-gray-500">
                Actual credit time depends on your bank/payment provider.
              </p>
            </div>
          </div>
        </div>

        {/* Chargeback Warning */}
        <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">6. Chargeback Warning</h2>
              <p className="text-sm text-gray-700">
                Unauthorized chargebacks without contacting support may lead to <strong className="text-red-600">immediate account suspension</strong> 
                and permanent participation restrictions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="font-bold text-gray-900 mb-2">7. Contact</h2>
          <p className="text-sm text-gray-700">
            For refund queries:{' '}
            <a href="mailto:rbmesports04@gmail.com" className="text-blue-600 font-semibold hover:underline">
              rbmesports04@gmail.com
            </a>
          </p>
        </div>
      </div>
    </LegalPage>
  );
}