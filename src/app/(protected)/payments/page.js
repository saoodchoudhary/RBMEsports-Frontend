"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import { loadRazorpayScript, openRazorpay } from "@/lib/razorpay";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/uiSlice";

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
        return;
      }

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay checkout. Please try again.");

      // 1) Create order from backend
      const orderRes = await api.createOrder(payment._id);
      const { orderId, amount, currency, key, paymentId } = orderRes.data;

      // 2) Open Razorpay
      const options = {
        key,
        amount: String(amount * 100), // Razorpay expects paise, but backend already returns amount in INR.
        currency,
        name: "RBM ESports",
        description: "Tournament service fee",
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3) Verify payment with backend
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId
            });

            dispatch(showToast({ title: "Payment success", message: "Tournament registration confirmed." }));
            await load();
          } catch (e) {
            dispatch(showToast({ title: "Verify failed", message: e.message }));
          } finally {
            setLoadingId(null);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingId(null);
          }
        },
        theme: { color: "#2563eb" }
      };

      openRazorpay(options);
    } catch (e) {
      dispatch(showToast({ title: "Payment failed", message: e.message }));
      setLoadingId(null);
    }
  }

  const pending = payments.filter((p) => p.paymentStatus !== "success");
  const completed = payments.filter((p) => p.paymentStatus === "success");

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h1 className="text-xl font-extrabold">Payments</h1>
        <p className="mt-1 text-sm text-slate-600">Complete pending payments to confirm registration.</p>
      </div>

      <section className="space-y-3">
        <div className="text-sm font-bold">Pending</div>
        {pending.length === 0 && <div className="text-sm text-slate-600">No pending payments.</div>}

        <div className="space-y-2">
          {pending.map((p) => (
            <div key={p._id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold">{p.tournamentId?.title || "Tournament"}</div>
                  <div className="text-xs text-slate-600">
                    Amount: ₹{p.amount} • Status: {p.paymentStatus} • Gateway: {p.paymentGateway}
                  </div>
                </div>

                {p.amount > 0 ? (
                  <Button onClick={() => payWithRazorpay(p)} disabled={loadingId === p._id}>
                    {loadingId === p._id ? "Opening..." : "Pay with Razorpay"}
                  </Button>
                ) : (
                  <div className="text-xs font-semibold text-green-700">
                    ₹0 payable (coupon/free)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-sm font-bold">Completed</div>
        {completed.length === 0 && <div className="text-sm text-slate-600">No completed payments.</div>}
        <div className="space-y-2">
          {completed.slice(0, 10).map((p) => (
            <div key={p._id} className="card p-4">
              <div className="text-sm font-bold">{p.tournamentId?.title || "Tournament"}</div>
              <div className="text-xs text-slate-600">
                Paid: ₹{p.amount} • {new Date(p.completedAt || p.updatedAt || Date.now()).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}