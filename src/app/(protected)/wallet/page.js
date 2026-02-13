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
  GiTakeMyMoney
} from "react-icons/gi";
import {
  FiCreditCard,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiInfo,
  FiClock
} from "react-icons/fi";
import { MdPayment, MdSecurity, MdAccountBalance, MdQrCode } from "react-icons/md";
import { BsBank } from "react-icons/bs";
import { FaRupeeSign, FaRegCreditCard, FaGooglePay } from "react-icons/fa";

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
      return { text: "Prize", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "tournament_fee":
      return { text: "Tournament Fee", cls: "bg-amber-50 text-amber-800 border-amber-200" };
    case "withdrawal":
      return { text: "Withdrawal", cls: "bg-purple-50 text-purple-700 border-purple-200" };
    case "refund":
      return { text: "Refund", cls: "bg-slate-50 text-slate-700 border-slate-200" };
    default:
      return { text: type || "Txn", cls: "bg-slate-50 text-slate-700 border-slate-200" };
  }
}

function wdStatusChip(status) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "processing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function isValidUpi(upi) {
  // simple check only (backend/admin manual verification anyway)
  if (!upi) return false;
  return /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(String(upi).trim());
}

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);

  const [amount, setAmount] = useState(500);
  const [loading, setLoading] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [method, setMethod] = useState("upi"); // upi | bank

  // Withdrawal info (saved)
  const [upiId, setUpiId] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  const [activeSection, setActiveSection] = useState("add"); // add | withdraw
  const [txFilter, setTxFilter] = useState("all"); // all | deposit | prize_won | tournament_fee | withdrawal | refund

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // optional UX: when method switches, clear irrelevant fields (but keep saved values if present)
  useEffect(() => {
    if (method === "upi") {
      // keep bank fields as-is (because saved) but no harm
    } else {
      // keep upi as-is
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

      // backend expects {amount}
      const orderRes = await api.walletAddMoneyOrder(amt);
      const { orderId, key } = orderRes.data;

      // Razorpay options
      openRazorpay({
        key,
        amount: String(amt * 100),
        currency: "INR",
        name: "RBM ESports",
        description: "Wallet top-up",
        order_id: orderId,

        // ✅ prefill improves conversion
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
      // basic validation (optional but helpful)
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

      // ✅ validate method details
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <GiWallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Digital Wallet</h1>
              <p className="text-slate-700 mt-1">Manage your funds securely. Prize money is automatically credited here.</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-200 shadow-sm">
            <div className="text-center">
              <div className="text-sm text-slate-600 font-medium mb-2">Available Balance</div>
              <div className="text-4xl font-bold text-blue-700">₹{safeNum(wallet?.balance, 0).toLocaleString("en-IN")}</div>
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-slate-600">
                <FiShield className="w-4 h-4 text-green-500" />
                <span>Razorpay signature verified deposits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl max-w-2xl mx-auto">
        <button
          onClick={() => setActiveSection("add")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg transition-all duration-300 ${
            activeSection === "add" ? "bg-white text-blue-600 shadow-md" : "text-slate-600 hover:text-slate-800"
          }`}
          type="button"
        >
          <FiArrowDownCircle className="w-5 h-5" />
          <span className="font-semibold">Add Money</span>
        </button>

        <button
          onClick={() => setActiveSection("withdraw")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg transition-all duration-300 ${
            activeSection === "withdraw" ? "bg-white text-emerald-600 shadow-md" : "text-slate-600 hover:text-slate-800"
          }`}
          type="button"
        >
          <FiArrowUpCircle className="w-5 h-5" />
          <span className="font-semibold">Withdraw</span>
        </button>
      </div>

      {/* Add Money */}
      {activeSection === "add" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6 border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <GiMoneyStack className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add Money to Wallet</h2>
                <p className="text-slate-600">Quick and secure payments via Razorpay</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Enter Amount (₹)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                    <FaRupeeSign className="w-5 h-5" />
                  </div>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-10 text-lg font-medium"
                    min="10"
                    max="100000"
                  />
                </div>
                <div className="text-xs text-slate-500 mt-2">Min: ₹10 | Max: ₹1,00,000</div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-700 mb-3">Quick Select</div>
                <div className="grid grid-cols-5 gap-2">
                  {suggestedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`py-2.5 rounded-lg font-medium transition-all ${
                        Number(amount) === amt
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      type="button"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MdSecurity className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-green-800 mb-1">Secure Payment</div>
                    <div className="text-sm text-green-700">
                      Your payment is processed via Razorpay. Backend verifies signature before crediting wallet.
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={addMoney}
                disabled={loading}
                loading={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl py-4"
                type="button"
              >
                <FiCreditCard className="w-5 h-5 mr-2" />
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </div>

          <div className="card p-6 border-2 border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <MdPayment className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Accepted Payment Methods</h2>
                <p className="text-slate-600">All major payment options supported</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <FaRegCreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Cards</div>
                    <div className="text-sm text-slate-600">Visa, Mastercard, RuPay</div>
                  </div>
                </div>
                <FiCheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <FaGooglePay className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-slate-800">UPI</div>
                    <div className="text-sm text-slate-600">Google Pay, PhonePe, Paytm</div>
                  </div>
                </div>
                <FiCheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3">
                  <BsBank className="w-6 h-6 text-amber-600" />
                  <div>
                    <div className="font-semibold text-slate-800">Net Banking</div>
                    <div className="text-sm text-slate-600">All major banks</div>
                  </div>
                </div>
                <FiCheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <MdQrCode className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-semibold text-slate-800">QR</div>
                    <div className="text-sm text-slate-600">Scan & Pay</div>
                  </div>
                </div>
                <FiCheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <span className="font-semibold">Note:</span> Wallet topups are credited only after Razorpay signature verification.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw */}
      {activeSection === "withdraw" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6 border-2 border-emerald-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <GiTakeMyMoney className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Withdraw Funds</h2>
                <p className="text-slate-600">Manual admin payout (UPI/Bank). Usually 24–48 hours.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Withdrawal Amount (₹)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                    <FaRupeeSign className="w-5 h-5" />
                  </div>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-10 text-lg font-medium"
                    min="100"
                  />
                </div>

                <div className="text-xs text-slate-500 mt-2">Minimum withdrawal: ₹100</div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="text-slate-700">
                    Available Balance:{" "}
                    <span className="font-bold text-emerald-700">₹{safeNum(wallet?.balance, 0).toLocaleString("en-IN")}</span>
                  </div>
                  <button
                    onClick={() => wallet && setWithdrawAmount(safeNum(wallet.balance, 0))}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    type="button"
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <GiPayMoney className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Withdrawal Method</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMethod("upi")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      method === "upi"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                    type="button"
                  >
                    <FaGooglePay className="w-5 h-5" />
                    <span className="font-medium">UPI</span>
                  </button>

                  <button
                    onClick={() => setMethod("bank")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      method === "bank"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                    type="button"
                  >
                    <BsBank className="w-5 h-5" />
                    <span className="font-medium">Bank</span>
                  </button>
                </div>
              </div>

              <Button
                onClick={requestWithdraw}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg hover:shadow-xl py-4"
                disabled={!withdrawAmount || Number(withdrawAmount) < 100}
                type="button"
              >
                <GiReceiveMoney className="w-5 h-5 mr-2" />
                Request Withdrawal
              </Button>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    Withdrawal request creates a pending record in backend and balance is held immediately.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="card p-6 border-2 border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <MdAccountBalance className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Account Details</h2>
                <p className="text-slate-600">Saved for future withdrawals</p>
              </div>
            </div>

            <div className="space-y-6">
              {method === "upi" ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
                  <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" icon={<FaGooglePay className="w-4 h-4" />} />
                  <div className="text-xs text-slate-500 mt-2">Example: name@okicici, name@ybl</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Account Holder Name</label>
                    <Input value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                    <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account number" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">IFSC Code</label>
                    <Input value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="IFSC" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
                    <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank name" />
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                onClick={saveWithdrawalInfo}
                className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                type="button"
              >
                <FiCheckCircle className="w-5 h-5 mr-2" />
                Save Account Details
              </Button>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiShield className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-slate-800">Manual payout policy</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Admin approves and pays via UPI/Bank (manual)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Processing: typically 24–48 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Every request is recorded in wallet.pendingWithdrawals
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <FiRefreshCw className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
              <p className="text-slate-600">From wallet.transactions</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "deposit", "prize_won", "tournament_fee", "withdrawal", "refund"].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTxFilter(k)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                  txFilter === k
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {k === "all" ? "All" : txLabel(k).text}
              </button>
            ))}
          </div>
        </div>

        {filteredTx.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 mb-4">
              <GiCash className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Transactions</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Transactions will appear here after deposits, prize credits, fees, withdrawals, or refunds.
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
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 rounded-md border text-xs font-semibold ${badge.cls}`}>{badge.text}</span>
                        <div className="font-semibold text-slate-900 line-clamp-1">{t.description || "—"}</div>
                      </div>
                      <div className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                        <FiClock className="w-3.5 h-3.5" />
                        {formatDate(t.createdAt)}
                      </div>
                    </div>

                    <div className={`text-lg font-extrabold ${positive ? "text-emerald-700" : "text-rose-700"}`}>
                      {positive ? "+" : ""}₹{Math.abs(amt).toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Withdrawal Requests */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Withdrawal Requests</h2>
            <p className="text-slate-600">From /api/wallet/withdrawals</p>
          </div>

          <Button variant="outline" onClick={load} type="button">
            Refresh
          </Button>
        </div>

        {withdrawals.length === 0 ? (
          <div className="text-sm text-slate-600">No withdrawal requests yet.</div>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <div key={w._id} className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-md border text-xs font-semibold ${wdStatusChip(w.status)}`}>
                      {String(w.status || "—").toUpperCase()}
                    </span>
                    <div className="text-sm font-semibold text-slate-900">{w.method === "upi" ? "UPI" : "Bank"} withdrawal</div>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{formatDate(w.requestedAt)}</div>
                  {w.rejectionReason && <div className="mt-2 text-xs text-rose-700">Rejected: {w.rejectionReason}</div>}
                </div>

                <div className="text-lg font-extrabold text-slate-900">₹{safeNum(w.amount, 0).toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <div className="flex items-start gap-2">
          <FiInfo className="w-5 h-5 mt-0.5" />
          <div>
            <div className="font-semibold">Flow summary</div>
            <div className="mt-1">
              Add money: Razorpay order → payment → backend signature verify → wallet credited.
              Withdraw: request stored in pendingWithdrawals, admin manually pays via UPI/Bank.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}