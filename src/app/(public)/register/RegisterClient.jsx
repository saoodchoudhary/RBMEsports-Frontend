"use client";

import { useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchMe } from "@/store/authSlice";
import { showToast } from "@/store/uiSlice";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle
} from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";
import { FaGamepad } from "react-icons/fa";
import Link from "next/link";

export default function RegisterClient() {
  const [name, setName] = useState("");
  const [bgmiId, setBgmiId] = useState("");
  const [inGameName, setInGameName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const sp = useSearchParams();
  const dispatch = useDispatch();

  const next = useMemo(() => sp.get("next") || "/", [sp]);

  function validate() {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim()) return "Please enter your email.";
    if (!password.trim()) return "Please enter a password.";
    if (password.length < 6) return "Password should be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!bgmiId.trim()) return "Please enter your BGMI ID.";
    if (!inGameName.trim()) return "Please enter your In‑Game Name (IGN).";
    if (!acceptTerms) return "Please accept Terms & Privacy Policy.";
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();

    const err = validate();
    if (err) {
      dispatch(showToast({ title: "Fix required", message: err, type: "error" }));
      return;
    }

    setLoading(true);
    try {
      // ✅ backend aligned payload (phone removed)
      await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
        bgmiId: bgmiId.trim(),
        inGameName: inGameName.trim()
      });

      await dispatch(fetchMe());
      dispatch(
        showToast({
          title: "Account created",
          message: "Welcome to RBM ESports!",
          type: "success"
        })
      );

      router.push(next);
      router.refresh();
    } catch (e2) {
      dispatch(
        showToast({
          title: "Registration failed",
          message: e2?.message || "Please try again.",
          type: "error"
        })
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] blur-2xl opacity-10" />
          <div className="relative card p-8 md:p-10 border-2 border-slate-100 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 mb-4">
                <GiTrophy className="w-8 h-8 text-blue-700" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">Create your account</h1>
              <p className="text-slate-600 mt-2">
                Register on <span className="font-semibold">rbmesports.vercel.app</span> to join skill-based BGMI tournaments.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Full Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    icon={<FiUser className="w-4 h-4 text-slate-400" />}
                    required
                    className="text-base py-3 px-4"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    icon={<FiMail className="w-4 h-4 text-slate-400" />}
                    required
                    className="text-base py-3 px-4"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiLock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      icon={<FiLock className="w-4 h-4 text-slate-400" />}
                      required
                      className="text-base py-3 px-4 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Tip: Use a strong password (min 6 characters).</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiLock className="w-4 h-4" />
                    Confirm Password
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    icon={<FiLock className="w-4 h-4 text-slate-400" />}
                    required
                    className="text-base py-3 px-4"
                  />
                  {password && confirmPassword && password !== confirmPassword ? (
                    <p className="text-xs text-rose-600 font-medium">Passwords do not match</p>
                  ) : null}
                </div>

                {/* BGMI ID */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FaGamepad className="w-4 h-4" />
                    BGMI ID
                  </label>
                  <Input
                    value={bgmiId}
                    onChange={(e) => setBgmiId(e.target.value)}
                    placeholder="Your BGMI numeric ID"
                    icon={<FaGamepad className="w-4 h-4 text-slate-400" />}
                    required
                    className="text-base py-3 px-4"
                  />
                  <p className="text-xs text-slate-500">This helps verify tournament participation.</p>
                </div>

                {/* IGN */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    In‑Game Name (IGN)
                  </label>
                  <Input
                    value={inGameName}
                    onChange={(e) => setInGameName(e.target.value)}
                    placeholder="Your BGMI name"
                    icon={<FiUser className="w-4 h-4 text-slate-400" />}
                    required
                    className="text-base py-3 px-4"
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5"
                  />
                  <div className="text-sm text-slate-700">
                    <span className="font-semibold">I agree to</span>{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Privacy Policy
                    </Link>
                    <div className="text-xs text-slate-500 mt-1">
                      RBM ESports is a skill-based esports platform (no gambling/betting).
                    </div>
                  </div>
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3.5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
                loading={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>

              {/* Trust note */}
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-2 rounded-full border border-slate-200">
                  <FiShield className="w-4 h-4 text-emerald-600" />
                  Secure platform
                </div>
                <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-white px-3 py-2 rounded-full border border-slate-200">
                  <FiCheckCircle className="w-4 h-4 text-blue-600" />
                  Verified results
                </div>
              </div>
            </form>

            {/* Login link */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link
                  href={`/login?next=${encodeURIComponent(next)}`}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Log in
                </Link>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Need help? Email <span className="font-semibold">rbmesports04@gmail.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* bottom note */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white/80 px-4 py-2 rounded-full border border-slate-200">
            <FiShield className="w-4 h-4" />
            <span>We never store card/UPI PIN. Payments are handled securely by Razorpay.</span>
          </div>
        </div>
      </div>
    </div>
  );
}