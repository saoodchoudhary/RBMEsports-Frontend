"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { api } from "@/lib/api";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/uiSlice";
import { FiCheckCircle, FiClock, FiEye, FiRefreshCw, FiXCircle } from "react-icons/fi";

function formatMoney(n) {
  const v = Number(n || 0);
  return `₹${v.toLocaleString("en-IN")}`;
}

function kv(label, value) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-800 text-right break-all">{value || "—"}</div>
    </div>
  );
}

export default function AdminManualPaymentsPage() {
  const dispatch = useDispatch();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("on_hold");

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [decisionLoading, setDecisionLoading] = useState(false);
  const [txId, setTxId] = useState("");
  const [reason, setReason] = useState("");

  async function load() {
    try {
      setLoading(true);
      const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await api.adminManualPayments(qs);
      setRows(res.data || []);
    } catch (e) {
      dispatch(showToast({ title: "Error", message: e?.message || "Failed to load manual payments", type: "error" }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;

    return rows.filter((r) => {
      const text = [
        r._id,
        r.userId?.name,
        r.userId?.email,
        r.userId?.phone,
        r.userId?.bgmiId,
        r.tournamentId?.title,
        r.referenceId,
        r.metadata?.manualProof?.utr
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(s);
    });
  }, [rows, q]);

  function openRow(r) {
    setSelected(r);
    setTxId("");
    setReason("");
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setSelected(null);
    setTxId("");
    setReason("");
  }

  async function approve() {
    if (!selected?._id) return;
    if (!txId.trim()) {
      dispatch(showToast({ title: "TX required", message: "Enter transaction ID to approve.", type: "error" }));
      return;
    }

    setDecisionLoading(true);
    try {
      await api.adminDecideManualPayment(selected._id, {
        decision: "approve",
        transactionId: txId.trim()
      });
      dispatch(showToast({ title: "Approved", message: "Manual payment approved.", type: "success" }));
      await load();
      close();
    } catch (e) {
      dispatch(showToast({ title: "Error", message: e?.message || "Failed", type: "error" }));
    } finally {
      setDecisionLoading(false);
    }
  }

  async function reject() {
    if (!selected?._id) return;
    if (!reason.trim()) {
      dispatch(showToast({ title: "Reason required", message: "Enter rejection reason.", type: "error" }));
      return;
    }

    setDecisionLoading(true);
    try {
      await api.adminDecideManualPayment(selected._id, {
        decision: "reject",
        rejectionReason: reason.trim()
      });
      dispatch(showToast({ title: "Rejected", message: "Manual payment rejected.", type: "success" }));
      await load();
      close();
    } catch (e) {
      dispatch(showToast({ title: "Error", message: e?.message || "Failed", type: "error" }));
    } finally {
      setDecisionLoading(false);
    }
  }

  const columns = [
    {
      key: "user",
      title: "User",
      render: (r) => (
        <div className="min-w-[200px]">
          <div className="font-medium text-slate-800">{r.userId?.name || "—"}</div>
          <div className="text-xs text-slate-500">{r.userId?.email || "—"}</div>
        </div>
      )
    },
    {
      key: "tournament",
      title: "Tournament",
      render: (r) => <div className="min-w-[220px] font-semibold text-slate-800">{r.tournamentId?.title || "—"}</div>
    },
    {
      key: "amount",
      title: "Amount",
      render: (r) => <div className="font-bold text-slate-900 whitespace-nowrap">{formatMoney(r.amount)}</div>
    },
    {
      key: "status",
      title: "Status",
      render: (r) => (
        <span className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-800 font-semibold">
          {String(r.paymentStatus || "—")}
        </span>
      )
    },
    {
      key: "actions",
      title: "Open",
      render: (r) => (
        <Button variant="outline" size="sm" type="button" onClick={() => openRow(r)}>
          <FiEye className="w-4 h-4 mr-1" />
          View
        </Button>
      )
    }
  ];

  const proof = selected?.metadata?.manualProof;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manual Payments</h1>
          <p className="text-slate-600">Approve/reject UPI proof submissions</p>
        </div>
        <Button variant="outline" onClick={load} type="button">
          <FiRefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search user, tournament, UTR..." />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "on_hold" ? "primary" : "outline"}
              onClick={() => setStatusFilter("on_hold")}
              type="button"
            >
              <FiClock className="w-4 h-4 mr-1" />
              On Hold
            </Button>
            <Button
              variant={statusFilter === "success" ? "primary" : "outline"}
              onClick={() => setStatusFilter("success")}
              type="button"
            >
              <FiCheckCircle className="w-4 h-4 mr-1" />
              Approved
            </Button>
            <Button
              variant={statusFilter === "failed" ? "primary" : "outline"}
              onClick={() => setStatusFilter("failed")}
              type="button"
            >
              <FiXCircle className="w-4 h-4 mr-1" />
              Rejected
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="font-semibold text-slate-800">Requests ({filtered.length})</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-600">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-600">No manual payment requests.</div>
        ) : (
          <Table columns={columns} rows={filtered} />
        )}
      </Card>

      <Modal open={open && !!selected} onClose={close} title="Manual Payment Details" size="md">
        {selected && (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-bold text-slate-900 mb-2">User</div>
              {kv("Name", selected.userId?.name)}
              {kv("Email", selected.userId?.email)}
              {kv("Phone", selected.userId?.phone)}
              {kv("BGMI ID", selected.userId?.bgmiId)}
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-bold text-slate-900 mb-2">Payment</div>
              {kv("Payment ID", selected._id)}
              {kv("Tournament", selected.tournamentId?.title)}
              {kv("Amount", formatMoney(selected.amount))}
              {kv("Status", selected.paymentStatus)}
              {kv("Reference/UTR", selected.referenceId || proof?.utr)}
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-bold text-slate-900 mb-2">Proof</div>
              {kv("UTR", proof?.utr)}
              {kv("Notes", proof?.notes)}
              {kv("Submitted At", proof?.submittedAt)}
              {proof?.screenshotBase64 ? (
                <div className="mt-3">
                  <img src={proof.screenshotBase64} alt="Proof" className="rounded-xl border max-h-80" />
                </div>
              ) : (
                <div className="text-sm text-slate-500 mt-2">No screenshot.</div>
              )}
            </div>

            {selected.paymentStatus === "on_hold" ? (
              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="text-sm font-bold text-slate-900">Decision</div>

                <div>
                  <div className="text-sm font-semibold text-slate-700">Approve (Transaction ID required)</div>
                  <Input value={txId} onChange={(e) => setTxId(e.target.value)} placeholder="Transaction ID" />
                  <Button onClick={approve} loading={decisionLoading} className="mt-2" type="button">
                    <FiCheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <div className="text-sm font-semibold text-slate-700">Reject (Reason required)</div>
                  <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
                  <Button variant="outline" onClick={reject} loading={decisionLoading} className="mt-2 border-red-300 text-red-600 hover:bg-red-50" type="button">
                    <FiXCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-600">This payment is already processed.</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}