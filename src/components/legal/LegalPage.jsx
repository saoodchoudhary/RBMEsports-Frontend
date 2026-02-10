import Link from "next/link";
import { FiMail, FiShield, FiFileText, FiInfo } from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";

export default function LegalPage({
  title,
  subtitle,
  lastUpdated = "2026-02-10",
  children
}) {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8 shadow-lg">
        <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 opacity-30" />
        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-20" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
              <GiTrophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-600">
                rbmesports.co • RBM ESports
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {title}
              </h1>
            </div>
          </div>

          {subtitle ? (
            <p className="text-slate-700 max-w-3xl">{subtitle}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1.5 text-slate-700">
              <FiInfo className="w-4 h-4 text-blue-600" />
              Skill-based esports platform (No gambling / No betting)
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5 text-slate-700">
              <FiShield className="w-4 h-4 text-emerald-600" />
              Secure payments via Razorpay
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-slate-700">
              <FiFileText className="w-4 h-4 text-slate-600" />
              Last updated: <span className="font-semibold">{lastUpdated}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50"
            >
              <FiMail className="w-4 h-4" />
              Contact Support
            </Link>

            <a
              href={`mailto:rbmesports04@gmail.com`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-semibold text-white hover:from-blue-700 hover:to-purple-700"
            >
              <FiMail className="w-4 h-4" />
              rbmesports04@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="card p-6 md:p-8">
        <div className="prose prose-slate max-w-none prose-a:font-semibold">
          {children}
        </div>
      </section>

      {/* Quick links box */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-sm font-extrabold text-slate-900 mb-3">
          Quick Links (Razorpay Compliance)
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/refund", label: "Refund" },
            { href: "/shipping", label: "Shipping" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" }
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}