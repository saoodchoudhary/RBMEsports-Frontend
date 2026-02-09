"use client";

import { useState } from "react";
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
  FiPhone, 
  FiAward,
  FiUserPlus,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiShield,
  FiStar
} from "react-icons/fi";
import { 
  GiTrophy, 
  GiCrossedSwords,
  GiHelmet,
  GiRank3,
  GiPlayerTime
} from "react-icons/gi";
import { 
  MdOutlineSportsEsports,
  MdVerified,
  MdOutlineSecurity
} from "react-icons/md";
import { FaGoogle, FaCrown, FaRegGem, FaGamepad } from "react-icons/fa";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [bgmiId, setBgmiId] = useState("");
  const [inGameName, setInGameName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const dispatch = useDispatch();

  const validateStep1 = () => {
    return name.trim() && email.trim() && password.trim() && confirmPassword.trim();
  };

  const validateStep2 = () => {
    return phone.trim() && bgmiId.trim() && inGameName.trim();
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      if (password !== confirmPassword) {
        dispatch(showToast({ 
          title: "Passwords Mismatch", 
          message: "Passwords do not match",
          type: "error"
        }));
        return;
      }
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  async function handleSubmit() {
    if (!acceptTerms) {
      dispatch(showToast({ 
        title: "Terms Required", 
        message: "Please accept terms and conditions",
        type: "error"
      }));
      return;
    }

    setLoading(true);
    try {
      await api.register({ name, email, password, phone, bgmiId, inGameName });
      await dispatch(fetchMe());
      dispatch(showToast({ 
        title: "Welcome to RBM ESports!", 
        message: "Your account has been created successfully",
        type: "success"
      }));
      router.push(next);
      router.refresh();
    } catch (err) {
      dispatch(showToast({ 
        title: "Registration Failed", 
        message: err.message || "Please try again",
        type: "error"
      }));
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignup = () => {
    dispatch(showToast({ 
      title: "Coming Soon", 
      message: "Google signup will be available soon",
      type: "info"
    }));
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthColor = () => {
    const strength = passwordStrength();
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Registration Form */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-10"></div>
            <div className="relative card p-8 lg:p-10 border-2 border-slate-100 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 mb-4">
                  <MdOutlineSportsEsports className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Join the Arena
                </h1>
                <p className="text-slate-600">
                  Create your account and start your journey to become a champion
                </p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                    step >= 1 
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white" 
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {step > 1 ? <FiCheck className="w-5 h-5" /> : "1"}
                  </div>
                  <span className="text-xs font-medium text-slate-700">Basic Info</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-slate-200">
                  <div className={`h-full transition-all duration-300 ${
                    step >= 2 
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500" 
                      : "bg-slate-200"
                  }`}></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                    step >= 2 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" 
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {step > 2 ? <FiCheck className="w-5 h-5" /> : "2"}
                  </div>
                  <span className="text-xs font-medium text-slate-700">Gaming Profile</span>
                </div>
              </div>

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <FiUser className="w-4 h-4" />
                        Full Name
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        icon={<FiUser className="w-4 h-4 text-slate-400" />}
                        required
                        className="text-base py-3 px-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
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
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                        </div>
                        
                        {/* Password Strength */}
                        {password && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-600">Password strength:</span>
                              <span className={`font-medium ${
                                passwordStrength() >= 4 ? "text-green-600" :
                                passwordStrength() >= 3 ? "text-blue-600" :
                                passwordStrength() >= 2 ? "text-yellow-600" :
                                "text-red-600"
                              }`}>
                                {passwordStrength() >= 4 ? "Strong" :
                                 passwordStrength() >= 3 ? "Good" :
                                 passwordStrength() >= 2 ? "Fair" :
                                 "Weak"}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${strengthColor()} transition-all duration-300`}
                                style={{ width: `${passwordStrength() * 25}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <FiLock className="w-4 h-4" />
                          Confirm Password
                        </label>
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          icon={<FiLock className="w-4 h-4 text-slate-400" />}
                          required
                          className="text-base py-3 px-4"
                        />
                        {password && confirmPassword && password !== confirmPassword && (
                          <p className="text-xs text-red-500">Passwords do not match</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 py-3.5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Continue to Gaming Profile
                    <GiPlayerTime className="w-5 h-5 ml-2" />
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-slate-500">Or sign up with</span>
                    </div>
                  </div>

                  {/* Google Signup */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-300 hover:border-slate-400 hover:bg-slate-50 py-3"
                    onClick={handleGoogleSignup}
                  >
                    <FaGoogle className="w-5 h-5 mr-2" />
                    Sign up with Google
                  </Button>
                </form>
              )}

              {/* Step 2: Gaming Profile */}
              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <FiPhone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        icon={<FiPhone className="w-4 h-4 text-slate-400" />}
                        required
                        className="text-base py-3 px-4"
                      />
                      <p className="text-xs text-slate-500">
                        Used for account verification and important notifications
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <FaGamepad className="w-4 h-4" />
                          BGMI ID
                        </label>
                        <Input
                          value={bgmiId}
                          onChange={(e) => setBgmiId(e.target.value)}
                          placeholder="Enter your BGMI ID"
                          icon={<FaGamepad className="w-4 h-4 text-slate-400" />}
                          required
                          className="text-base py-3 px-4"
                        />
                        <p className="text-xs text-slate-500">10-12 digit numeric ID</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <GiHelmet className="w-4 h-4" />
                          In-Game Name
                        </label>
                        <Input
                          value={inGameName}
                          onChange={(e) => setInGameName(e.target.value)}
                          placeholder="Enter your in-game name"
                          icon={<GiHelmet className="w-4 h-4 text-slate-400" />}
                          required
                          className="text-base py-3 px-4"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5"
                      />
                      <div className="text-sm text-slate-700">
                        <span className="font-medium">I agree to the </span>
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                          Terms of Service
                        </Link>
                        <span className="font-medium"> and </span>
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                          Privacy Policy
                        </Link>
                        <p className="text-slate-600 mt-1">
                          I understand that providing accurate gaming information is required for fair play verification.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-slate-300 hover:border-slate-400 hover:bg-slate-50 py-3"
                      onClick={handlePreviousStep}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 py-3.5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={loading}
                      loading={loading}
                    >
                      {loading ? "Creating Account..." : "Complete Registration"}
                      <GiTrophy className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>
              )}

              {/* Login Link */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href={`/login?next=${encodeURIComponent(next)}`}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="space-y-8">
            {/* Hero Message */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <GiCrossedSwords className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Why Join RBM ESports?</h2>
              </div>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Join India's fastest growing BGMI tournament platform. Compete, win, and build your legacy.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                  <FiAward className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Exclusive Tournaments</h3>
                  <p className="text-sm text-slate-600">
                    Access to premium tournaments with massive prize pools
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                  <MdVerified className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Verified Fair Play</h3>
                  <p className="text-sm text-slate-600">
                    Anti-cheat systems ensure fair competition for all players
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                  <GiRank3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Live Leaderboards</h3>
                  <p className="text-sm text-slate-600">
                    Real-time rankings and performance tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                  <MdOutlineSecurity className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Secure Platform</h3>
                  <p className="text-sm text-slate-600">
                    Bank-level security for all transactions and data
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
              <div className="text-center mb-4">
                <FaCrown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <div className="text-sm text-slate-300">Join Our Community</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold">5000+</div>
                  <div className="text-xs text-slate-400">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">₹10L+</div>
                  <div className="text-xs text-slate-400">Prizes Won</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">24/7</div>
                  <div className="text-xs text-slate-400">Support</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200">
                <FiShield className="w-4 h-4 text-green-500" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200">
                <FaRegGem className="w-4 h-4 text-purple-500" />
                <span>Verified Players</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200">
                <FiStar className="w-4 h-4 text-amber-500" />
                <span>Elite Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-full">
            <FiShield className="w-4 h-4" />
            <span>All information is encrypted and securely stored. Your privacy is our priority.</span>
          </div>
        </div>
      </div>
    </div>
  );
}