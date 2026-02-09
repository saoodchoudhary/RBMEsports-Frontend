"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import {
  FiDollarSign,
  FiFilter,
  FiSearch,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiRefreshCw
} from "react-icons/fi";
import {
  GiMoneyStack,
  GiTakeMyMoney
} from "react-icons/gi";
import { toast } from "@/store/uiSlice";

export default function AdminWithdrawalsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    rejected: 0,
    totalAmount: 0
  });

  async function load() {
    try {
      setLoading(true);
      const res = await api.adminWithdrawals("");
      setRows(res.data || []);
      updateStats(res.data || []);
    } catch (error) {
      toast({ 
        title: "Error", 
        message: "Failed to load withdrawals",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  function updateStats(data) {
    const stats = {
      total: data.length,
      pending: data.filter(w => w.status === "pending").length,
      completed: data.filter(w => w.status === "completed").length,
      rejected: data.filter(w => w.status === "rejected").length,
      totalAmount: data.reduce((sum, w) => sum + w.amount, 0)
    };
    setStats(stats);
  }

  useEffect(() => { 
    load(); 
  }, []);

  async function approve(w) {
    if (!confirm(`Approve withdrawal of ₹${w.amount} to ${w.user?.name}?`)) return;
    
    setProcessingId(w._id);
    try {
      const tx = prompt("Enter Transaction ID (required):");
      if (!tx) {
        toast({ 
          title: "Error", 
          message: "Transaction ID is required",
          type: "error"
        });
        return;
      }
      
      await api.adminProcessWithdrawal(w.walletId, w._id, { 
        status: "completed", 
        transactionId: tx 
      });
      
      await load();
      toast({ 
        title: "Success", 
        message: "Withdrawal approved successfully"
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        message: error.message || "Failed to approve withdrawal",
        type: "error"
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function reject(w) {
    if (!confirm(`Reject withdrawal of ₹${w.amount} from ${w.user?.name}?`)) return;
    
    setProcessingId(w._id);
    try {
      const reason = prompt("Enter rejection reason:");
      if (!reason) {
        toast({ 
          title: "Error", 
          message: "Reason is required",
          type: "error"
        });
        return;
      }
      
      await api.adminProcessWithdrawal(w.walletId, w._id, { 
        status: "rejected", 
        rejectionReason: reason 
      });
      
      await load();
      toast({ 
        title: "Success", 
        message: "Withdrawal rejected successfully"
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        message: error.message || "Failed to reject withdrawal",
        type: "error"
      });
    } finally {
      setProcessingId(null);
    }
  }

  // Filter withdrawals based on search and status
  const filteredRows = rows.filter(row => {
    const matchesSearch = search === "" || 
      row.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      row.user?.bgmiId?.toLowerCase().includes(search.toLowerCase()) ||
      row.method?.toLowerCase().includes(search.toLowerCase()) ||
      row.transactionId?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || row.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      key: "user", 
      title: "User", 
      render: (r) => (
        <div>
          <div className="font-medium text-slate-800">{r.user?.name || "N/A"}</div>
          <div className="text-xs text-slate-500">{r.user?.bgmiId || "-"}</div>
        </div>
      ) 
    },
    { 
      key: "amount", 
      title: "Amount", 
      render: (r) => (
        <div className="font-bold text-slate-800">
          ₹{r.amount.toLocaleString()}
        </div>
      ) 
    },
    { 
      key: "method", 
      title: "Method", 
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.method === "upi" ? (
            <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded text-xs font-medium">
              UPI
            </span>
          ) : r.method === "bank" ? (
            <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded text-xs font-medium">
              Bank
            </span>
          ) : (
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
              {r.method}
            </span>
          )}
        </div>
      ) 
    },
    { 
      key: "status", 
      title: "Status", 
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.status === "pending" ? (
            <>
              <FiClock className="w-4 h-4 text-amber-500" />
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                Pending
              </span>
            </>
          ) : r.status === "completed" ? (
            <>
              <FiCheckCircle className="w-4 h-4 text-green-500" />
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                Completed
              </span>
            </>
          ) : r.status === "rejected" ? (
            <>
              <FiXCircle className="w-4 h-4 text-red-500" />
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                Rejected
              </span>
            </>
          ) : (
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
              {r.status}
            </span>
          )}
        </div>
      ) 
    },
    { 
      key: "requestedAt", 
      title: "Requested", 
      render: (r) => (
        <div>
          <div className="text-sm text-slate-800">
            {new Date(r.requestedAt).toLocaleDateString()}
          </div>
          <div className="text-xs text-slate-500">
            {new Date(r.requestedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      ) 
    },
    { 
      key: "details", 
      title: "Details", 
      render: (r) => (
        <div className="text-xs text-slate-600 space-y-1">
          {r.transactionId && (
            <div>TX: {r.transactionId.substring(0, 8)}...</div>
          )}
          {r.rejectionReason && (
            <div className="text-red-600">Reason: {r.rejectionReason}</div>
          )}
        </div>
      ) 
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="flex gap-2">
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
              <span className="text-sm text-slate-600">Processed</span>
              <button
                onClick={() => alert(`Transaction ID: ${r.transactionId || 'N/A'}\nStatus: ${r.status}\nAmount: ₹${r.amount}`)}
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Withdrawal Management</h1>
          <p className="text-slate-600 mt-1">Manage and process user withdrawal requests</p>
        </div>
        <Button
          onClick={load}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <div className="text-2xl font-bold text-slate-800">₹{stats.totalAmount.toLocaleString()}</div>
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
          <div className="flex-1">
            <Input
              placeholder="Search by name, BGMI ID, method..."
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
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "primary" : "outline"}
              onClick={() => setStatusFilter("pending")}
              size="sm"
              className="border-amber-300 text-amber-600 hover:border-amber-400"
            >
              <FiClock className="w-4 h-4 mr-1" />
              Pending ({stats.pending})
            </Button>
            <Button
              variant={statusFilter === "completed" ? "primary" : "outline"}
              onClick={() => setStatusFilter("completed")}
              size="sm"
              className="border-green-300 text-green-600 hover:border-green-400"
            >
              <FiCheckCircle className="w-4 h-4 mr-1" />
              Completed
            </Button>
            <Button
              variant={statusFilter === "rejected" ? "primary" : "outline"}
              onClick={() => setStatusFilter("rejected")}
              size="sm"
              className="border-red-300 text-red-600 hover:border-red-400"
            >
              <FiXCircle className="w-4 h-4 mr-1" />
              Rejected
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">Withdrawal Requests</h3>
            <p className="text-sm text-slate-600">
              Showing {filteredRows.length} of {rows.length} requests
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
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
          <div className="overflow-x-auto">
            <Table columns={columns} rows={filteredRows} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
              <FiDollarSign className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Withdrawals Found</h3>
            <p className="text-slate-600">
              {search || statusFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "No withdrawal requests yet"}
            </p>
          </div>
        )}
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-semibold text-slate-800 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <div className="text-sm text-slate-600">
              • Process pending requests within 24 hours
            </div>
            <div className="text-sm text-slate-600">
              • Verify UPI/Bank details before approval
            </div>
            <div className="text-sm text-slate-600">
              • Add transaction ID for completed withdrawals
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h4 className="font-semibold text-slate-800 mb-3">Processing Guidelines</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FiCheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-600">Approve only after successful transfer</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiXCircle className="w-4 h-4 text-red-500" />
              <span className="text-slate-600">Reject if details are invalid</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiClock className="w-4 h-4 text-amber-500" />
              <span className="text-slate-600">Keep transaction records for 6 months</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}