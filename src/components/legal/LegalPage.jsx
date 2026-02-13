"use client"
import Link from "next/link";
import { 
  FiMail, 
  FiShield, 
  FiFileText, 
  FiInfo, 
  FiClock, 
  FiCheckCircle,
  FiArrowRight,
  FiLock,
  FiCreditCard,
  FiHome
} from "react-icons/fi";
import { 
  GiTrophy, 
  GiCrossedSwords, 
  GiShield as GiShieldIcon,
  GiBattleGear,
  GiSwordsPower,
  GiHelmet
} from "react-icons/gi";
import { FaYoutube, FaDiscord, FaInstagram } from "react-icons/fa";
import { MdSecurity, MdGavel } from "react-icons/md";

export default function LegalPage({
  title,
  subtitle,
  lastUpdated = "2026-02-10",
  children
}) {
  return (
    <div className="w-full ">
      <div className=" py-6 sm:py-8 lg:py-10">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          
          {/* ===== HERO SECTION - PROFESSIONAL ESPORTS ===== */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-md">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gray-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="relative z-10">
              {/* Header with Icon */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
                  <GiTrophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      RBM ESPORTS
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                    <span className="text-xs font-medium text-gray-500">
                      {lastUpdated}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {title}
                  </h1>
                </div>
              </div>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-sm sm:text-base text-gray-700 max-w-3xl mb-4 sm:mb-5 pl-1 border-l-3 border-blue-600 pl-3 sm:pl-4">
                  {subtitle}
                </p>
              )}

              {/* Badges - Mobile Responsive */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-blue-100">
                  <FiInfo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-700">Skill-based platform</span>
                </span>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
                  <FiShield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                  <span className="text-xs font-medium text-gray-700">Razorpay secure</span>
                </span>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-gray-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
                  <FiFileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
                  <span className="text-xs font-medium text-gray-700">Updated: {lastUpdated}</span>
                </span>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all hover:shadow-md"
                >
                  <FiMail className="w-4 h-4" />
                  CONTACT SUPPORT
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="mailto:rbmesports04@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all hover:shadow-lg hover:scale-105"
                >
                  <FiMail className="w-4 h-4" />
                  rbmesports04@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/* ===== CONTENT SECTION - PROFESSIONAL TYPOGRAPHY ===== */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-sm">
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              {/* Custom styling for legal content */}
              <style jsx global>{`
                .prose h1, .prose h2, .prose h3, .prose h4 {
                  color: #111827;
                  font-weight: 700;
                  margin-top: 1.5em;
                  margin-bottom: 0.75em;
                }
                .prose h2 {
                  font-size: 1.25rem;
                  border-bottom: 2px solid #e5e7eb;
                  padding-bottom: 0.5rem;
                  margin-top: 2rem;
                }
                .prose h2:first-child {
                  margin-top: 0;
                }
                .prose p {
                  color: #374151;
                  line-height: 1.7;
                  margin-bottom: 1.25rem;
                }
                .prose ul {
                  list-style-type: none;
                  padding-left: 0;
                  margin-bottom: 1.5rem;
                }
                .prose ul li {
                  position: relative;
                  padding-left: 1.75rem;
                  margin-bottom: 0.5rem;
                  color: #374151;
                }
                .prose ul li:before {
                  content: "•";
                  position: absolute;
                  left: 0.5rem;
                  color: #2563eb;
                  font-weight: 700;
                  font-size: 1.2rem;
                }
                .prose strong {
                  color: #111827;
                  font-weight: 700;
                }
                .prose a {
                  color: #2563eb;
                  font-weight: 600;
                  text-decoration: none;
                  border-bottom: 1px solid #bfdbfe;
                  transition: all 0.2s;
                }
                .prose a:hover {
                  color: #1e40af;
                  border-bottom-color: #2563eb;
                }
                @media (min-width: 640px) {
                  .prose h2 {
                    font-size: 1.5rem;
                  }
                }
              `}</style>
              {children}
            </div>
          </section>

          {/* ===== QUICK LINKS - RAZORPAY COMPLIANCE ===== */}
          <section className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <MdGavel className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                LEGAL & COMPLIANCE
              </h3>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                Razorpay Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {[
                { href: "/privacy", label: "Privacy", icon: <FiLock className="w-3.5 h-3.5" /> },
                { href: "/terms", label: "Terms", icon: <MdGavel className="w-3.5 h-3.5" /> },
                { href: "/refund", label: "Refund", icon: <FiCreditCard className="w-3.5 h-3.5" /> },
                { href: "/shipping", label: "Shipping", icon: <FiHome className="w-3.5 h-3.5" /> },
                { href: "/about", label: "About", icon: <GiHelmet className="w-3.5 h-3.5" /> },
                { href: "/contact", label: "Contact", icon: <FiMail className="w-3.5 h-3.5" /> }
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center justify-center sm:justify-start gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all text-xs sm:text-sm font-medium"
                >
                  <span className="hidden sm:inline">{l.icon}</span>
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                ⚡ RBM ESports • Skill-based BGMI tournaments • No gambling
              </p>
              <div className="flex items-center gap-2">
                <a href="https://www.youtube.com/@rbm.esports" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                  <FaYoutube className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/rbm.esports" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                  <FaInstagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}