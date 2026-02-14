// components/layout/AdminSidebar.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiAward,
  FiTag,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiEye,
  FiTrendingUp,
  FiAlertCircle
} from "react-icons/fi";
import { 
  GiTrophy,
  GiRank3,
  GiTeamIdea,
  GiCrossedSwords
} from "react-icons/gi";
import { MdOutlineDashboard, MdOutlineSecurity } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <MdOutlineDashboard className="w-5 h-5" />,
      badge: null
    },
    {
      title: "Tournaments",
      href: "/admin/tournaments",
      icon: <GiTrophy className="w-5 h-5" />,
      badge: "12"
    },
    {
      title: "Coupons",
      href: "/admin/coupons",
      icon: <RiCoupon3Line className="w-5 h-5" />,
      badge: "5"
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <FiUsers className="w-5 h-5" />,
      badge: "248"
    },
    {
      title: "Withdrawals",
      href: "/admin/withdrawals",
      icon: <FiDollarSign className="w-5 h-5" />,
      badge: "8"
    },
    {
      title: "Payments Verification",
      href: "/admin/manual-payments",
      icon: <FiEye className="w-5 h-5" />,
      badge: "3"

    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <FiBarChart2 className="w-5 h-5" />,
      badge: null
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: <FiTrendingUp className="w-5 h-5" />,
      badge: null
    },
    {
      title: "Security",
      href: "/admin/security",
      icon: <MdOutlineSecurity className="w-5 h-5" />,
      badge: null
    }
  ];

  const quickStats = [
    { label: "Live Tournaments", value: "4", change: "+2" },
    { label: "Pending Withdrawals", value: "8", change: "+3" },
    { label: "New Users", value: "24", change: "+12" },
  ];

  return (
    <div className={`card overflow-hidden p-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-full'}`}>
      {/* Sidebar Header */}
      <div className="border-b border-slate-200 p-6">
        <div className={`flex items-center justify-between ${collapsed ? 'flex-col gap-4' : ''}`}>
          <div className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`}>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <FiShield className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <div className="font-bold text-slate-800">RBM ESports</div>
                <div className="text-xs text-slate-600">Admin Panel</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            {collapsed ? (
              <FiChevronRight className="w-4 h-4 text-slate-600" />
            ) : (
              <FiChevronLeft className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-200">
          <div className="space-y-3">
            {quickStats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">{stat.label}</div>
                  <div className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${idx === 0 ? 'bg-green-100 text-green-800' : idx === 1 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center ${collapsed ? 'justify-center' : 'justify-between'} 
                  gap-3 p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md' 
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </div>
                
                {!collapsed && item.badge && (
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold
                    ${isActive 
                      ? 'bg-white text-slate-900' 
                      : 'bg-slate-200 text-slate-700'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      {!collapsed && (
        <>
          <div className="p-4 border-t border-slate-200">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-slate-800">System Status</div>
                  <div className="text-xs text-slate-600 mt-1">All systems operational</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200">
            <button className="flex items-center gap-3 w-full p-3 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}