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
  FiLock,
  FiLogIn,
  FiMail,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle
} from "react-icons/fi";
import { GiTrophy, GiCrossedSwords, GiBattleGear } from "react-icons/gi";
import { MdOutlineSportsEsports } from "react-icons/md";
import Link from "next/link";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const sp = useSearchParams();
  const dispatch = useDispatch();

  const next = useMemo(() => sp.get("next") || "/", [sp]);

  async function onSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      dispatch(
        showToast({
          title: "Missing Information",
          message: "Please fill in all fields.",
          type: "error"
        })
      );
      return;
    }

    setLoading(true);
    try {
      // backend-aligned: login -> fetchMe -> redirect
      await api.login({ email, password });

      // optional: if you have remember-me token logic in backend cookies, keep checkbox only UI.
      // If you store token manually somewhere, do it here based on rememberMe.

      await dispatch(fetchMe());
      dispatch(
        showToast({
          title: "Login Successful",
          message: "Welcome back to RBM ESports.",
          type: "success"
        })
      );

      router.push(next);
      router.refresh();
    } catch (err) {
      dispatch(
        showToast({
          title: "Login Failed",
          message: err?.message || "Invalid credentials",
          type: "error"
        })
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    dispatch(
      showToast({
        title: "Coming Soon",
        message: "Google login will be available soon.",
        type: "info"
      })
    );
  }

  function handleForgotPassword() {
    dispatch(
      showToast({
        title: "Coming Soon",
        message: "Password reset feature will be available soon.",
        type: "info"
      })
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Form */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] blur-2xl opacity-10" />
            <div className="relative card p-8 lg:p-10 border-2 border-slate-100 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 mb-4 border border-blue-100">
                  <MdOutlineSportsEsports className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                  Login to RBM ESports
                </h1>
                <p className="text-slate-600">
                  Access tournaments, wallet, and your account dashboard.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-6">
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
                    placeholder="Enter your email address"
                    icon={<FiMail className="w-4 h-4 text-slate-400" />}
                    required
                    className="text-base py-3 px-4"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <FiLock className="w-4 h-4" />
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Remember me</span>
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3.5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? (
                    "Authenticating..."
                  ) : (
                    <>
                      <FiLogIn className="w-5 h-5 mr-2" />
                      Login
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">Or continue with</span>
                  </div>
                </div>

                {/* Google */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-slate-300 hover:border-slate-400 hover:bg-slate-50 py-3"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google (soon)
                </Button>
              </form>

              {/* Sign Up */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-slate-600">
                  New here?{" "}
                  <Link
                    href={`/register?next=${encodeURIComponent(next)}`}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Create an account
                  </Link>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  rbmesports.vercel.app • Skill-based BGMI tournaments
                </p>
              </div>
            </div>
          </div>

          {/* Right: Benefits */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <GiTrophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-600">Why RBM ESports</div>
                  <h2 className="text-xl font-extrabold text-slate-900">Join the Arena</h2>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Participate in competitive tournaments, track results, and manage payments/wallet securely.
                This is a <strong>skill-based</strong> esports platform (no gambling/betting).
              </p>

              <div className="mt-6 grid gap-3">
                <Feature
                  icon={<GiCrossedSwords className="w-5 h-5 text-blue-600" />}
                  title="Competitive Tournaments"
                  desc="Structured matches with clear rules and scheduling."
                />
                <Feature
                  icon={<FiShield className="w-5 h-5 text-emerald-600" />}
                  title="Secure Payments"
                  desc="Payments are processed securely via Razorpay."
                />
                <Feature
                  icon={<GiBattleGear className="w-5 h-5 text-amber-600" />}
                  title="Verified Results"
                  desc="Winners are updated after admin verification."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Badge text="Verified platform" />
              <Badge text="Secure checkout" />
              <Badge text="Fair play rules" />
            </div>

            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Support: rbmesports04@gmail.com</span>
              </div>
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

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4">
      <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-bold text-slate-900">{title}</div>
        <div className="text-sm text-slate-600">{desc}</div>
      </div>
    </div>
  );
}

function Badge({ text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200">
      <FiCheckCircle className="w-4 h-4 text-emerald-600" />
      <span>{text}</span>
    </div>
  );
}