"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { loadRazorpayScript, openRazorpay } from "@/lib/razorpay";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/uiSlice";
import {
  GiWallet,
  GiMoneyStack,
  GiPayMoney,
  GiReceiveMoney,
  GiCash,
  GiTakeMyMoney,
  GiTrophy,
  GiSwordsPower,
  GiShield,
  GiBattleGear,
  GiHelmet
} from "react-icons/gi";
import {
  FiCreditCard,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiShield as FiShieldIcon,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiInfo,
  FiClock,
  FiTrendingUp,
  FiDollarSign,
  FiLock,
  FiEye,
  FiEyeOff
} from "react-icons/fi";
import { 
  MdPayment, 
  MdSecurity, 
  MdAccountBalance, 
  MdQrCode, 
  MdVerified,
  MdOutlineWallet
} from "react-icons/md";
import { BsBank, BsPeopleFill } from "react-icons/bs";
import { FaRupeeSign, FaRegCreditCard, FaGooglePay, FaPaypal, FaAmazonPay } from "react-icons/fa";
import { RiBankFill, RiSecurePaymentFill } from "react-icons/ri";
import { IoWalletOutline } from "react-icons/io5";
import { TbCurrencyRupee, TbBuildingBank } from "react-icons/tb";

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function formatDate(d) {
  if (!d) return "—";
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return "—";
  return x.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function txLabel(type) {
  switch (type) {
    case "deposit":
      return { text: "Deposit", cls: "bg-blue-50 text-blue-700 border-blue-200" };
    case "prize_won":
      return { text: "Prize", cls: "bg-blue-50 text-blue-700 border-blue-200" };
    case "tournament_fee":
      return { text: "Tournament Fee", cls: "bg-gray-100 text-gray-700 border-gray-200" };
    case "withdrawal":
      return { text: "Withdrawal", cls: "bg-gray-100 text-gray-700 border-gray-200" };
    case "refund":
      return { text: "Refund", cls: "bg-blue-50 text-blue-700 border-blue-200" };
    default:
      return { text: type || "Txn", cls: "bg-gray-50 text-gray-700 border-gray-200" };
  }
}

function wdStatusChip(status) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "processing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "completed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function isValidUpi(upi) {
  if (!upi) return false;
  return /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(String(upi).trim());
}

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);

  const [amount, setAmount] = useState(500);
  const [loading, setLoading] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [method, setMethod] = useState("upi");

  const [upiId, setUpiId] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  const [activeSection, setActiveSection] = useState("add");
  const [txFilter, setTxFilter] = useState("all");
  const [showBalance, setShowBalance] = useState(true);

  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  async function load() {
    const [wRes, wdRes] = await Promise.all([
      api.wallet(),
      api.walletWithdrawals().catch(() => ({ data: [] }))
    ]);

    const w = wRes.data;
    setWallet(w);

    if (w?.withdrawalInfo) {
      setMethod(w.withdrawalInfo.method || "upi");
      setUpiId(w.withdrawalInfo.upiId || "");
      setAccountHolderName(w.withdrawalInfo.accountHolderName || "");
      setAccountNumber(w.withdrawalInfo.accountNumber || "");
      setIfscCode(w.withdrawalInfo.ifscCode || "");
      setBankName(w.withdrawalInfo.bankName || "");
    }

    setWithdrawals(wdRes.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (method === "upi") {
    } else {
    }
  }, [method]);

  async function addMoney() {
    try {
      setLoading(true);
      const amt = Number(amount);

      if (!amt || amt < 10) throw new Error("Minimum amount is ₹10");
      if (amt > 100000) throw new Error("Maximum amount is ₹1,00,000");

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay checkout.");

      const orderRes = await api.walletAddMoneyOrder(amt);
      const { orderId, key } = orderRes.data;

      openRazorpay({
        key,
        amount: String(amt * 100),
        currency: "INR",
        name: "RBM ESports",
        description: "Wallet top-up",
        order_id: orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || ""
        },
        notes: {
          purpose: "wallet_topup"
        },
        handler: async function (response) {
          try {
            await api.walletVerifyAdd({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amt
            });

            dispatch(
              showToast({
                title: "Wallet Updated",
                message: `₹${amt} successfully added to your wallet.`,
                type: "success"
              })
            );
            await load();
          } catch (e) {
            dispatch(
              showToast({
                title: "Verification Failed",
                message: e?.message || "Payment verification failed",
                type: "error"
              })
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            dispatch(
              showToast({
                title: "Payment Cancelled",
                message: "You closed the payment window.",
                type: "info"
              })
            );
          }
        },
        theme: { color: "#2563eb" }
      });
    } catch (e) {
      dispatch(showToast({ title: "Add Money Failed", message: e?.message || "Failed", type: "error" }));
      setLoading(false);
    }
  }

  async function saveWithdrawalInfo() {
    try {
      if (method === "upi") {
        if (!upiId.trim()) throw new Error("Please enter your UPI ID");
        if (!isValidUpi(upiId)) throw new Error("Please enter a valid UPI ID (e.g. name@upi)");
      } else {
        if (!accountHolderName.trim()) throw new Error("Please enter account holder name");
        if (!accountNumber.trim()) throw new Error("Please enter account number");
        if (!ifscCode.trim()) throw new Error("Please enter IFSC code");
        if (!bankName.trim()) throw new Error("Please enter bank name");
      }

      const payload = {
        method,
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        bankName: bankName.trim(),
        upiId: upiId.trim()
      };

      await api.walletWithdrawalInfo(payload);

      dispatch(
        showToast({
          title: "Information Saved",
          message: "Withdrawal information updated successfully.",
          type: "success"
        })
      );
      await load();
    } catch (e) {
      dispatch(showToast({ title: "Failed to Save", message: e?.message || "Failed", type: "error" }));
    }
  }

  async function requestWithdraw() {
    try {
      const amt = Number(withdrawAmount);
      if (!amt || amt < 100) throw new Error("Minimum withdrawal amount is ₹100");
      if (wallet && amt > safeNum(wallet.balance, 0)) throw new Error("Insufficient balance for withdrawal");

      if (method === "upi") {
        if (!upiId.trim()) throw new Error("Enter your UPI ID (or save it first)");
        if (!isValidUpi(upiId)) throw new Error("Invalid UPI ID (e.g. name@upi)");
      } else {
        if (!accountHolderName.trim()) throw new Error("Enter account holder name");
        if (!accountNumber.trim()) throw new Error("Enter account number");
        if (!ifscCode.trim()) throw new Error("Enter IFSC code");
        if (!bankName.trim()) throw new Error("Enter bank name");
      }

      const accountDetails =
        method === "upi"
          ? { upiId: upiId.trim() }
          : {
              accountHolderName: accountHolderName.trim(),
              accountNumber: accountNumber.trim(),
              ifscCode: ifscCode.trim(),
              bankName: bankName.trim()
            };

      await api.walletWithdraw({ amount: amt, method, accountDetails });

      dispatch(
        showToast({
          title: "Withdrawal Requested",
          message: "Your withdrawal request has been submitted. Admin will process it manually.",
          type: "success"
        })
      );
      await load();
      setWithdrawAmount(500);
    } catch (e) {
      dispatch(showToast({ title: "Withdrawal Failed", message: e?.message || "Failed", type: "error" }));
    }
  }

  const suggestedAmounts = [100, 500, 1000, 2000, 5000];

  const transactions = wallet?.transactions || [];

  const filteredTx = useMemo(() => {
    if (txFilter === "all") return transactions;
    return transactions.filter((t) => t.type === txFilter);
  }, [transactions, txFilter]);

  const balance = safeNum(wallet?.balance, 0);

  return (
    <div className="w-full ">
      <div className="0">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">

          {/* ===== HERO SECTION - WALLET HEADER ===== */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl border border-gray-700">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-xl flex-shrink-0">
                      <IoWalletOutline className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          RBM ESPORTS
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gray-600"></span>
                        <span className="text-xs font-medium text-gray-400">
                          Digital Wallet
                        </span>
                      </div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                        Manage Your <span className="text-blue-400">Funds</span>
                      </h1>
                      <p className="text-sm sm:text-base text-gray-400 mt-1 max-w-2xl">
                        Prize money automatically credited here. Secure Razorpay deposits & manual withdrawals.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Balance Card */}
                <div className="lg:w-auto w-full">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white shadow-2xl border border-blue-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="w-5 h-5 text-blue-200" />
                        <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                          Available Balance
                        </span>
                      </div>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-blue-200 hover:text-white transition-colors"
                        type="button"
                      >
                        {showBalance ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                      {showBalance ? `₹${balance.toLocaleString("en-IN")}` : "₹••••••"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-200">
                      <FiShieldIcon className="w-3.5 h-3.5" />
                      <span>Razorpay signature verified deposits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== TABS ===== */}
          <div className="bg-gray-100 p-1 rounded-xl max-w-md mx-auto">
            <div className="flex">
              <button
                onClick={() => setActiveSection("add")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base font-semibold ${
                  activeSection === "add" 
                    ? "bg-white text-blue-600 shadow-md" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
                type="button"
              >
                <FiArrowDownCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add Money</span>
              </button>

              <button
                onClick={() => setActiveSection("withdraw")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base font-semibold ${
                  activeSection === "withdraw" 
                    ? "bg-white text-gray-900 shadow-md" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
                type="button"
              >
                <FiArrowUpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* ===== ADD MONEY SECTION ===== */}
          {activeSection === "add" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Add Money Form */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <GiMoneyStack className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add Money to Wallet</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Quick & secure via Razorpay</p>
                  </div>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Enter Amount (₹)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <TbCurrencyRupee className="w-5 h-5" />
                      </div>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="pl-10 text-base sm:text-lg font-medium"
                        min="10"
                        max="100000"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Min: ₹10</span>
                      <span>Max: ₹1,00,000</span>
                    </div>
                  </div>

                  {/* Quick Select */}
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Quick Select</div>
                    <div className="grid grid-cols-5 gap-2">
                      {suggestedAmounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setAmount(amt)}
                          className={`py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                            Number(amount) === amt
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          type="button"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MdSecurity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-blue-800 text-sm mb-1">Secure Payment</div>
                        <div className="text-xs text-blue-700">
                          Payment processed via Razorpay. Backend verifies signature before crediting wallet.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={addMoney}
                    disabled={loading}
                    loading={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl py-3 sm:py-4 text-sm sm:text-base font-bold"
                    type="button"
                  >
                    <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <MdPayment className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Accepted Payment Methods</h2>
                    <p className="text-xs sm:text-sm text-gray-600">All major options supported</p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <FaRegCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-800 text-sm sm:text-base">Cards</div>
                        <div className="text-xs text-gray-600">Visa, Mastercard, RuPay</div>
                      </div>
                    </div>
                    <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <FaGooglePay className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                      <div>
                        <div className="font-semibold text-gray-800 text-sm sm:text-base">UPI</div>
                        <div className="text-xs text-gray-600">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </div>
                    <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <TbBuildingBank className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                      <div>
                        <div className="font-semibold text-gray-800 text-sm sm:text-base">Net Banking</div>
                        <div className="text-xs text-gray-600">All major banks</div>
                      </div>
                    </div>
                    <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <MdQrCode className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-800 text-sm sm:text-base">QR</div>
                        <div className="text-xs text-gray-600">Scan & Pay</div>
                      </div>
                    </div>
                    <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FiInfo className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-700">
                      <span className="font-semibold">Note:</span> Wallet topups credited only after Razorpay signature verification.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== WITHDRAW SECTION ===== */}
          {activeSection === "withdraw" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Withdraw Form */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <GiTakeMyMoney className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Withdraw Funds</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Manual admin payout • 24–48 hours</p>
                  </div>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Withdrawal Amount (₹)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <TbCurrencyRupee className="w-5 h-5" />
                      </div>
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="pl-10 text-base sm:text-lg font-medium"
                        min="100"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Min: ₹100</span>
                      <span>Max: ₹{balance.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Balance Info */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Available Balance:</span>
                      <span className="font-bold text-gray-900">₹{balance.toLocaleString("en-IN")}</span>
                    </div>
                    {balance >= 100 && (
                      <button
                        onClick={() => setWithdrawAmount(balance)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 w-full text-center"
                        type="button"
                      >
                        Withdraw Maximum
                      </button>
                    )}
                  </div>

                  {/* Withdrawal Method */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <GiPayMoney className="w-4 h-4 text-gray-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Withdrawal Method</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setMethod("upi")}
                        className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                          method === "upi"
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                        type="button"
                      >
                        <FaGooglePay className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-semibold">UPI</span>
                      </button>

                      <button
                        onClick={() => setMethod("bank")}
                        className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                          method === "bank"
                            ? "border-gray-700 bg-gray-100 text-gray-900"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                        type="button"
                      >
                        <BsBank className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-semibold">Bank</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={requestWithdraw}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white shadow-lg hover:shadow-xl py-3 sm:py-4 text-sm sm:text-base font-bold"
                    disabled={!withdrawAmount || Number(withdrawAmount) < 100 || Number(withdrawAmount) > balance}
                    type="button"
                  >
                    <GiReceiveMoney className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Request Withdrawal
                  </Button>

                  {/* Warning Note */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <FiAlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-800">
                        Withdrawal request creates pending record. Balance held immediately until admin processes.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <MdAccountBalance className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Account Details</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Saved for future withdrawals</p>
                  </div>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  {method === "upi" ? (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        UPI ID
                      </label>
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-2">
                        Example: name@okicici, name@ybl
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Account Holder Name
                        </label>
                        <Input
                          value={accountHolderName}
                          onChange={(e) => setAccountHolderName(e.target.value)}
                          placeholder="Full name"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Account Number
                        </label>
                        <Input
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="Account number"
                          type="text"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          IFSC Code
                        </label>
                        <Input
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value)}
                          placeholder="IFSC"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Bank Name
                        </label>
                        <Input
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="Bank name"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={saveWithdrawalInfo}
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2.5 sm:py-3 text-sm sm:text-base"
                    type="button"
                  >
                    <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Save Account Details
                  </Button>

                  <div className="border-t border-gray-200 pt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FiShieldIcon className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">Manual Payout Policy</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                        <span>Admin approves & pays via UPI/Bank (manual)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                        <span>Processing: typically 24–48 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                        <span>Every request recorded in wallet.pendingWithdrawals</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== TRANSACTION HISTORY ===== */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <FiRefreshCw className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Transaction History</h2>
                  <p className="text-xs sm:text-sm text-gray-600">From wallet.transactions</p>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {["all", "deposit", "prize_won", "tournament_fee", "withdrawal", "refund"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setTxFilter(k)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition ${
                      txFilter === k
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {k === "all" ? "All" : txLabel(k).text}
                  </button>
                ))}
              </div>
            </div>

            {filteredTx.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
                  <GiCash className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-2">No Transactions</h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  Transactions appear after deposits, prize credits, fees, withdrawals, or refunds.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTx
                  .slice()
                  .reverse()
                  .map((t, idx) => {
                    const badge = txLabel(t.type);
                    const amt = safeNum(t.amount, 0);
                    const positive = amt >= 0;

                    return (
                      <div
                        key={`${t.createdAt || idx}-${idx}`}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-1 rounded-md border text-xs font-semibold ${badge.cls}`}>
                              {badge.text}
                            </span>
                            <span className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                              {t.description || "—"}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                            <FiClock className="w-3.5 h-3.5" />
                            {formatDate(t.createdAt)}
                          </div>
                        </div>

                        <div className={`text-base sm:text-lg font-bold ${positive ? "text-blue-600" : "text-gray-800"}`}>
                          {positive ? "+" : "−"}₹{Math.abs(amt).toLocaleString("en-IN")}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>

          {/* ===== WITHDRAWAL REQUESTS ===== */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <GiTakeMyMoney className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Withdrawal Requests</h2>
                  <p className="text-xs sm:text-sm text-gray-600">From /api/wallet/withdrawals</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={load} 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm py-2 px-4"
                type="button"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {withdrawals.length === 0 ? (
              <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200">
                No withdrawal requests yet.
              </div>
            ) : (
              <div className="space-y-2">
                {withdrawals.map((w) => (
                  <div 
                    key={w._id} 
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-md border text-xs font-semibold ${wdStatusChip(w.status)}`}>
                          {String(w.status || "—").toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {w.method === "upi" ? "UPI" : "Bank"} withdrawal
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                        <FiClock className="w-3.5 h-3.5" />
                        {formatDate(w.requestedAt)}
                      </div>
                      {w.rejectionReason && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                          Rejected: {w.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div className="text-base sm:text-lg font-bold text-gray-900">
                      ₹{safeNum(w.amount, 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ===== FOOTER NOTE ===== */}
          <section className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50 p-4 text-xs sm:text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <FiInfo className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-800">Flow summary:</span> Add money: Razorpay order → payment → backend signature verify → wallet credited.
                Withdraw: request stored in pendingWithdrawals, admin manually pays via UPI/Bank.
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}