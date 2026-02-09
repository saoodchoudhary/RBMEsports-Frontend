"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { loadRazorpayScript, openRazorpay } from "@/lib/razorpay";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/uiSlice";
import {
  GiWallet,
  GiMoneyStack,
  GiPayMoney,
  GiReceiveMoney,
  GiBanknote,
  GiCash,
  GiTakeMyMoney
} from "react-icons/gi";
import {
  FiDollarSign,
  FiCreditCard,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiInfo
} from "react-icons/fi";
import {
  MdOutlineAccountBalanceWallet,
  MdPayment,
  MdSecurity,
  MdAccountBalance,
  MdQrCode
} from "react-icons/md";
import { BsBank } from "react-icons/bs";
import { FaRupeeSign, FaRegCreditCard, FaGooglePay } from "react-icons/fa";

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState(500);
  const [loading, setLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [activeSection, setActiveSection] = useState("add"); // "add" or "withdraw"

  const dispatch = useDispatch();

  async function load() {
    const res = await api.wallet();
    setWallet(res.data);
  }

  useEffect(() => { 
    load(); 
  }, []);

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
        handler: async function (response) {
          try {
            await api.walletVerifyAdd({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amt
            });
            dispatch(showToast({ 
              title: "Wallet Updated", 
              message: `₹${amt} successfully added to your wallet.`,
              type: "success"
            }));
            await load();
          } catch (e) {
            dispatch(showToast({ 
              title: "Verification Failed", 
              message: e.message,
              type: "error"
            }));
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        theme: { color: "#2563eb" }
      });
    } catch (e) {
      dispatch(showToast({ 
        title: "Add Money Failed", 
        message: e.message,
        type: "error"
      }));
      setLoading(false);
    }
  }

  async function saveWithdrawalInfo() {
    try {
      const payload = {
        method,
        accountHolderName,
        accountNumber,
        ifscCode,
        bankName,
        upiId
      };
      await api.walletWithdrawalInfo(payload);
      dispatch(showToast({ 
        title: "Information Saved", 
        message: "Withdrawal information updated successfully.",
        type: "success"
      }));
      await load();
    } catch (e) {
      dispatch(showToast({ 
        title: "Failed to Save", 
        message: e.message,
        type: "error"
      }));
    }
  }

  async function requestWithdraw() {
    try {
      const amt = Number(withdrawAmount);
      if (!amt || amt < 100) throw new Error("Minimum withdrawal amount is ₹100");
      
      if (wallet && amt > wallet.balance) {
        throw new Error("Insufficient balance for withdrawal");
      }

      const accountDetails =
        method === "upi"
          ? { upiId }
          : { accountHolderName, accountNumber, ifscCode, bankName };

      await api.walletWithdraw({ amount: amt, method, accountDetails });
      dispatch(showToast({ 
        title: "Withdrawal Requested", 
        message: "Your withdrawal request has been submitted successfully.",
        type: "success"
      }));
      await load();
      setWithdrawAmount(100);
    } catch (e) {
      dispatch(showToast({ 
        title: "Withdrawal Failed", 
        message: e.message,
        type: "error"
      }));
    }
  }

  const suggestedAmounts = [100, 500, 1000, 2000, 5000];

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
              <p className="text-slate-700 mt-1">
                Manage your funds securely. Prize money is automatically credited here.
              </p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-200 shadow-sm">
            <div className="text-center">
              <div className="text-sm text-slate-600 font-medium mb-2">Available Balance</div>
              <div className="text-4xl font-bold text-blue-700">
                ₹{wallet?.balance?.toLocaleString('en-IN') || "0"}
              </div>
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-slate-600">
                <FiShield className="w-4 h-4 text-green-500" />
                <span>100% Secure Transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl max-w-2xl mx-auto">
        <button
          onClick={() => setActiveSection("add")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg transition-all duration-300 ${
            activeSection === "add"
              ? "bg-white text-blue-600 shadow-md"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <FiArrowDownCircle className="w-5 h-5" />
          <span className="font-semibold">Add Money</span>
        </button>
        <button
          onClick={() => setActiveSection("withdraw")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg transition-all duration-300 ${
            activeSection === "withdraw"
              ? "bg-white text-emerald-600 shadow-md"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <FiArrowUpCircle className="w-5 h-5" />
          <span className="font-semibold">Withdraw</span>
        </button>
      </div>

      {/* Add Money Section */}
      {activeSection === "add" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Add Money Form */}
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter Amount (₹)
                </label>
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
                <div className="text-xs text-slate-500 mt-2">
                  Min: ₹10 | Max: ₹1,00,000
                </div>
              </div>

              {/* Suggested Amounts */}
              <div>
                <div className="text-sm font-medium text-slate-700 mb-3">Quick Select</div>
                <div className="grid grid-cols-5 gap-2">
                  {suggestedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`py-2.5 rounded-lg font-medium transition-all ${
                        amount == amt
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Security */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MdSecurity className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-green-800 mb-1">Secure Payment</div>
                    <div className="text-sm text-green-700">
                      Your payment is processed securely via Razorpay. We never store your card details.
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={addMoney}
                disabled={loading}
                loading={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl py-4"
              >
                <FiCreditCard className="w-5 h-5 mr-2" />
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </div>

          {/* Right: Payment Methods */}
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
                    <div className="font-semibold text-slate-800">Credit & Debit Cards</div>
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
                    <div className="font-semibold text-slate-800">QR Code</div>
                    <div className="text-sm text-slate-600">Scan & Pay</div>
                  </div>
                </div>
                <FiCheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <span className="font-semibold">Note:</span> Funds added to wallet can be used for tournament entries or withdrawn to your bank/UPI account.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Section */}
      {activeSection === "withdraw" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Withdraw Form */}
          <div className="card p-6 border-2 border-emerald-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <GiTakeMyMoney className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Withdraw Funds</h2>
                <p className="text-slate-600">Transfer to your bank account or UPI ID</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Withdrawal Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Withdrawal Amount (₹)
                </label>
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
                <div className="text-xs text-slate-500 mt-2">
                  Minimum withdrawal: ₹100 | Processing time: 24-48 hours
                </div>
              </div>

              {/* Balance Info */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="text-slate-700">
                    Available Balance: <span className="font-bold text-emerald-700">₹{wallet?.balance?.toLocaleString('en-IN') || "0"}</span>
                  </div>
                  <button
                    onClick={() => withdrawAmount && wallet && setWithdrawAmount(wallet.balance)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              {/* Withdrawal Method */}
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
                  >
                    <FaGooglePay className="w-5 h-5" />
                    <span className="font-medium">UPI Transfer</span>
                  </button>
                  <button
                    onClick={() => setMethod("bank")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      method === "bank"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <BsBank className="w-5 h-5" />
                    <span className="font-medium">Bank Transfer</span>
                  </button>
                </div>
              </div>

              <Button
                onClick={requestWithdraw}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg hover:shadow-xl py-4"
                disabled={!withdrawAmount || withdrawAmount < 100}
              >
                <GiReceiveMoney className="w-5 h-5 mr-2" />
                Request Withdrawal
              </Button>
            </div>
          </div>

          {/* Right: Account Details */}
          <div className="card p-6 border-2 border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <MdAccountBalance className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Account Details</h2>
                <p className="text-slate-600">Configure your withdrawal preferences</p>
              </div>
            </div>

            <div className="space-y-6">
              {method === "upi" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      UPI ID
                    </label>
                    <Input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      icon={<FaGooglePay className="w-4 h-4" />}
                    />
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        Ensure your UPI ID is correct. Withdrawals are processed within 24-48 hours.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Account Holder Name
                    </label>
                    <Input
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      placeholder="Full name as per bank"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Account Number
                    </label>
                    <Input
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Bank account number"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      IFSC Code
                    </label>
                    <Input
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      placeholder="Bank IFSC code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bank Name
                    </label>
                    <Input
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Bank name"
                    />
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                onClick={saveWithdrawalInfo}
                className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                <FiCheckCircle className="w-5 h-5 mr-2" />
                Save Account Details
              </Button>

              {/* Security Info */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiShield className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-slate-800">Security Assurance</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    All withdrawals require admin approval
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    Bank-level security for financial data
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    Processing time: 24-48 business hours
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    Transaction history is permanently recorded
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions (Placeholder) */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <FiRefreshCw className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
              <p className="text-slate-600">View your wallet transactions</p>
            </div>
          </div>
          <Button variant="outline" className="text-sm">
            View All
          </Button>
        </div>
        
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 mb-4">
            <GiCash className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Transactions Yet</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Your transaction history will appear here once you add money or make withdrawals.
          </p>
        </div>
      </div>
    </div>
  );
}