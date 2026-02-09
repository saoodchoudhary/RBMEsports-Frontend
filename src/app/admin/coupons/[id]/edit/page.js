"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  FiTag,
  FiPercent,
  FiDollarSign,
  FiUsers,
  FiSave,
  FiX,
  FiCheck,
  FiClock,
  FiEdit2,
  FiEye,
  FiActivity,
  FiTrendingUp,
  FiInfo,
  FiAlertCircle,
  FiRefreshCw
} from "react-icons/fi";
import { MdOutlineDiscount, MdOutlineHistory } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";

export default function EditCouponPage({ params }) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [couponStats, setCouponStats] = useState(null);

  function set(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  useEffect(() => {
    async function loadCoupon() {
      try {
        setLoading(true);
        const res = await api.adminCoupons("");
        const coupon = (res.data || []).find((x) => x._id === id);
        
        if (coupon) {
          setForm(coupon);
          // Calculate some stats
          setCouponStats({
            remainingUses: coupon.maxUses ? coupon.maxUses - (coupon.usedCount || 0) : 'Unlimited',
            usagePercentage: coupon.maxUses ? Math.round(((coupon.usedCount || 0) / coupon.maxUses) * 100) : 0,
            isExpired: coupon.expiresAt ? new Date(coupon.expiresAt) < new Date() : false,
            daysLeft: coupon.expiresAt ? Math.ceil((new Date(coupon.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)) : null
          });
        }
      } catch (error) {
        console.error("Failed to load coupon:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCoupon();
  }, [id]);

  async function save(e) {
    e.preventDefault();
    if (!form) return;
    
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue || 0),
        maxUses: form.maxUses === "" ? null : (form.maxUses === null ? null : Number(form.maxUses)),
        maxUsesPerUser: Number(form.maxUsesPerUser || 1),
        minOrderAmount: Number(form.minOrderAmount || 0)
      };
      
      await api.adminUpdateCoupon(id, payload);
      alert("✅ Coupon updated successfully!");
      window.location.href = "/admin/coupons";
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  // Format discount display
  const getDiscountDisplay = () => {
    if (!form) return "";
    if (form.discountType === "free") return "100% OFF (FREE)";
    if (form.discountType === "percent") return `${form.discountValue}% OFF`;
    return `₹${form.discountValue} OFF`;
  };

  // Calculate expiry status
  const getExpiryStatus = () => {
    if (!form?.expiresAt) return "No expiry";
    const expiryDate = new Date(form.expiresAt);
    const now = new Date();
    if (expiryDate < now) return "Expired";
    
    const diffTime = Math.abs(expiryDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Expires tomorrow";
    return `Expires in ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <div className="text-slate-700 font-medium">Loading coupon details...</div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="card p-8 text-center">
        <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Coupon Not Found</h3>
        <p className="text-slate-600 mt-2">The coupon you're trying to edit doesn't exist.</p>
        <Button className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Coupon</h1>
            <p className="text-slate-600 mt-1">Update coupon details and settings</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={save} loading={saving}>
              <FiSave className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Coupon Info & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Coupon Preview Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <RiCoupon3Line className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-lg">{form.code}</div>
                <div className="text-sm text-slate-600">Coupon Code</div>
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 mb-4">
              <div className="text-2xl font-bold text-green-600 mb-1">{getDiscountDisplay()}</div>
              <div className="text-sm text-green-700">
                {form.minOrderAmount > 0 ? `Min. order: ₹${form.minOrderAmount}` : "No minimum order"}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiActivity className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">Status</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  form.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {form.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">Expiry</span>
                </div>
                <span className={`text-xs font-medium ${
                  couponStats?.isExpired ? 'text-red-600' : 'text-green-600'
                }`}>
                  {getExpiryStatus()}
                </span>
              </div>

              {form.expiresAt && (
                <div className="text-xs text-center text-slate-500">
                  {new Date(form.expiresAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          </Card>

          {/* Usage Statistics Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Usage Statistics</h3>
                <div className="text-sm text-slate-600">Current coupon usage</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Used Count</span>
                  <span className="font-bold text-slate-800">{form.usedCount || 0}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ 
                      width: `${couponStats?.usagePercentage || 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Max Uses</div>
                  <div className="text-lg font-bold text-slate-800">
                    {form.maxUses || "∞"}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Remaining</div>
                  <div className="text-lg font-bold text-slate-800">
                    {couponStats?.remainingUses || "∞"}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineHistory className="w-4 h-4 text-slate-600" />
                  <div className="text-sm font-medium text-slate-700">Created At</div>
                </div>
                <div className="text-sm text-slate-600">
                  {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FiEye className="w-4 h-4 mr-2" />
                View Usage History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Reset Used Count
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <FiX className="w-4 h-4 mr-2" />
                Deactivate Coupon
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                <FiEdit2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Edit Coupon Details</h3>
                <p className="text-slate-600 text-sm">Update coupon configuration</p>
              </div>
            </div>

            <form onSubmit={save} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Basic Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Coupon Code"
                    value={form.code}
                    onChange={(e) => set("code", e.target.value)}
                    required
                    icon={<FiTag className="w-4 h-4" />}
                    helperText="Unique identifier for the coupon"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Discount Type
                    </label>
                    <select 
                      className="input"
                      value={form.discountType}
                      onChange={(e) => set("discountType", e.target.value)}
                    >
                      <option value="percent">Percentage Off</option>
                      <option value="flat">Flat Amount Off</option>
                      <option value="free">Free (100% Off)</option>
                    </select>
                  </div>
                  
                  <Input
                    label="Discount Value"
                    value={form.discountValue}
                    onChange={(e) => set("discountValue", e.target.value)}
                    disabled={form.discountType === "free"}
                    type="number"
                    min="0"
                    max={form.discountType === "percent" ? "100" : undefined}
                    icon={form.discountType === "percent" ? <FiPercent className="w-4 h-4" /> : <FiDollarSign className="w-4 h-4" />}
                    helperText={form.discountType === "percent" ? "Percentage (0-100)" : "Flat amount in ₹"}
                  />
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center gap-2">
                    <FiInfo className="w-4 h-4 text-blue-600" />
                    <div className="text-sm text-blue-700">
                      Current discount: {getDiscountDisplay()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Limits */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Usage Limits</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Maximum Uses"
                    value={form.maxUses ?? ""}
                    onChange={(e) => set("maxUses", e.target.value)}
                    placeholder="Leave blank for unlimited"
                    type="number"
                    min="1"
                    icon={<FiUsers className="w-4 h-4" />}
                    helperText="Total number of allowed uses"
                  />
                  
                  <Input
                    label="Uses Per User"
                    value={form.maxUsesPerUser}
                    onChange={(e) => set("maxUsesPerUser", e.target.value)}
                    type="number"
                    min="1"
                    icon={<FiUsers className="w-4 h-4" />}
                    helperText="Maximum uses per user"
                  />
                  
                  <Input
                    label="Minimum Order Amount (₹)"
                    value={form.minOrderAmount}
                    onChange={(e) => set("minOrderAmount", e.target.value)}
                    type="number"
                    min="0"
                    icon={<FiDollarSign className="w-4 h-4" />}
                    helperText="Minimum purchase required"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Expiry Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={form.expiresAt ? new Date(form.expiresAt).toISOString().slice(0, 16) : ""}
                      onChange={(e) => set("expiresAt", e.target.value)}
                    />
                    <div className="text-xs text-slate-500 mt-1">
                      Leave empty for no expiry
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={!!form.active}
                        onChange={(e) => set("active", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      <label htmlFor="active" className="text-sm font-medium text-slate-700">
                        Active Coupon
                      </label>
                    </div>
                    {form.active && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <FiCheck className="w-3 h-3" />
                        Enabled
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Additional Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Created At
                    </label>
                    <input
                      type="text"
                      className="input bg-slate-50"
                      value={form.createdAt ? new Date(form.createdAt).toLocaleString() : "N/A"}
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Last Updated
                    </label>
                    <input
                      type="text"
                      className="input bg-slate-50"
                      value={form.updatedAt ? new Date(form.updatedAt).toLocaleString() : "N/A"}
                      disabled
                    />
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <MdOutlineDiscount className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-amber-800">Usage Summary</div>
                      <div className="text-amber-700 mt-1">
                        This coupon has been used {form.usedCount || 0} times. 
                        {form.maxUses ? ` ${couponStats?.remainingUses} uses remaining.` : " Unlimited uses available."}
                        {couponStats?.daysLeft && couponStats.daysLeft > 0 && ` Expires in ${couponStats.daysLeft} days.`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        // Reset form to original values
                        window.location.reload();
                      }}
                    >
                      Reset
                    </Button>
                    <Button 
                      type="submit" 
                      loading={saving}
                      className="bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}