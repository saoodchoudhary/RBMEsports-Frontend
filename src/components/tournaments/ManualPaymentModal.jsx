"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/uiSlice";
import { FiCopy, FiInfo, FiSend } from "react-icons/fi";

export default function ManualPaymentModal({
  open,
  onClose,
  paymentId,
  amount,
  tournamentTitle
}) {
  const dispatch = useDispatch();
  const [utr, setUtr] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Set your real payee details here
  const PAYEE_UPI = "rbmesports@upi";
  const PAYEE_NAME = "RBM ESports";
  const QR_URL = "/upi-qr.png"; // ✅ public/upi-qr.png

  useEffect(() => {
    if (open) {
      setUtr("");
      setNotes("");
    }
  }, [open]);

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(PAYEE_UPI);
      dispatch(showToast({ type: "success", title: "Copied", message: "UPI ID copied" }));
    } catch {
      dispatch(showToast({ type: "error", title: "Copy Failed", message: "Could not copy UPI ID" }));
    }
  }

  async function submitProof() {
    if (!paymentId) {
      dispatch(showToast({ type: "error", title: "Error", message: "PaymentId missing" }));
      return;
    }

    if (!utr.trim()) {
      dispatch(showToast({ type: "error", title: "UTR required", message: "Please enter UTR / Transaction ID" }));
      return;
    }

    setSubmitting(true);
    try {
      await api.submitManualPaymentProof(paymentId, {
        utr: utr.trim(),
        notes: notes.trim()
      });

      dispatch(
        showToast({
          type: "success",
          title: "Submitted",
          message: "Payment proof submitted. Status: Pending Review"
        })
      );

      onClose?.();
    } catch (e) {
      dispatch(showToast({ type: "error", title: "Failed", message: e.message || "Submit failed" }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Pay via UPI (Manual)" size="md">
      <div className="space-y-4">
        <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-xs text-blue-800 flex gap-2">
          <FiInfo className="w-4 h-4 mt-0.5" />
          <div>
            <div className="font-semibold">Slot booked</div>
            <div>
              Pay now and submit UTR. Admin verify karega. Tournament:{" "}
              <span className="font-semibold">{tournamentTitle || "—"}</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-gray-500">Amount</div>
          <div className="text-2xl font-extrabold text-blue-600">₹{amount}</div>

          <div className="mt-3 text-xs text-gray-500">Pay to</div>
          <div className="text-sm font-bold text-gray-900">{PAYEE_NAME}</div>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm">
              {PAYEE_UPI}
            </div>
            <Button type="button" variant="outline" onClick={copyUpi}>
              <FiCopy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>

          <div className="mt-4 flex justify-center">
            <img
              src={QR_URL}
              alt="UPI QR"
              className="w-56 h-56 object-contain border border-gray-200 rounded-xl"
            />
          </div>

          <div className="text-[11px] text-gray-500 text-center mt-2">
            Scan QR and pay exactly ₹{amount}
          </div>
        </div>

        <Input
          label="UTR / Transaction ID"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="Enter UTR"
          required
        />

        <Input
          label="Admin Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything to help verification"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={submitProof} loading={submitting}>
            <FiSend className="w-4 h-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}