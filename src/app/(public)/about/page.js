import LegalPage from "@/components/legal/LegalPage";
import { FiMail } from "react-icons/fi";

export const metadata = {
  title: "About Us | RBM ESports",
  description: "About RBM ESports competitive gaming platform."
};

export default function AboutPage() {
  return (
    <LegalPage
      title="About RBM ESports"
      subtitle="Competitive skill-based BGMI esports tournaments."
      lastUpdated="2026-02-10"
    >
      <div className="space-y-6">
        {/* Who We Are */}
        <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg border-l-4 border-blue-600">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
            Who We Are
          </h2>
          <p className="text-gray-700 leading-relaxed">
            RBM ESports is India's premier esports platform dedicated to competitive BGMI tournaments. 
            Founded by passionate gamers, we've built a professional ecosystem where skill meets opportunity.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="h-2 w-2 bg-gray-700 rounded-full"></span>
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To revolutionize Indian esports by providing a fair, transparent, and competitive platform 
            where every player gets the opportunity to showcase their skills and earn recognition.
          </p>
        </div>

        {/* Our Services */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
            Our Services
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-all">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-xl">01</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Tournament Hosting</h3>
              <p className="text-xs text-gray-600">Daily & weekly BGMI competitions</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-all">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-xl">02</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Result Verification</h3>
              <p className="text-xs text-gray-600">Anti-cheat & fair play system</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-all sm:col-span-1">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-xl">03</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Prize Wallet System</h3>
              <p className="text-xs text-gray-600">Instant withdrawals to UPI/bank</p>
            </div>
          </div>
        </div>

        {/* No Gambling Statement */}
        <div className="0 text-white p-5 rounded-lg border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-400 rounded-full"></span>
                No Gambling • 100% Skill-Based
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                RBM ESports strictly operates skill-based competitions only. We are not a 
                gambling, betting, or lottery platform. Entry fees are charged solely for 
                tournament organization and operational services.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
            Connect With Us
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">@</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <a href="mailto:rbmesports04@gmail.com" className="text-sm font-semibold text-gray-900 hover:text-blue-600">
                  rbmesports04@gmail.com
                </a>
              </div>
            </div>
            <a 
              href="mailto:rbmesports04@gmail.com" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
            >
              <FiMail className="w-4 h-4" />
              Send Message
            </a>
          </div>
        </div>
      </div>
    </LegalPage>
  );
}