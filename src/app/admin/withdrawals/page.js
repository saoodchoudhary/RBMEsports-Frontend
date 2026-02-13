"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import {
  FiDollarSign,
  FiSearch,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiRefreshCw,
  FiX
} from "react-icons/fi";
import { GiMoneyStack, GiTakeMyMoney } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/uiSlice";

function formatMoney(n) {
  const v = Number(n || 0);
  return `₹${v.toLocaleString("en-IN")}`;
}

function safeDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatRequestedCell(value) {
  const d = safeDate(value);
  if (!d) return { date: "—", time: "—" };
  return {
    date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  };
}

function statusMeta(status) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        icon: FiClock,
        pill: "bg-amber-100 text-amber-800",
        iconColor: "text-amber-500"
      };
    case "completed":
      return {
        label: "Completed",
        icon: FiCheckCircle,
        pill: "bg-green-100 text-green-800",
        iconColor: "text-green-500"
      };
    case "rejected":
      return {
        label: "Rejected",
        icon: FiXCircle,
        pill: "bg-red-100 text-red-800",
        iconColor: "text-red-500"
      };
    case "processing":
      return {
        label: "Processing",
        icon: FiClock,
        pill: "bg-blue-100 text-blue-800",
        iconColor: "text-blue-500"
      };
    default:
      return {
        label: status ? String(status) : "—",
        icon: FiClock,
        pill: "bg-slate-100 text-slate-700",
        iconColor: "text-slate-500"
      };
  }
}

function kv(label, value) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-800 text-right break-all">{value || "—"}</div>
    </div>
  );
}

