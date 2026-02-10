"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import {
  FiPlus,
  FiSearch,
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
import { toast } from "@/store/uiSlice";

function formatMoney(n) {
  if (typeof n !== "number") return "₹0";
  return `₹${n}`;
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
}

function couponValidity(c) {
  // Backend has expiresAt only (no validFrom)
  if (!c.expiresAt) return { label: "No Expiry", color: "text-slate-600" };

  const now = new Date();
  const exp = new Date(c.expiresAt);
  if (Number.isNaN(exp.getTime())) return { label: "—", color: "text-slate-600" };

  if (now > exp) return { label: "Expired", color: "text-red-600" };
  return { label: "Valid", color: "text-green-600" };
}

export default function AdminCouponsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | inactive | used | expired
  const [typeFilter, setTypeFilter] = useState("all"); // all | percent | flat | free

  async function load() {
    setLoading(true);
    try {
      // backend supports q and active; we can load all and filter client-side
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

  const filteredRows = useMemo(() => {
    const s = search.trim().toLowerCase();

    return rows.filter((c) => {
      // search (backend only has code; no description in schema)
      const matchesSearch = !s ? true : (c.code || "").toLowerCase().includes(s);

      // type filter
      const matchesType = typeFilter === "all" ? true : c.discountType === typeFilter;

      // status filter
      const validity = couponValidity(c);
      const isExpired = validity.label === "Expired";

      const matchesStatus =
        filter === "all" ? true :
        filter === "active" ? !!c.active :
        filter === "inactive" ? !c.active :
        filter === "used" ? (c.usedCount || 0) > 0 :
        filter === "expired" ? isExpired :
        true;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rows, search, filter, typeFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const expired = rows.filter((c) => c.expiresAt && new Date(c.expiresAt) < now).length;

    return {
      total: rows.length,
      active: rows.filter((c) => c.active).length,
      used: rows.filter((c) => (c.usedCount || 0) > 0).length,
      expired,
      percent: rows.filter((c) => c.discountType === "percent").length,
      flat: rows.filter((c) => c.discountType === "flat").length,
      free: rows.filter((c) => c.discountType === "free").length
    };
  }, [rows]);

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
            <div className="text-xs text-slate-500">
              Min: {formatMoney(r.minOrderAmount || 0)} • MaxUses: {r.maxUses === null ? "∞" : (r.maxUses ?? "—")}
            </div>
          </div>
        </div>
      )
    },
    {
      key: "discountType",
      title: "Type",
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.discountType === "percent" ? (
            <>
              <FiPercent className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">Percent</span>
            </>
          ) : r.discountType === "flat" ? (
            <>
              <FiDollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">Flat</span>
            </>
          ) : (
            <>
              <FiTag className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium">Free</span>
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
          {r.discountType === "percent"
            ? `${r.discountValue || 0}%`
            : r.discountType === "flat"
              ? formatMoney(r.discountValue || 0)
              : formatMoney(0)}
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
          <div className="text-xs text-slate-500">/{r.maxUses === null ? "∞" : (r.maxUses ?? "—")}</div>
          <div className="text-[11px] text-slate-500 mt-1">PerUser: {r.maxUsesPerUser ?? 1}</div>
        </div>
      )
    },
    {
      key: "expiresAt",
      title: "Validity",
      render: (r) => {
        const v = couponValidity(r);
        return (
          <div>
            <div className={`text-sm font-medium ${v.color}`}>{v.label}</div>
            <div className="text-xs text-slate-500">Exp: {formatDate(r.expiresAt)}</div>
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
            title="View"
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
          <p className="text-slate-600 mt-1">BGMI tournaments ke liye discount coupons manage karo</p>
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
            onClick={() => (window.location.href = "/admin/coupons/new")}
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
              <div className="text-sm text-slate-600">Total</div>
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
              <FiTag className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Expired</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{stats.expired}</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
              <FiXCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by coupon code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<FiSearch className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm text-slate-700 font-medium">Status:</div>
            <div className="flex flex-wrap gap-2">
              {["all", "active", "inactive", "used", "expired"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === t
                      ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="text-sm text-slate-700 font-medium ml-0 md:ml-2">Type:</div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm"
            >
              <option value="all">All</option>
              <option value="percent">Percent</option>
              <option value="flat">Flat</option>
              <option value="free">Free</option>
            </select>

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // simple CSV export (client-side)
                const header = ["code","discountType","discountValue","active","usedCount","maxUses","maxUsesPerUser","minOrderAmount","expiresAt","createdAt"];
                const lines = [header.join(",")].concat(
                  filteredRows.map((c) => ([
                    c.code,
                    c.discountType,
                    c.discountValue,
                    c.active,
                    c.usedCount || 0,
                    c.maxUses === null ? "" : (c.maxUses ?? ""),
                    c.maxUsesPerUser ?? "",
                    c.minOrderAmount ?? "",
                    c.expiresAt ? new Date(c.expiresAt).toISOString() : "",
                    c.createdAt ? new Date(c.createdAt).toISOString() : ""
                  ].map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")))
                );

                const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `coupons_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);

                toast({
                  title: "Export Ready",
                  message: "CSV downloaded",
                  type: "success"
                });
              }}
            >
              <FiDownload className="w-4 h-4" />
              Export CSV
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
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      {c.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                    {columns.map((c) => (
                      <td key={c.key} className="px-6 py-4 whitespace-nowrap">
                        {c.render ? c.render(row) : row[c.key]}
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
              {search || filter !== "all" || typeFilter !== "all"
                ? "Try changing your search / filters"
                : "Create your first coupon to get started"}
            </p>
            <Button
              onClick={() => (window.location.href = "/admin/coupons/new")}
              className="mt-4 flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Create New Coupon
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}