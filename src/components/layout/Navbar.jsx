"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/ui/Button";
import { fetchMe, logout } from "@/store/authSlice";
import { usePathname, useRouter } from "next/navigation";
import {
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiHome,
  FiAward,
  FiDollarSign,
  FiShield,
  FiMenu,
  FiX
} from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";
import { useState } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((s) => s.auth.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const isAdmin = user && (user.role === "admin" || user.role === "super_admin");

  async function onLogout() {
    await dispatch(logout());
    if (pathname.startsWith("/admin")) router.push("/");
    router.refresh();
    setMobileMenuOpen(false);
  }

  const navLinks = [
    { href: "/tournaments", label: "Tournaments", icon: <GiTrophy className="w-4 h-4" /> },
    { href: "/winners", label: "Winners", icon: <FiAward className="w-4 h-4" /> },
    ...(user ? [
      { href: "/me", label: "My Account", icon: <FiUser className="w-4 h-4" /> },
      { href: "/wallet", label: "Wallet", icon: <FiDollarSign className="w-4 h-4" /> }
    ] : []),
    ...(isAdmin ? [
      { href: "/admin", label: "Admin", icon: <FiShield className="w-4 h-4" /> }
    ] : [])
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b py-2 mb-2 bg-white/95 backdrop-blur-sm" style={{ borderColor: "var(--border)" }}>
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <GiTrophy className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RBM ESports
              </div>
              <div className="text-[11px] text-slate-600">BGMI Tournaments</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/login")}
                  className="hidden md:flex items-center gap-2"
                >
                  <FiLogIn className="w-4 h-4" />
                  Login
                </Button>
                <Button 
                  onClick={() => router.push("/register")}
                  className="hidden md:flex items-center gap-2"
                >
                  <FiUserPlus className="w-4 h-4" />
                  Register
                </Button>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-700">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  className="hidden md:flex items-center gap-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6 text-slate-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white" style={{ borderColor: "var(--border)" }}>
            <div className="container py-4 space-y-3">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}

              {/* User Info & Actions */}
              <div className="border-t pt-4 mt-4" style={{ borderColor: "var(--border)" }}>
                {!user ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        router.push("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2"
                    >
                      <FiLogIn className="w-4 h-4" />
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        router.push("/register");
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2"
                    >
                      <FiUserPlus className="w-4 h-4" />
                      Register
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={onLogout}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}