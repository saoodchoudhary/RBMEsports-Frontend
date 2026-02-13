import { GiTrophy, GiCrossedSwords } from "react-icons/gi";
import {
  FiHome,
  FiAward,
  FiHelpCircle,
  FiMail,
  FiFileText,
  FiShield,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiFacebook
} from "react-icons/fi";
import { BsDiscord } from "react-icons/bs";
import { SiTelegram } from "react-icons/si";

export default function Footer() {
  const quickLinks = [
    { href: "/", label: "Home", icon: <FiHome className="w-4 h-4" /> },
    { href: "/tournaments", label: "Tournaments", icon: <GiCrossedSwords className="w-4 h-4" /> },
    { href: "/winners", label: "Winners", icon: <FiAward className="w-4 h-4" /> }
  ];

// Replace supportLinks with this (example)
const supportLinks = [
  { href: "/about", label: "About Us", icon: <FiAward className="w-4 h-4" /> },
  { href: "/contact", label: "Contact Us", icon: <FiMail className="w-4 h-4" /> },
  { href: "/privacy", label: "Privacy Policy", icon: <FiShield className="w-4 h-4" /> },
  { href: "/terms", label: "Terms & Conditions", icon: <FiFileText className="w-4 h-4" /> },
  { href: "/refund", label: "Refund & Cancellation", icon: <FiHelpCircle className="w-4 h-4" /> },
  { href: "/shipping", label: "Shipping & Delivery", icon: <FiFileText className="w-4 h-4" /> }
];
  // Replace "#" with your real URLs
  const socialLinks = [
    { href: "#", icon: <FiInstagram className="w-5 h-5" />, label: "Instagram" },
    { href: "#", icon: <FiTwitter className="w-5 h-5" />, label: "Twitter" },
    { href: "#", icon: <BsDiscord className="w-5 h-5" />, label: "Discord" },
    { href: "#", icon: <SiTelegram className="w-5 h-5" />, label: "Telegram" },
    { href: "#", icon: <FiYoutube className="w-5 h-5" />, label: "YouTube" },
    { href: "#", icon: <FiFacebook className="w-5 h-5" />, label: "Facebook" }
  ];

  const trustPoints = [
    "Verified tournament results",
    "Secure payments via Razorpay",
    "Wallet withdrawals with admin approval",
    "Fair play & anti-abuse rules"
  ];

  return (
    <footer className="mt-16 border-t bg-white/60 backdrop-blur-sm" style={{ borderColor: "var(--border)" }}>
      <div className="container">
        <div className="py-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                
             <img src="/images/logo/rbmlogo.png" alt="RBM ESports Logo" className="rounded-full w-[58px] h-[58px]" />
                <div>
                  <div className="font-bold text-lg text-slate-800">RBM ESports</div>
                  <div className="text-sm text-slate-600">Competitive BGMI Tournaments</div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Participate in competitive BGMI tournaments, track winners, and manage your wallet securely.
                This is a website platform (no app download required).
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trustPoints.map((t) => (
                  <div key={t} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-5 font-bold text-slate-800 flex items-center gap-2">
                <GiCrossedSwords className="w-5 h-5 text-blue-600" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors group"
                    >
                      <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-5 font-bold text-slate-800 flex items-center gap-2">
                <FiHelpCircle className="w-5 h-5 text-blue-600" />
                Support
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors group"
                    >
                      <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="mb-5 font-bold text-slate-800">Connect</h4>
              <p className="text-sm text-slate-600 mb-5">
                Follow us for updates and tournament announcements.
              </p>

              <div className="grid grid-cols-3 gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center hover:from-blue-50 hover:to-blue-100 hover:scale-110 transition-all duration-300 group border border-slate-200"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <span className="text-slate-600 group-hover:text-blue-600">{social.icon}</span>
                  </a>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-sm font-semibold text-slate-900">Website Platform</div>
                <div className="text-xs text-slate-600 mt-1">
                  Use RBM ESports directly from your browser.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t py-6" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              © {new Date().getFullYear()} RBM ESports. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200">
                <FiShield className="w-4 h-4" />
                Secure payments
              </span>
              <span className="text-slate-400 hidden md:inline">•</span>
              <span className="text-xs text-slate-500">
                BGMI™ is a trademark of Krafton, Inc.
              </span>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-slate-500">
              Play responsibly. Paid tournaments may be restricted by age (18+) and local regulations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}