"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { 
  FiPlus, 
  FiSearch, 
  FiFilter,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiEye,
  FiRefreshCw,
  FiDownload,
  FiPercent,
  FiDollarSign,
  FiTag,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";
import { RiCoupon3Line } from "react-icons/ri";
import { MdOutlineLocalOffer } from "react-icons/md";
import { toast } from "@/store/uiSlice";

export default function AdminCouponsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function load() {
    setLoading(true);
    try {
      const res = await api.adminCoupons("");
      setRows(res.data || []);
    } catch (error) {
      toast({
        title: "Error Loading Coupons",
        message: error.message || "Failed to load coupons",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  async function deleteCoupon(id) {
    if (!confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) return;
    
    try {
      await api.adminDeleteCoupon(id);
      await load();
      toast({
        title: "Coupon Deleted",
        message: "Coupon has been successfully deleted",
        type: "success"
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        message: error.message || "Failed to delete coupon",
        type: "error"
      });
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      message: "Coupon code copied to clipboard",
      type: "success"
    });
  }

  const filteredRows = rows.filter(coupon => {
    // Search filter
    const matchesSearch = coupon.code.toLowerCase().includes(search.toLowerCase()) ||
                         coupon.description?.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesFilter = filter === "all" ? true : 
                         filter === "active" ? coupon.active : 
                         filter === "inactive" ? !coupon.active : 
                         filter === "used" ? coupon.usedCount > 0 : true;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: rows.length,
    active: rows.filter(c => c.active).length,
    used: rows.filter(c => c.usedCount > 0).length,
    percentage: rows.filter(c => c.discountType === "percentage").length
  };

  const columns = [
    { 
      key: "code", 
      title: "Code", 
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
            <RiCoupon3Line className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">{r.code}</div>
            {r.description && (
              <div className="text-xs text-slate-500 truncate max-w-[200px]">{r.description}</div>
            )}
          </div>
        </div>
      )
    },
    { 
      key: "discountType", 
      title: "Type", 
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.discountType === "percentage" ? (
            <>
              <FiPercent className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">Percentage</span>
            </>
          ) : (
            <>
              <FiDollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">Fixed</span>
            </>
          )}
        </div>
      )
    },
    { 
      key: "discountValue", 
      title: "Value", 
      render: (r) => (
        <div className="font-bold">
          {r.discountType === "percentage" ? `${r.discountValue}%` : `₹${r.discountValue}`}
        </div>
      )
    },
    { 
      key: "status", 
      title: "Status", 
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.active ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              <FiCheckCircle className="w-3 h-3" />
              Active
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              <FiXCircle className="w-3 h-3" />
              Inactive
            </div>
          )}
        </div>
      )
    },
    { 
      key: "usage", 
      title: "Usage", 
      render: (r) => (
        <div className="text-center">
          <div className="font-bold text-slate-800">{r.usedCount || 0}</div>
          <div className="text-xs text-slate-500">/{r.maxUses || "∞"}</div>
        </div>
      )
    },
    { 
      key: "validity", 
      title: "Validity", 
      render: (r) => {
        const now = new Date();
        const validFrom = new Date(r.validFrom);
        const validUntil = r.validUntil ? new Date(r.validUntil) : null;
        
        let status = "Valid";
        let color = "text-green-600";
        
        if (validUntil && now > validUntil) {
          status = "Expired";
          color = "text-red-600";
        } else if (now < validFrom) {
          status = "Upcoming";
          color = "text-amber-600";
        }
        
        return (
          <div className={`text-sm font-medium ${color}`}>
            {status}
          </div>
        );
      }
    },
    {
      key: "actions",
      title: "Actions",
      render: (r) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(r.code)}
            title="Copy Code"
            className="h-8 w-8 p-0"
          >
            <FiCopy className="w-4 h-4" />
          </Button>
          <a 
            href={`/admin/coupons/${r._id}`}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            title="View Details"
          >
            <FiEye className="w-4 h-4 text-slate-600" />
          </a>
          <a 
            href={`/admin/coupons/${r._id}/edit`}
            className="h-8 w-8 rounded-lg hover:bg-blue-100 flex items-center justify-center transition-colors"
            title="Edit"
          >
            <FiEdit className="w-4 h-4 text-blue-600" />
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteCoupon(r._id)}
            title="Delete"
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Coupon Management</h1>
          <p className="text-slate-600 mt-1">Create and manage discount coupons for tournaments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={load}
            loading={loading}
            className="flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            onClick={() => window.location.href = "/admin/coupons/new"}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            New Coupon
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Total Coupons</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <RiCoupon3Line className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Active</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.active}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Used</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.used}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <MdOutlineLocalOffer className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Percentage Type</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.percentage}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
              <FiPercent className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search coupons by code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<FiSearch className="w-4 h-4" />}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-700 font-medium">Filter:</div>
            <div className="flex flex-wrap gap-2">
              {["all", "active", "inactive", "used"].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterType
                      ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // Export functionality
                toast({
                  title: "Export Started",
                  message: "Preparing coupon data for export...",
                  type: "info"
                });
              }}
            >
              <FiDownload className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">All Coupons</h3>
          <p className="text-sm text-slate-600 mt-1">
            Showing {filteredRows.length} of {rows.length} coupons
          </p>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="h-12 w-12 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto mb-4"></div>
            <div className="text-slate-700 font-medium">Loading coupons...</div>
          </div>
        ) : filteredRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
              <FiTag className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No coupons found</h3>
            <p className="text-slate-600 mt-2">
              {search || filter !== "all" ? "Try changing your search or filter" : "Create your first coupon to get started"}
            </p>
            <Button
              onClick={() => window.location.href = "/admin/coupons/new"}
              className="mt-4 flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Create New Coupon
            </Button>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <RiCoupon3Line className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Coupon Tips</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>• Use percentage discounts for tournaments with varying entry fees</li>
              <li>• Set maximum uses to control how many times a coupon can be applied</li>
              <li>• Set validity dates to create time-limited promotions</li>
              <li>• Deactivate coupons instead of deleting to preserve history</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}