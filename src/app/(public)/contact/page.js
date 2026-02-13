import LegalPage from "@/components/legal/LegalPage";
import { FiMail, FiClock, FiMapPin, FiHelpCircle, FiCheckCircle } from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";

export const metadata = {
  title: "Contact Us | RBM ESports",
  description: "Contact RBM ESports support (rbmesports.vercel.app)."
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact Us"
      subtitle="For support related to tournaments, payments, wallet, withdrawals or account access."
      lastUpdated="2026-02-10"
    >
      <div className="space-y-6">
        
        {/* Support Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Email Support */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4">
              <FiMail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Support Email</h3>
            <p className="text-sm text-gray-600 mb-3">For all queries & support</p>
            <a 
              href="mailto:rbmesports04@gmail.com" 
              className="text-blue-600 font-semibold text-sm hover:underline inline-flex items-center gap-1"
            >
              rbmesports04@gmail.com
              <span className="text-xs">→</span>
            </a>
          </div>

          {/* Support Timing */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-4">
              <FiClock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Support Timing</h3>
            <p className="text-sm text-gray-600 mb-1">10:00 AM – 7:00 PM (IST)</p>
            <p className="text-xs text-gray-500">Monday – Saturday</p>
            <p className="text-xs text-gray-500 mt-2">Sunday: Closed</p>
          </div>

          {/* Location */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-4">
              <FiMapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Location</h3>
            <p className="text-sm text-gray-600">India</p>
            <p className="text-xs text-gray-500 mt-2">Remote operations • Pan India</p>
          </div>

          {/* Quick Response */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4">
              <FiHelpCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Quick Response</h3>
            <p className="text-sm text-gray-600 mb-1">Avg. reply time</p>
            <p className="text-xs font-semibold text-green-600">Within 4-6 hours</p>
          </div>
        </div>

        {/* For Faster Help Section */}
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">!</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              For faster help, include:
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
              <FiCheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Registered email</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
              <FiCheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Tournament name/date</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
              <FiCheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Razorpay Payment ID / Order ID</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
              <FiCheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Wallet withdrawal details</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-4 bg-white/50 p-3 rounded-lg border border-blue-100">
            ⚡ Including these details helps us resolve your issue 3x faster!
          </p>
        </div>

        {/* Emergency Contact Note */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">Urgent issues?</span> Please email us directly at{' '}
            <a href="mailto:rbmesports04@gmail.com" className="text-blue-600 font-semibold hover:underline">
              rbmesports04@gmail.com
            </a>
          </p>
        </div>
      </div>
    </LegalPage>
  );
}