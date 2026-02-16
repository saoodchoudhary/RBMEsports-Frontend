import LegalPage from "@/components/legal/LegalPage";
import {
  FiShield,
  FiLock,
  FiDatabase,
  FiEyeOff,
  FiSmartphone,
  FiGlobe
} from "react-icons/fi";
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

        {/* 1 Introduction */}
        <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg border-l-4 border-blue-600">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FiShield className="text-blue-600" />
            1. Introduction
          </h2>

          <p className="text-sm text-gray-700 mt-2">
            RBM ESports is a <strong>skill-based esports tournament platform</strong>.
            We do not provide gambling, betting, or chance-based gaming services.
            Your privacy and data protection are our priority.
          </p>
        </div>

        {/* 2 Data Collection */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <FiDatabase className="text-blue-600" />
            2. Data We Collect
          </h2>

          <ul className="space-y-2 text-sm text-gray-700">
            <li>Name, email, encrypted password</li>
            <li>BGMI ID & in-game name</li>
            <li>Phone number (optional)</li>
            <li>UPI transaction references (UTR)</li>
            <li>Payment screenshots (if submitted)</li>
            <li>Device/IP logs for fraud prevention</li>
          </ul>
        </div>

        {/* 3 Usage */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <FiEyeOff />
            3. How We Use Data
          </h2>

          <ul className="space-y-2 text-sm text-gray-700">
            <li>Tournament registration & participation</li>
            <li>Manual payment verification</li>
            <li>Fraud detection & abuse prevention</li>
            <li>Support & dispute resolution</li>
          </ul>
        </div>

        {/* 4 Payment Security - Updated */}
        <div className="bg-gray-300 text-white p-5 rounded-lg">
          <div className="flex gap-3">
            <FiSmartphone className="w-6 h-6" />

            <p className="text-sm text-gray-300">
              Payments are collected via manual UPI / QR transfer.
              We do not collect or store UPI PINs, card details,
              or banking passwords. Only transaction references
              and screenshots are stored for verification.
            </p>
          </div>
        </div>

        {/* 5 Cookies */}
        <div className="grid sm:grid-cols-2 gap-4">

          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h2 className="font-bold flex gap-2 items-center">
              <FiGlobe /> 5. Cookies
            </h2>

            <p className="text-sm text-gray-700 mt-1">
              Cookies are used for login sessions and performance tracking.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h2 className="font-bold flex gap-2 items-center">
              <FiShield /> 6. Data Sharing
            </h2>

            <p className="text-sm text-gray-700 mt-1">
              We do not sell user data. Data may be shared only
              if required by law enforcement.
            </p>
          </div>

        </div>

        {/* 7 Security */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold flex gap-2 items-center">
            <MdSecurity className="text-blue-600" />
            7. Security Measures
          </h2>

          <div className="flex flex-wrap gap-2 mt-2">

            <span className="border px-3 py-1 rounded text-sm flex gap-1 items-center">
              <FiLock /> Encrypted passwords
            </span>

            <span className="border px-3 py-1 rounded text-sm flex gap-1 items-center">
              <MdGppGood /> Admin access control
            </span>

            <span className="border px-3 py-1 rounded text-sm flex gap-1 items-center">
              <FiShield /> Secure database
            </span>

          </div>
        </div>

        {/* 8 Data Retention */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h2 className="font-bold mb-2">
            8. Data Retention
          </h2>

          <p className="text-sm text-gray-700">
            Payment proofs and transaction records are stored
            only for verification, dispute handling, and fraud prevention.
          </p>
        </div>

        {/* 9 Contact */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h2 className="font-bold mb-1">
            9. Contact
          </h2>

          <p className="text-sm">
            Privacy concerns:{' '}
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
