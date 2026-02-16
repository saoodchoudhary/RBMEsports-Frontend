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
      subtitle="Competitive skill-based BGMI esports tournaments platform."
      lastUpdated="2026-02-10"
    >
      <div className="space-y-6">

        {/* Who We Are */}
        <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg border-l-4 border-blue-600">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Who We Are
          </h2>

          <p className="text-gray-700 leading-relaxed">
            RBM ESports is a competitive esports platform focused on hosting
            skill-based BGMI tournaments. Built by passionate gamers,
            the platform provides players an opportunity to compete,
            improve gameplay, and participate in organized custom matches.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Our Mission
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Our mission is to create a fair and transparent esports ecosystem
            where players can showcase their skills, compete professionally,
            and grow within the Indian competitive gaming community.
          </p>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Our Services
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">

            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">01</span>
              </div>

              <h3 className="font-bold text-gray-900 mb-1">
                Tournament Hosting
              </h3>

              <p className="text-xs text-gray-600">
                Daily, weekly & custom BGMI tournaments
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">02</span>
              </div>

              <h3 className="font-bold text-gray-900 mb-1">
                Result Verification
              </h3>

              <p className="text-xs text-gray-600">
                Fair play & anti-cheat monitoring
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">03</span>
              </div>

              <h3 className="font-bold text-gray-900 mb-1">
                Prize & Wallet System
              </h3>

              <p className="text-xs text-gray-600">
                Manual withdrawals via UPI / bank transfer
              </p>
            </div>

          </div>
        </div>

        {/* No Gambling */}
        <div className="bg-gray-300 text-white p-5 rounded-lg">
          <h2 className="text-lg font-bold mb-2">
            No Gambling • 100% Skill-Based
          </h2>

          <p className="text-gray-300 text-sm leading-relaxed">
            RBM ESports operates strictly as a skill-based esports platform.
            We do not provide betting, gambling, lottery, or chance-based games.
            Entry/service fees are charged only for tournament organization
            and operational management.
          </p>
        </div>

        {/* Payments Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-bold text-gray-900 mb-2">
            Payments & Prize Handling
          </h2>

          <p className="text-sm text-gray-700">
            Tournament entry payments are collected via manual UPI transfer.
            Prize winnings are credited after result verification and processed
            through UPI or bank withdrawal requests.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Connect With Us
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

            <div>
              <p className="text-xs text-gray-500">Email</p>

              <a
                href="mailto:rbmesports04@gmail.com"
                className="text-sm font-semibold text-gray-900 hover:text-blue-600"
              >
                rbmesports04@gmail.com
              </a>
            </div>

            <a
              href="mailto:rbmesports04@gmail.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2"
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
