"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/store/authSlice";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useRouter } from "next/navigation";

function AdminBoot({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((s) => s.auth.user);
  const loading = useSelector((s) => s.auth.loading);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && user && !(user.role === "admin" || user.role === "super_admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-x-hidden">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <div className="text-slate-700 font-medium">Loading Admin Panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">
      <div className="container py-6 px-4">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />
          <div className="space-y-6 min-w-0">
            {/* Admin Header */}
            <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-slate-300 mt-1 truncate">Welcome back, {user?.name}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm text-slate-300">Role</div>
                    <div className="font-medium capitalize">{user?.role}</div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="card p-6 bg-white min-w-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return <AdminBoot>{children}</AdminBoot>;
}