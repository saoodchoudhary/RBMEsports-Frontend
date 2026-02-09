"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { 
  FiTag, 
  FiPercent, 
  FiDollarSign, 
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiSave,
  FiX,
  FiGift,
  FiAlertCircle,
  FiShield,
  FiUser,
  FiAward,
  FiClock
} from "react-icons/fi";
import { GiPriceTag } from "react-icons/gi";
import { MdOutlineDiscount, MdSecurity } from "react-icons/md";

export default function NewCouponPage() {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: 50,
    maxUses: 100,
    maxUsesPerUser: 1,
    minOrderAmount: 0,
    expiresAt: "",
    active: true,
    applicableTournamentIds: [],
    allowedUserIds: [],
    allowedBgmiIds: []
  });

  function set(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        discountValue: Number(form.discountValue || 0),
        maxUses: form.maxUses === "" ? null : Number(form.maxUses),
        maxUsesPerUser: Number(form.maxUsesPerUser || 1),
        minOrderAmount: Number(form.minOrderAmount || 0),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        applicableTournamentIds: form.applicableTournamentIds.filter(Boolean),
        allowedUserIds: form.allowedUserIds.filter(Boolean),
        allowedBgmiIds: form.allowedBgmiIds.filter(Boolean)
      };

      await api.adminCreateCoupon(payload);
      alert("✅ Coupon created successfully!");
      window.location.href = "/admin/coupons";
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const sections = [
    { id: "basic", label: "Basic Info", icon: <FiTag className="w-4 h-4" /> },
    { id: "discount", label: "Discount", icon: <FiPercent className="w-4 h-4" /> },
    { id: "limits", label: "Usage Limits", icon: <FiUsers className="w-4 h-4" /> },
    { id: "restrictions", label: "Restrictions", icon: <MdSecurity className="w-4 h-4" /> },
    { id: "advanced", label: "Advanced", icon: <FiShield className="w-4 h-4" /> }
  ];

  const discountTypes = [
    { value: "percent", label: "Percentage Off", icon: <FiPercent className="w-4 h-4" /> },
    { value: "flat", label: "Flat Amount Off", icon: <FiDollarSign className="w-4 h-4" /> },
    { value: "free", label: "100% Free", icon: <FiGift className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Create Coupon</h1>
            <p className="text-slate-600 mt-1">Design discount codes for tournaments and users</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={save} loading={loading}>
              <FiSave className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Coupon"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className={activeSection === section.id ? "text-white" : "text-slate-500"}>
                    {section.icon}
                  </span>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </div>

            {/* Preview Card */}
            <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <GiPriceTag className="w-4 h-4 text-green-600" />
                Coupon Preview
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Code:</span>
                  <span className="font-mono font-bold text-green-700">
                    {form.code || "RBM50"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Discount:</span>
                  <span className="font-bold text-green-600">
                    {form.discountType === "percent" ? `${form.discountValue}%` :
                     form.discountType === "flat" ? `₹${form.discountValue}` :
                     "100% Free"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    form.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {form.active ? "Active" : "Inactive"}
                  </span>
                </div>
                {form.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Expires:</span>
                    <span className="text-xs font-medium">
                      {new Date(form.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3">
          <form onSubmit={save}>
            {/* Basic Info Section */}
            {activeSection === "basic" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <FiTag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
                      <p className="text-slate-600 text-sm">Set up coupon code and basic details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Coupon Code"
                      value={form.code}
                      onChange={(e) => set("code", e.target.value)}
                      placeholder="e.g., RBM50, WELCOME100"
                      required
                      helperText="Will be automatically converted to uppercase"
                      icon={<FiTag className="w-4 h-4" />}
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Status
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => set("active", true)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                            form.active
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <FiCheckCircle className={`w-4 h-4 ${form.active ? 'text-green-600' : 'text-slate-400'}`} />
                          <span className="font-medium">Active</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => set("active", false)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                            !form.active
                              ? 'bg-red-50 border-red-200 text-red-700'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <FiXCircle className={`w-4 h-4 ${!form.active ? 'text-red-600' : 'text-slate-400'}`} />
                          <span className="font-medium">Inactive</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Expiration Date
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="datetime-local"
                        className="input flex-1"
                        value={form.expiresAt}
                        onChange={(e) => set("expiresAt", e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => set("expiresAt", "")}
                        disabled={!form.expiresAt}
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      Leave empty for no expiration date
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Discount Section */}
            {activeSection === "discount" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                      <MdOutlineDiscount className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Discount Settings</h3>
                      <p className="text-slate-600 text-sm">Configure discount type and value</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {discountTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => set("discountType", type.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          form.discountType === type.value
                            ? 'border-green-500 bg-green-50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            form.discountType === type.value
                              ? 'bg-green-100 text-green-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {type.icon}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-slate-800">{type.label}</div>
                            {type.value === "free" && (
                              <div className="text-xs text-slate-500">Complete free entry</div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {form.discountType !== "free" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label={
                          form.discountType === "percent" 
                            ? "Discount Percentage" 
                            : "Discount Amount (₹)"
                        }
                        type="number"
                        value={form.discountValue}
                        onChange={(e) => set("discountValue", e.target.value)}
                        min="0"
                        max={form.discountType === "percent" ? "100" : undefined}
                        required
                        icon={form.discountType === "percent" ? 
                          <FiPercent className="w-4 h-4" /> : 
                          <FiDollarSign className="w-4 h-4" />
                        }
                        helperText={
                          form.discountType === "percent" 
                            ? "Enter percentage value (0-100)" 
                            : "Enter flat amount in rupees"
                        }
                      />
                      <Input
                        label="Minimum Order Amount (₹)"
                        type="number"
                        value={form.minOrderAmount}
                        onChange={(e) => set("minOrderAmount", e.target.value)}
                        min="0"
                        helperText="Minimum tournament fee required to use this coupon"
                      />
                    </div>
                  )}

                  {form.discountType === "free" && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FiGift className="w-6 h-6 text-green-600" />
                        <div>
                          <div className="font-semibold text-green-800">100% Free Coupon</div>
                          <div className="text-sm text-green-700">
                            This coupon will make tournament entry completely free
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Usage Limits Section */}
            {activeSection === "limits" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                      <FiUsers className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Usage Limits</h3>
                      <p className="text-slate-600 text-sm">Control how many times this coupon can be used</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Maximum Uses"
                      type="number"
                      value={form.maxUses}
                      onChange={(e) => set("maxUses", e.target.value)}
                      min="1"
                      placeholder="Leave empty for unlimited"
                      helperText="Total number of times this coupon can be used"
                    />
                    <Input
                      label="Uses Per User"
                      type="number"
                      value={form.maxUsesPerUser}
                      onChange={(e) => set("maxUsesPerUser", e.target.value)}
                      min="1"
                      helperText="Maximum uses allowed per individual user"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <FiAlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-800">Usage Guidelines</div>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                          <li>• Set maximum uses to prevent overuse</li>
                          <li>• Limit per user to ensure fair distribution</li>
                          <li>• Unlimited uses = leave maximum uses field empty</li>
                          <li>• Minimum order amount prevents misuse on small tournaments</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Restrictions Section */}
            {activeSection === "restrictions" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                      <MdSecurity className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Usage Restrictions</h3>
                      <p className="text-slate-600 text-sm">Limit coupon usage to specific users or tournaments</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Applicable Tournament IDs
                      </label>
                      <textarea
                        className="input font-mono text-sm"
                        rows={4}
                        value={JSON.stringify(form.applicableTournamentIds, null, 2)}
                        onChange={(e) => {
                          try {
                            set("applicableTournamentIds", JSON.parse(e.target.value));
                          } catch {}
                        }}
                        placeholder='["tournament_id_1", "tournament_id_2"]'
                      />
                      <div className="text-xs text-slate-500 mt-1">
                        Leave empty or [] for all tournaments
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Allowed User IDs
                      </label>
                      <textarea
                        className="input font-mono text-sm"
                        rows={4}
                        value={JSON.stringify(form.allowedUserIds, null, 2)}
                        onChange={(e) => {
                          try {
                            set("allowedUserIds", JSON.parse(e.target.value));
                          } catch {}
                        }}
                        placeholder='["user_id_1", "user_id_2"]'
                      />
                      <div className="text-xs text-slate-500 mt-1">
                        Leave empty or [] for all users
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Allowed BGMI IDs
                      </label>
                      <textarea
                        className="input font-mono text-sm"
                        rows={4}
                        value={JSON.stringify(form.allowedBgmiIds, null, 2)}
                        onChange={(e) => {
                          try {
                            set("allowedBgmiIds", JSON.parse(e.target.value));
                          } catch {}
                        }}
                        placeholder='["1234567890", "0987654321"]'
                      />
                      <div className="text-xs text-slate-500 mt-1">
                        Specific BGMI accounts allowed to use this coupon
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Advanced Section */}
            {activeSection === "advanced" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                      <FiShield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Advanced Settings</h3>
                      <p className="text-slate-600 text-sm">Additional configurations and restrictions</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-6">
                    <div className="flex items-start gap-3">
                      <FiAlertCircle className="w-5 h-5 text-slate-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-800">Advanced Restriction Notes</div>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                          <li>• Tournament-specific coupons apply only to listed tournaments</li>
                          <li>• User-specific coupons can be used only by listed users</li>
                          <li>• BGMI ID restrictions work for guest users without accounts</li>
                          <li>• Combine restrictions for maximum control</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-slate-200 rounded-xl">
                      <div className="inline-flex p-3 rounded-lg bg-blue-100 mb-3">
                        <FiUser className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="font-medium text-slate-800">User Specific</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {form.allowedUserIds.length || 0} users
                      </div>
                    </div>
                    <div className="text-center p-4 border border-slate-200 rounded-xl">
                      <div className="inline-flex p-3 rounded-lg bg-green-100 mb-3">
                        <FiAward className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="font-medium text-slate-800">Tournament Specific</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {form.applicableTournamentIds.length || 0} tournaments
                      </div>
                    </div>
                    <div className="text-center p-4 border border-slate-200 rounded-xl">
                      <div className="inline-flex p-3 rounded-lg bg-purple-100 mb-3">
                        <FiClock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="font-medium text-slate-800">Validity</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {form.expiresAt ? "Limited" : "Unlimited"}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {!form.code && <span className="text-red-500">⚠️ Coupon code is required</span>}
                  {form.code && "All fields are optional except coupon code"}
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => {
                      const sectionIndex = sections.findIndex(s => s.id === activeSection);
                      if (sectionIndex > 0) setActiveSection(sections[sectionIndex - 1].id);
                    }}
                    disabled={activeSection === "basic"}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      const sectionIndex = sections.findIndex(s => s.id === activeSection);
                      if (sectionIndex < sections.length - 1) setActiveSection(sections[sectionIndex + 1].id);
                    }}
                    disabled={activeSection === "advanced"}
                  >
                    Next
                  </Button>
                  <Button 
                    type="submit" 
                    loading={loading} 
                    disabled={!form.code}
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    <FiSave className="w-4 h-4 mr-2" />
                    {loading ? "Creating..." : "Create Coupon"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}