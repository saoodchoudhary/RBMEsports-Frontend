// components/layout/Footer.js
import {
  GiTrophy,
  GiCrossedSwords,
  GiRank3
} from "react-icons/gi";
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
    { href: "/winners", label: "Winners", icon: <FiAward className="w-4 h-4" /> },
    { href: "/leaderboard", label: "Leaderboard", icon: <GiRank3 className="w-4 h-4" /> },
  ];

  const supportLinks = [
    { href: "/faq", label: "FAQ", icon: <FiHelpCircle className="w-4 h-4" /> },
    { href: "/contact", label: "Contact Us", icon: <FiMail className="w-4 h-4" /> },
    { href: "/terms", label: "Terms & Conditions", icon: <FiFileText className="w-4 h-4" /> },
    { href: "/privacy", label: "Privacy Policy", icon: <FiShield className="w-4 h-4" /> },
  ];

  const socialLinks = [
    { href: "#", icon: <FiInstagram className="w-5 h-5" />, label: "Instagram" },
    { href: "#", icon: <FiTwitter className="w-5 h-5" />, label: "Twitter" },
    { href: "#", icon: <BsDiscord className="w-5 h-5" />, label: "Discord" },
    { href: "#", icon: <SiTelegram className="w-5 h-5" />, label: "Telegram" },
    { href: "#", icon: <FiYoutube className="w-5 h-5" />, label: "YouTube" },
    { href: "#", icon: <FiFacebook className="w-5 h-5" />, label: "Facebook" },
  ];

  const features = [
    "✓ Instant Withdrawals",
    "✓ Fair Play Guarantee",
    "✓ 24/7 Support",
    "✓ Verified Matches",
  ];

  return (
    <footer className="mt-20 border-t bg-white/50 backdrop-blur-sm" style={{ borderColor: "var(--border)" }}>
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <GiTrophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-800">RBM ESports</div>
                  <div className="text-sm text-slate-600">Elite BGMI Tournaments</div>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                India's premier platform for competitive BGMI tournaments. 
                We provide a fair, secure, and exciting gaming experience 
                for players of all skill levels.
              </p>
              
              <div className="space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-6 font-bold text-slate-800 flex items-center gap-2">
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
                      <span className="group-hover:scale-110 transition-transform">
                        {link.icon}
                      </span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-6 font-bold text-slate-800 flex items-center gap-2">
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
                      <span className="group-hover:scale-110 transition-transform">
                        {link.icon}
                      </span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="mb-6 font-bold text-slate-800">Connect With Us</h4>
              <p className="text-sm text-slate-600 mb-6">
                Join our community for updates, tips, and exclusive tournaments
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {socialLinks.slice(0, 6).map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center hover:from-blue-50 hover:to-blue-100 hover:scale-110 transition-all duration-300 group"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <span className="text-slate-600 group-hover:text-blue-600">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <p className="text-sm font-medium text-slate-800 mb-2">
                  Download Our App
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-900 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                    Play Store
                  </button>
                  <button className="flex-1 bg-slate-900 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                    App Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              © {new Date().getFullYear()} RBM ESports. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FiShield className="w-4 h-4" />
                <span>100% Secure Platform</span>
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="text-sm text-slate-600">
                BGMI™ is a trademark of Krafton, Inc.
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-xs text-slate-500">
              Play responsibly. This platform is for entertainment purposes only.
              Users must be 18+ to participate in paid tournaments.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}