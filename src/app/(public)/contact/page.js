import LegalPage from "@/components/legal/LegalPage";
import {
  FiMail,
  FiClock,
  FiMapPin,
  FiHelpCircle,
  FiCheckCircle,
  FiSmartphone
} from "react-icons/fi";

export const metadata = {
  title: "Contact Us | RBM ESports",
  description: "Contact RBM ESports support."
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact Us"
      subtitle="Support for tournaments, payments, UPI verification, withdrawals, and account help."
      lastUpdated="2026-02-10"
    >
      <div className="space-y-6">

        {/* Support Cards */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Email */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-lg p-5">
            <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
              <FiMail className="w-6 h-6 text-white" />
            </div>

            <h3 className="font-bold text-gray-900 mb-2">
              Support Email
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              Tournament & account support
            </p>

            <a
              href="mailto:rbmesports04@gmail.com"
              className="text-blue-600 font-semibold text-sm hover:underline"
            >
              rbmesports04@gmail.com
            </a>
          </div>

          {/* Timing */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
              <FiClock className="w-6 h-6 text-white" />
            </div>

            <h3 className="font-bold mb-1">
              Support Timing
            </h3>

            <p className="text-sm text-gray-600">
              10:00 AM – 7:00 PM (IST)
            </p>

            <p className="text-xs text-gray-500">
              Monday – Saturday
            </p>
          </div>

          {/* Location */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="h-12 w-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
              <FiMapPin className="w-6 h-6 text-white" />
            </div>

            <h3 className="font-bold mb-1">
              Location
            </h3>

            <p className="text-sm text-gray-600">
              India
            </p>

            <p className="text-xs text-gray-500">
              Remote operations • Pan India
            </p>
          </div>

          {/* Response */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-lg p-5">
            <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
              <FiHelpCircle className="w-6 h-6 text-white" />
            </div>

            <h3 className="font-bold mb-1">
              Response Time
            </h3>

            <p className="text-sm text-green-600 font-semibold">
              Within 4 – 6 hours
            </p>
          </div>

        </div>

        {/* Faster Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">

          <h2 className="font-bold mb-4">
            For faster help, include:
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">

            <div className="flex items-center gap-2 bg-white p-3 rounded border">
              <FiCheckCircle className="text-green-600" />
              <span className="text-sm">Registered email</span>
            </div>

            <div className="flex items-center gap-2 bg-white p-3 rounded border">
              <FiCheckCircle className="text-green-600" />
              <span className="text-sm">
                Tournament name / date
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white p-3 rounded border">
              <FiSmartphone className="text-blue-600" />
              <span className="text-sm">
                UPI Transaction ID (UTR)
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white p-3 rounded border">
              <FiCheckCircle className="text-green-600" />
              <span className="text-sm">
                Payment screenshot proof
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white p-3 rounded border sm:col-span-2">
              <FiCheckCircle className="text-green-600" />
              <span className="text-sm">
                Withdrawal / wallet request details
              </span>
            </div>

          </div>

          <p className="text-xs text-gray-500 mt-4">
            Providing these details helps resolve issues faster.
          </p>

        </div>

        {/* Emergency */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">

          <p className="text-sm text-gray-700">
            Urgent issues? Email directly at{" "}
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
