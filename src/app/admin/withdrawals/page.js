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
  FiRefreshCw
} from "react-icons/fi";
import { GiMoneyStack, GiTakeMyMoney } from "react-icons/gi";
import { toast } from "@/store/uiSlice";

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
      // Backend may return this (schema supports) but process endpoint doesn't set it
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

export default function AdminWithdrawalsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  async function load(nextStatus) {
    const st = typeof nextStatus === "string" ? nextStatus : statusFilter;

    try {
      setLoading(true);

      const qs = st !== "all" ? `?status=${encodeURIComponent(st)}` : "";
      const res = await api.adminWithdrawals(qs);

      setRows(res.data || []);
    } catch (error) {
      toast({
        title: "Error",
        message: error?.message || "Failed to load withdrawals",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filter changes, hit backend filter too (faster)
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

  async function approve(w) {
    if (!w?.walletId || !w?._id) {
      toast({ title: "Error", message: "Invalid withdrawal data (missing walletId/_id)", type: "error" });
      return;
    }

    if (!confirm(`Approve withdrawal of ${formatMoney(w.amount)} to ${w.user?.name || "User"}?`)) return;

    setProcessingId(w._id);
    try {
      const tx = prompt("Enter Transaction ID (required):");
      if (!tx) {
        toast({ title: "Error", message: "Transaction ID is required", type: "error" });
        return;
      }

      // ✅ Backend expects only completed/rejected
      await api.adminProcessWithdrawal(w.walletId, w._id, {
        status: "completed",
        transactionId: tx
      });

      await load(statusFilter);
      toast({ title: "Success", message: "Withdrawal approved successfully", type: "success" });
    } catch (error) {
      toast({ title: "Error", message: error?.message || "Failed to approve withdrawal", type: "error" });
    } finally {
      setProcessingId(null);
    }
  }

  async function reject(w) {
    if (!w?.walletId || !w?._id) {
      toast({ title: "Error", message: "Invalid withdrawal data (missing walletId/_id)", type: "error" });
      return;
    }

    if (!confirm(`Reject withdrawal of ${formatMoney(w.amount)} from ${w.user?.name || "User"}?`)) return;

    setProcessingId(w._id);
    try {
      const reason = prompt("Enter rejection reason (required):");
      if (!reason) {
        toast({ title: "Error", message: "Reason is required", type: "error" });
        return;
      }

      await api.adminProcessWithdrawal(w.walletId, w._id, {
        status: "rejected",
        rejectionReason: reason
      });

      await load(statusFilter);
      toast({ title: "Success", message: "Withdrawal rejected successfully", type: "success" });
    } catch (error) {
      toast({ title: "Error", message: error?.message || "Failed to reject withdrawal", type: "error" });
    } finally {
      setProcessingId(null);
    }
  }

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
        row.rejectionReason
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
      "rejectionReason"
    ];

    const lines = [header.join(",")].concat(
      filteredRows.map((r) => {
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
          r.rejectionReason ?? ""
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
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium whitespace-nowrap">
              {r.method || "—"}
            </span>
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
      key: "details",
      title: "Details",
      render: (r) => (
        <div className="text-xs text-slate-600 space-y-1 min-w-[200px]">
          {r.transactionId && <div title={r.transactionId}>TX: {String(r.transactionId).slice(0, 16)}...</div>}
          {r.rejectionReason && (
            <div className="text-red-600 line-clamp-2" title={r.rejectionReason}>
              Reason: {r.rejectionReason}
            </div>
          )}
        </div>
      )
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="flex gap-2 whitespace-nowrap">
          {r.status === "pending" ? (
            <>
              <Button
                onClick={() => approve(r)}
                disabled={processingId === r._id}
                loading={processingId === r._id}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                size="sm"
              >
                <FiCheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => reject(r)}
                disabled={processingId === r._id}
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <FiXCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 capitalize">{r.status || "Processed"}</span>
              <button
                type="button"
                onClick={() =>
                  alert(
                    `Withdrawal ID: ${r._id}\nWallet ID: ${r.walletId}\nUser: ${r.user?.name || "N/A"}\nBGMI ID: ${
                      r.user?.bgmiId || "—"
                    }\nStatus: ${r.status}\nAmount: ${formatMoney(r.amount)}\nMethod: ${r.method}\nRequestedAt: ${
                      r.requestedAt ? new Date(r.requestedAt).toLocaleString() : "—"
                    }\nProcessedAt: ${r.processedAt ? new Date(r.processedAt).toLocaleString() : "—"}\nTransaction ID: ${
                      r.transactionId || "N/A"
                    }\nReason: ${r.rejectionReason || "N/A"}`
                  )
                }
                className="p-1 hover:bg-slate-100 rounded"
                title="View Details"
              >
                <FiEye className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Withdrawal Management</h1>
          <p className="text-slate-600 mt-1">Manage and process user withdrawal requests</p>
        </div>
        <Button
          onClick={() => load(statusFilter)}
          variant="outline"
          className="flex items-center gap-2"
          type="button"
        >
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
            <Button
              variant={statusFilter === "all" ? "primary" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
              type="button"
            >
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
          <Table columns={columns} rows={filteredRows} />
        ) : (
          <div className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
              <FiDollarSign className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Withdrawals Found</h3>
            <p className="text-slate-600">
              {search || statusFilter !== "all" ? "Try adjusting your search or filters" : "No withdrawal requests yet"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}