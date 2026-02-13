import LegalPage from "@/components/legal/LegalPage";
import { 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiCreditCard, 
  FiShield, 
  FiUserCheck,
  FiUserX,
  FiClock,
  FiFileText
} from "react-icons/fi";
import { 
  GiTrophy, 
  GiCrossedSwords, 
  GiSwordsPower, 
  GiShield as GiShieldIcon,
  GtGavel 
} from "react-icons/gi";
import { MdGavel, MdSecurity, MdVerified } from "react-icons/md";

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

        {/* Section 1 - Acceptance */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            By registering on <strong className="text-gray-900">RBM ESports (rbmesports.co)</strong>, users agree to comply with all
            tournament rules, policies, and platform guidelines. Continued use of the platform constitutes
            acceptance of these terms.
          </p>
        </div>

        {/* Section 2 - Platform Nature - Highlighted */}
        <div className=" text-white p-5 rounded-lg border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
              <GiTrophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">2. Platform Nature</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                RBM ESports is a <strong className="text-white">skill-based esports tournament platform</strong> for BGMI.
                We <span className="text-yellow-400 font-bold">do not provide gambling, betting, lottery, or chance-based gaming services</span>.
                Entry/service fees are charged solely for tournament organization and operational services.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 - User Eligibility */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiUserCheck className="w-5 h-5 text-blue-600" />
            3. User Eligibility
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-bold">✓</span>
              </div>
              <span className="text-sm text-gray-700">Users must provide accurate personal and gaming details</span>
            </div>
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-bold">✗</span>
              </div>
              <span className="text-sm text-gray-700">Multiple/fake accounts are strictly prohibited</span>
            </div>
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-bold">✗</span>
              </div>
              <span className="text-sm text-gray-700">Violation may lead to permanent account suspension</span>
            </div>
          </div>
        </div>

        {/* Section 4 - Tournament Rules */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GiSwordsPower className="w-5 h-5 text-blue-600" />
            4. Tournament Rules
          </h2>
          <div className="grid gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm text-gray-700">Players must join matches on time</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm text-gray-700">Use of hacks, cheats, or exploits is strictly prohibited</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm text-gray-700">Organizer decisions regarding match results are final</span>
            </div>
          </div>
        </div>

        {/* Section 5 & 6 - Payments & Prize Distribution */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <FiCreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-bold text-gray-900">5. Payments</h2>
            </div>
            <p className="text-sm text-gray-700">
              All payments are processed securely via <strong className="text-gray-900">Razorpay</strong>. 
              RBM ESports does not store sensitive payment credentials.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <GiTrophy className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-bold text-gray-900">6. Prize Distribution</h2>
            </div>
            <p className="text-sm text-gray-700">
              Prize winnings credited to user wallet after verification. Withdrawals processed as per policy.
            </p>
          </div>
        </div>

        {/* Section 7 & 8 - Refund & Account Suspension */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiFileText className="w-4 h-4 text-gray-700" />
              7. Refund Policy Reference
            </h2>
            <p className="text-sm text-gray-700">
              Refund eligibility governed by our{' '}
              <a href="/refund" className="text-blue-600 font-semibold hover:underline">
                Refund & Cancellation Policy
              </a>.
              Entry fees are generally non-refundable once tournament begins.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiUserX className="w-4 h-4 text-red-600" />
              8. Account Suspension
            </h2>
            <p className="text-sm text-gray-700">
              RBM ESports reserves the right to suspend accounts involved in fraud, abuse, cheating, or chargeback misuse.
            </p>
          </div>
        </div>

        {/* Section 9 & 10 - Liability & Modifications */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiAlertTriangle className="w-4 h-4 text-amber-600" />
              9. Limitation of Liability
            </h2>
            <p className="text-sm text-gray-700">
              Not responsible for technical failures, game server issues, connectivity problems, or third-party disruptions.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiClock className="w-4 h-4 text-gray-700" />
              10. Modifications
            </h2>
            <p className="text-sm text-gray-700">
              Terms may be updated at any time. Continued use constitutes acceptance.
            </p>
          </div>
        </div>

        {/* Section 11 - Contact */}
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0">
              <MdGavel className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">11. Contact</h2>
              <p className="text-sm text-gray-700 mb-1">For legal or policy queries:</p>
              <a 
                href="mailto:rbmesports04@gmail.com" 
                className="text-blue-600 font-semibold text-sm hover:underline inline-flex items-center gap-1"
              >
                rbmesports04@gmail.com
                <span className="text-xs">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Compliance Badge */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <MdVerified className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-gray-500">Razorpay Verified • Compliant with Indian esports regulations</span>
        </div>
      </div>
    </LegalPage>
  );
}