export default function AdminWithdrawalsPage() {
  const dispatch = useDispatch();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Row modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Processing states
  const [processingId, setProcessingId] = useState(null);

  // Modal inputs
  const [txId, setTxId] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  async function load(nextStatus) {
    const st = typeof nextStatus === "string" ? nextStatus : statusFilter;

    try {
      setLoading(true);

      const qs = st !== "all" ? `?status=${encodeURIComponent(st)}` : "";
      const res = await api.adminWithdrawals(qs);

      setRows(res.data || []);
    } catch (error) {
      dispatch(
        showToast({
          title: "Error",
          message: error?.message || "Failed to load withdrawals",
          type: "error"
        })
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((w) => w.status === "pending").length;
    const completed = rows.filter((w) => w.status === "completed").length;
    const rejected = rows.filter((w) => w.status === "rejected").length;
    const processing = rows.filter((w) => w.status === "processing").length;
    const totalAmount = rows.reduce((sum, w) => sum + Number(w.amount || 0), 0);

    return { total, pending, processing, completed, rejected, totalAmount };
  }, [rows]);

  const filteredRows = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return rows;

    return rows.filter((row) => {
      const text = [
        row.user?.name,
        row.user?.bgmiId,
        row.user?.email,
        row.user?.phone,
        row.method,
        row.status,
        row.transactionId,
        row.rejectionReason,
        // also search accountDetails if present
        row.accountDetails?.upiId,
        row.accountDetails?.accountHolderName,
        row.accountDetails?.accountNumber,
        row.accountDetails?.ifscCode,
        row.accountDetails?.bankName
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(s);
    });
  }, [rows, search]);

  function exportCsv() {
    const header = [
      "withdrawalId",
      "walletId",
      "userName",
      "bgmiId",
      "email",
      "phone",
      "amount",
      "method",
      "status",
      "requestedAt",
      "processedAt",
      "transactionId",
      "rejectionReason",
      "upiId",
      "accountHolderName",
      "accountNumber",
      "ifscCode",
      "bankName"
    ];

    const lines = [header.join(",")].concat(
      filteredRows.map((r) => {
        const ad = r.accountDetails || {};
        const vals = [
          r._id ?? "",
          r.walletId ?? "",
          r.user?.name ?? "",
          r.user?.bgmiId ?? "",
          r.user?.email ?? "",
          r.user?.phone ?? "",
          r.amount ?? 0,
          r.method ?? "",
          r.status ?? "",
          r.requestedAt ? new Date(r.requestedAt).toISOString() : "",
          r.processedAt ? new Date(r.processedAt).toISOString() : "",
          r.transactionId ?? "",
          r.rejectionReason ?? "",
          ad.upiId ?? "",
          ad.accountHolderName ?? "",
          ad.accountNumber ?? "",
          ad.ifscCode ?? "",
          ad.bankName ?? ""
        ];
        return vals.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",");
      })
    );

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `withdrawals_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openRow(r) {
    setSelected(r);
    setTxId("");
    setRejectReason("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setSelected(null);
    setTxId("");
    setRejectReason("");
  }

  async function approveSelected() {
    const w = selected;
    if (!w?.walletId || !w?._id) {
      dispatch(showToast({ title: "Error", message: "Invalid withdrawal data (missing walletId/_id)", type: "error" }));
      return;
    }
    if (w.status !== "pending") {
      dispatch(showToast({ title: "Info", message: "Only pending withdrawals can be approved.", type: "info" }));
      return;
    }
    if (!txId.trim()) {
      dispatch(showToast({ title: "Transaction ID required", message: "Please enter transaction ID to approve.", type: "error" }));
      return;
    }

    setProcessingId(w._id);
    try {
      await api.adminProcessWithdrawal(w.walletId, w._id, {
        status: "completed",
        transactionId: txId.trim()
      });

      dispatch(showToast({ title: "Success", message: "Withdrawal approved successfully", type: "success" }));
      await load(statusFilter);
      closeModal();
    } catch (error) {
      dispatch(showToast({ title: "Error", message: error?.message || "Failed to approve withdrawal", type: "error" }));
    } finally {
      setProcessingId(null);
    }
  }

  async function rejectSelected() {
    const w = selected;
    if (!w?.walletId || !w?._id) {
      dispatch(showToast({ title: "Error", message: "Invalid withdrawal data (missing walletId/_id)", type: "error" }));
      return;
    }
    if (w.status !== "pending") {
      dispatch(showToast({ title: "Info", message: "Only pending withdrawals can be rejected.", type: "info" }));
      return;
    }
    if (!rejectReason.trim()) {
      dispatch(showToast({ title: "Reason required", message: "Please enter rejection reason.", type: "error" }));
      return;
    }

    setProcessingId(w._id);
    try {
      await api.adminProcessWithdrawal(w.walletId, w._id, {
        status: "rejected",
        rejectionReason: rejectReason.trim()
      });

      dispatch(showToast({ title: "Success", message: "Withdrawal rejected successfully", type: "success" }));
      await load(statusFilter);
      closeModal();
    } catch (error) {
      dispatch(showToast({ title: "Error", message: error?.message || "Failed to reject withdrawal", type: "error" }));
    } finally {
      setProcessingId(null);
    }
  }

  const columns = [
    {
      key: "user",
      title: "User",
      render: (r) => (
        <div className="min-w-[180px]">
          <div className="font-medium text-slate-800">{r.user?.name || "N/A"}</div>
          <div className="text-xs text-slate-500">{r.user?.bgmiId || "-"}</div>
        </div>
      )
    },
    {
      key: "amount",
      title: "Amount",
      render: (r) => <div className="font-bold text-slate-800 whitespace-nowrap">{formatMoney(r.amount)}</div>
    },
    {
      key: "method",
      title: "Method",
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.method === "upi" ? (
            <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded text-xs font-medium whitespace-nowrap">
              UPI
            </span>
          ) : r.method === "bank" ? (
            <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded text-xs font-medium whitespace-nowrap">
              Bank
            </span>
          ) : (
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium whitespace-nowrap">{r.method || "—"}</span>
          )}
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (r) => {
        const meta = statusMeta(r.status);
        const Icon = meta.icon;
        return (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Icon className={`w-4 h-4 ${meta.iconColor}`} />
            <span className={`px-2 py-1 rounded text-xs font-medium ${meta.pill}`}>{meta.label}</span>
          </div>
        );
      }
    },
    {
      key: "requestedAt",
      title: "Requested",
      render: (r) => {
        const t = formatRequestedCell(r.requestedAt);
        return (
          <div className="whitespace-nowrap">
            <div className="text-sm text-slate-800">{t.date}</div>
            <div className="text-xs text-slate-500">{t.time}</div>
          </div>
        );
      }
    },
    {
      key: "actions",
      title: "Open",
      render: (r) => (
        <div className="flex gap-2 whitespace-nowrap">
          <Button variant="outline" size="sm" type="button" onClick={() => openRow(r)}>
            <FiEye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      )
    }
  ];

  const s = selected;
  const ad = s?.accountDetails || {};

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Withdrawal Management</h1>
          <p className="text-slate-600 mt-1">Click a row to view details and approve/reject</p>
        </div>
        <Button onClick={() => load(statusFilter)} variant="outline" className="flex items-center gap-2" type="button">
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Total Requests</div>
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <GiMoneyStack className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Pending</div>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <FiClock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Processing</div>
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Completed</div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Rejected</div>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
              <FiXCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Total Amount</div>
              <div className="text-2xl font-bold text-slate-800">{formatMoney(stats.totalAmount)}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
              <GiTakeMyMoney className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search by name, BGMI ID, method, TX, reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<FiSearch className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant={statusFilter === "all" ? "primary" : "outline"} onClick={() => setStatusFilter("all")} size="sm" type="button">
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "primary" : "outline"}
              onClick={() => setStatusFilter("pending")}
              size="sm"
              className="border-amber-300 text-amber-600 hover:border-amber-400"
              type="button"
            >
              <FiClock className="w-4 h-4 mr-1" />
              Pending
            </Button>
            <Button
              variant={statusFilter === "processing" ? "primary" : "outline"}
              onClick={() => setStatusFilter("processing")}
              size="sm"
              className="border-blue-300 text-blue-600 hover:border-blue-400"
              type="button"
            >
              <FiClock className="w-4 h-4 mr-1" />
              Processing
            </Button>
            <Button
              variant={statusFilter === "completed" ? "primary" : "outline"}
              onClick={() => setStatusFilter("completed")}
              size="sm"
              className="border-green-300 text-green-600 hover:border-green-400"
              type="button"
            >
              <FiCheckCircle className="w-4 h-4 mr-1" />
              Completed
            </Button>
            <Button
              variant={statusFilter === "rejected" ? "primary" : "outline"}
              onClick={() => setStatusFilter("rejected")}
              size="sm"
              className="border-red-300 text-red-600 hover:border-red-400"
              type="button"
            >
              <FiXCircle className="w-4 h-4 mr-1" />
              Rejected
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800">Withdrawal Requests</h3>
            <p className="text-sm text-slate-600">
              Showing {filteredRows.length} of {rows.length} requests
            </p>
          </div>

          <Button variant="outline" className="flex items-center gap-2" type="button" onClick={exportCsv}>
            <FiDownload className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="h-8 w-8 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto mb-4"></div>
            <div className="text-slate-700 font-medium">Loading withdrawals...</div>
          </div>
        ) : filteredRows.length > 0 ? (
          <div>
            {/* Optional: row click to open modal */}
            <Table
              columns={columns}
              rows={filteredRows}
              onRowClick={(r) => openRow(r)}
            />
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
              <FiDollarSign className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Withdrawals Found</h3>
            <p className="text-slate-600">{search || statusFilter !== "all" ? "Try adjusting your search or filters" : "No withdrawal requests yet"}</p>
          </div>
        )}
      </Card>

      {/* Modal */}
      {open && selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-lg font-bold text-slate-900">Withdrawal Details</div>
                  <div className="text-xs text-slate-500 truncate">ID: {selected._id}</div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-slate-100"
                  title="Close"
                >
                  <FiX className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="p-5 space-y-6 max-h-[75vh] overflow-auto">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-sm font-semibold text-slate-900 mb-2">User</div>
                    {kv("Name", selected.user?.name)}
                    {kv("BGMI ID", selected.user?.bgmiId)}
                    {kv("Email", selected.user?.email)}
                    {kv("Phone", selected.user?.phone)}
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-sm font-semibold text-slate-900 mb-2">Request</div>
                    {kv("Amount", formatMoney(selected.amount))}
                    {kv("Method", selected.method)}
                    {kv("Status", selected.status)}
                    {kv("Requested At", selected.requestedAt ? new Date(selected.requestedAt).toLocaleString("en-IN") : "—")}
                    {kv("Processed At", selected.processedAt ? new Date(selected.processedAt).toLocaleString("en-IN") : "—")}
                  </div>
                </div>

                {/* Account Details */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-sm font-semibold text-slate-900 mb-2">Payout Details</div>

                  {selected.method === "upi" ? (
                    <>
                      {kv("UPI ID", ad.upiId)}
                    </>
                  ) : selected.method === "bank" ? (
                    <>
                      {kv("Account Holder", ad.accountHolderName)}
                      {kv("Account Number", ad.accountNumber)}
                      {kv("IFSC", ad.ifscCode)}
                      {kv("Bank Name", ad.bankName)}
                    </>
                  ) : (
                    <div className="text-sm text-slate-600">No payout details available.</div>
                  )}

                  {ad && Object.keys(ad).length > 0 ? null : (
                    <div className="mt-2 text-xs text-amber-700">
                      Warning: accountDetails not present in response. Ensure backend admin withdrawals API returns `accountDetails`.
                    </div>
                  )}
                </div>

                {/* Existing result */}
                {(selected.transactionId || selected.rejectionReason) && (
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-sm font-semibold text-slate-900 mb-2">Result</div>
                    {kv("Transaction ID", selected.transactionId)}
                    {kv("Rejection Reason", selected.rejectionReason)}
                  </div>
                )}

                {/* Actions */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-sm font-semibold text-slate-900 mb-3">Actions</div>

                  {selected.status !== "pending" ? (
                    <div className="text-sm text-slate-600">This request is already processed.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-slate-700">Approve</div>
                        <Input
                          value={txId}
                          onChange={(e) => setTxId(e.target.value)}
                          placeholder="Transaction ID (required)"
                        />
                        <Button
                          onClick={approveSelected}
                          disabled={processingId === selected._id}
                          loading={processingId === selected._id}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          type="button"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-medium text-slate-700">Reject</div>
                        <Input
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Rejection reason (required)"
                        />
                        <Button
                          onClick={rejectSelected}
                          disabled={processingId === selected._id}
                          variant="outline"
                          className="w-full border-red-300 text-red-600 hover:bg-red-50"
                          type="button"
                        >
                          <FiXCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button variant="outline" onClick={closeModal} type="button">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}