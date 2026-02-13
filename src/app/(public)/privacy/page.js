import LegalPage from "@/components/legal/LegalPage";
import { FiShield, FiLock, FiDatabase, FiEyeOff, FiCreditCard, FiGlobe } from "react-icons/fi";
import { MdSecurity, MdGppGood } from "react-icons/md";

export const metadata = {
  title: "Privacy Policy | RBM ESports",
  description: "Privacy Policy for RBM ESports esports tournament platform."
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How RBM ESports collects, uses, and protects user data."
      lastUpdated="2026-02-10"
    >
      <div className="space-y-6">
        
        {/* Introduction - Highlighted */}
        <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg border-l-4 border-blue-600">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FiShield className="w-5 h-5 text-blue-600" />
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            RBM ESports is a <strong className="text-gray-900">skill-based BGMI esports platform</strong>. 
            We do not provide gambling, betting, lottery, or chance-based gaming services. 
            Your privacy is our priority.
          </p>
        </div>

        {/* Data We Collect */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiDatabase className="w-5 h-5 text-blue-600" />
            2. Data We Collect
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">Name, email, encrypted password</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">BGMI ID & in-game name</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">Phone number (optional)</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">Payment transaction references</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3 sm:col-span-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-700">Device/IP logs for security</span>
            </div>
          </div>
        </div>

        {/* Usage of Data */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiEyeOff className="w-5 h-5 text-gray-700" />
            3. Usage of Data
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm text-gray-700">Tournament registration & participation</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm text-gray-700">Payment verification</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm text-gray-700">Fraud prevention</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm text-gray-700">Support communication</span>
            </div>
          </div>
        </div>

        {/* Payment Security - Highlighted */}
        <div className=" text-white p-5 rounded-lg border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
              <FiCreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">4. Payment Security</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Payments are processed via <strong className="text-white">Razorpay</strong>, a PCI-DSS compliant payment gateway. 
                We <span className="text-yellow-400 font-bold">never store</span> card numbers, CVV, UPI PINs, or sensitive 
                financial credentials on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies & Data Sharing */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiGlobe className="w-4 h-4 text-blue-600" />
              5. Cookies
            </h2>
            <p className="text-sm text-gray-700">
              Used for login sessions and performance analytics. You can disable cookies in browser settings.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiShield className="w-4 h-4 text-blue-600" />
              6. Data Sharing
            </h2>
            <p className="text-sm text-gray-700">
              Data is shared only with payment gateways or legal authorities when required by law.
            </p>
          </div>
        </div>

        {/* Security Measures */}
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MdSecurity className="w-5 h-5 text-blue-600" />
            7. Security Measures
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 flex items-center gap-2">
              <FiLock className="w-4 h-4 text-blue-600" />
              Encrypted passwords
            </span>
            <span className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 flex items-center gap-2">
              <MdGppGood className="w-4 h-4 text-blue-600" />
              Restricted admin access
            </span>
            <span className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 flex items-center gap-2">
              <FiShield className="w-4 h-4 text-blue-600" />
              Secure servers
            </span>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="font-bold text-gray-900 mb-2">8. Contact</h2>
          <p className="text-sm text-gray-700">
            For privacy-related concerns:{' '}
            <a href="mailto:rbmesports04@gmail.com" className="text-blue-600 font-semibold hover:underline">
              rbmesports04@gmail.com
            </a>
          </p>
        </div>
      </div>
    </LegalPage>
  );
}