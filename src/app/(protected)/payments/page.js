"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import { loadRazorpayScript, openRazorpay } from "@/lib/razorpay";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/uiSlice";
import { FiCheckCircle, FiClock, FiCreditCard, FiShield, FiTag } from "react-icons/fi";

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

function statusChip(status) {
  const s = String(status || "").toLowerCase();
  if (s === "success") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "processing") return "bg-blue-50 text-blue-700 border-blue-200";
  if (s === "failed") return "bg-rose-50 text-rose-700 border-rose-200";
  if (s === "pending") return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const dispatch = useDispatch();

  async function load() {
    const res = await api.myPayments();
    setPayments(res.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function payWithRazorpay(payment) {
    try {
      setLoadingId(payment._id);

      if (payment.amount <= 0) {
        dispatch(showToast({ title: "Not required", message: "₹0 payment does not need Razorpay." }));
        setLoadingId(null);
        return;
      }

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay checkout. Please try again.");

      // Create order from backend
      const orderRes = await api.createOrder(payment._id);
      const { orderId, amount, currency, key, paymentId } = orderRes.data;

      openRazorpay({
        key,
        amount: String(amount * 100), // INR -> paise
        currency,
        name: "RBM ESports",
        description: "Tournament service fee",
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId
            });

            dispatch(showToast({ title: "Payment success", message: "Tournament registration confirmed.", type: "success" }));
            await load();
          } catch (e) {
            dispatch(showToast({ title: "Verify failed", message: e.message, type: "error" }));
          } finally {
            setLoadingId(null);
          }
        },
        modal: { ondismiss: () => setLoadingId(null) },
        theme: { color: "#2563eb" }
      });
    } catch (e) {
      dispatch(showToast({ title: "Payment failed", message: e.message, type: "error" }));
      setLoadingId(null);
    }
  }

  const { pending, completed } = useMemo(() => {
    const pending = payments.filter((p) => p.paymentStatus !== "success");
    const completed = payments.filter((p) => p.paymentStatus === "success");
    return { pending, completed };
  }, [payments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Payments</h1>
            <p className="mt-1 text-sm text-slate-600">
              Complete pending payments to confirm registration. Razorpay orders are verified by signature.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <FiShield className="w-4 h-4 text-emerald-600" />
            Secure • Verified
          </div>
        </div>
      </div>

      {/* Pending */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold text-slate-900">Pending</div>
          <div className="text-xs text-slate-500">{pending.length} payments</div>
        </div>

        {pending.length === 0 ? (
          <div className="text-sm text-slate-600">No pending payments.</div>
        ) : (
          <div className="space-y-2">
            {pending.map((p) => (
              <div key={p._id} className="card p-4 border border-slate-200 hover:border-blue-200 transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {p.tournamentId?.title || "Tournament"}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-md border font-semibold ${statusChip(p.paymentStatus)}`}>
                        {String(p.paymentStatus || "—").toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded-md border bg-white text-slate-700 border-slate-200 font-semibold">
                        {String(p.paymentGateway || "razorpay").toUpperCase()}
                      </span>
                      {p.paymentType && (
                        <span className="px-2 py-1 rounded-md border bg-white text-slate-700 border-slate-200 font-semibold">
                          {String(p.paymentType).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      Amount: <span className="font-bold text-slate-900">₹{p.amount}</span>
                      {" • "}Initiated: {formatDate(p.initiatedAt || p.createdAt)}
                    </div>
                  </div>

                  {p.amount > 0 ? (
                    <Button
                      onClick={() => payWithRazorpay(p)}
                      disabled={loadingId === p._id}
                      className="md:min-w-[180px] flex items-center justify-center gap-2"
                      type="button"
                    >
                      <FiCreditCard className="w-4 h-4" />
                      {loadingId === p._id ? "Opening..." : "Pay with Razorpay"}
                    </Button>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                      <FiTag className="w-4 h-4" />
                      ₹0 payable (coupon/free)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold text-slate-900">Completed</div>
          <div className="text-xs text-slate-500">{completed.length} payments</div>
        </div>

        {completed.length === 0 ? (
          <div className="text-sm text-slate-600">No completed payments.</div>
        ) : (
          <div className="space-y-2">
            {completed.slice(0, 10).map((p) => (
              <div key={p._id} className="card p-4 border border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {p.tournamentId?.title || "Tournament"}
                    </div>
                    <div className="mt-1 text-xs text-slate-600 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        SUCCESS
                      </span>
                      <span className="text-slate-600">
                        Paid: <span className="font-bold text-slate-900">₹{p.amount}</span>
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                      <FiClock className="w-3.5 h-3.5" />
                      {formatDate(p.completedAt || p.updatedAt || p.createdAt)}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Gateway: <span className="font-semibold text-slate-700">{p.paymentGateway || "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}