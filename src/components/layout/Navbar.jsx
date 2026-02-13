"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/ui/Button";
import { fetchMe, logout } from "@/store/authSlice";
import { usePathname, useRouter } from "next/navigation";
import {
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiAward,
  FiDollarSign,
  FiShield,
  FiMenu,
  FiX,
  FiChevronDown,
  FiTarget,
  FiPlayCircle,
  FiSettings,
} from "react-icons/fi";
import { GiTrophy, GiDeathSkull, GiMachineGun } from "react-icons/gi";
import { IoGameControllerOutline } from "react-icons/io5";
import Image from "next/image";

function isActiveLink(pathname, href) {
  if (!pathname || !href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector((s) => s.auth.user);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useLockBodyScroll(mobileOpen);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isAdmin = user && (user.role === "admin" || user.role === "super_admin");

  async function onLogout() {
    await dispatch(logout());
    if (pathname?.startsWith("/admin")) router.push("/");
    router.refresh();
    setMobileOpen(false);
    setUserMenuOpen(false);
  }

  const navLinks = useMemo(() => {
    return [
      { 
        href: "/tournaments", 
        label: "Tournaments", 
        icon: <GiTrophy className="w-4 h-4" />,
        description: "BGMI Competitions"
      },
      { 
        href: "/winners", 
        label: "Winners", 
        icon: <FiAward className="w-4 h-4" />,
        description: "Hall of Fame"
      },
      // { 
      //   href: "/scrims", 
      //   label: "Scrims", 
      //   icon: <GiMachineGun className="w-4 h-4" />,
      //   description: "Practice Matches"
      // },
      ...(user
        ? [
            { 
              href: "/me", 
              label: "My Account", 
              icon: <FiUser className="w-4 h-4" />,
              description: "Profile & Stats"
            },
            { 
              href: "/wallet", 
              label: "Wallet", 
              icon: <FiDollarSign className="w-4 h-4" />,
              description: "Balance & Transactions"
            }
          ]
        : []),
      ...(isAdmin ? [{ 
        href: "/admin", 
        label: "Admin", 
        icon: <FiShield className="w-4 h-4" />,
        description: "Management"
      }] : [])
    ];
  }, [user, isAdmin]);

  const primaryCtaHref = user ? "/wallet" : "/register";
  const primaryCtaLabel = user ? "Wallet" : "Join Battle";

  return (
    <>
      <header className="sticky top-0 mb-4 z-50 w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Main Navigation Bar */}
        <div className="border-b border-gray-100 bg-white/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex h-20 items-center justify-between">
              
              {/* Logo Section - Professional Esports Branding */}
              <a href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <img 
                    src="/images/logo/rbmlogo.png" 
                    alt="RBM Esports" 
                    className="relative z-10 h-12 w-12 rounded-xl border-2 border-gray-200 object-cover transition-all duration-300 group-hover:border-blue-600"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600/10 to-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight text-gray-900">
                    RBM <span className="text-blue-600">Esports</span>
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    BGMI • Professional
                  </span>
                </div>
              </a>

              {/* Desktop Navigation - Pill Design */}
              <nav className="hidden lg:flex lg:flex-1 lg:justify-center">
                <div className="inline-flex items-center rounded-2xl bg-gray-50/80 p-1.5 shadow-inner">
                  {navLinks.map((link) => {
                    const active = isActiveLink(pathname, link.href);
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className={`
                          relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200
                          ${active 
                            ? "bg-white text-blue-700 shadow-md" 
                            : "text-gray-600 hover:bg-white/80 hover:text-gray-900"
                          }
                        `}
                      >
                        <span className={active ? "text-blue-600" : "text-gray-500"}>
                          {link.icon}
                        </span>
                        {link.label}
                        {active && (
                          <span className="absolute -bottom-1.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-blue-600" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </nav>

              {/* Right Section - User Actions */}
              <div className="flex items-center gap-3">
                
                {/* Desktop Auth/User Section */}
                <div className="hidden md:block">
                  {!user ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/login")}
                        className="flex items-center gap-2 border-2 border-gray-200 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        type="button"
                      >
                        <FiLogIn className="h-4 w-4" />
                        Login
                      </Button>
                      <Button
                        onClick={() => router.push(primaryCtaHref)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-700/30"
                        type="button"
                      >
                        {user ? <FiDollarSign className="h-4 w-4" /> : <FiTarget className="h-4 w-4" />}
                        {primaryCtaLabel}
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen((v) => !v)}
                        className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 transition-all hover:border-blue-600 hover:shadow-md"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-gray-50">
                          <FiUser className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="max-w-[120px] truncate text-sm font-bold text-gray-900">
                            {user.name}
                          </span>
                          <span className="text-xs font-medium capitalize text-gray-500">
                            {user.role === "admin" ? "Admin" : "Pro Player"}
                          </span>
                        </div>
                        <FiChevronDown className="h-4 w-4 text-gray-500" />
                      </button>

                      {/* User Dropdown Menu */}
                      {userMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setUserMenuOpen(false)}
                          />
                          <div className="absolute right-0 mt-2 w-64 z-50">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                              <div className="p-2">
                                <div className="px-3 py-2">
                                  <p className="text-xs font-medium text-gray-500">Signed in as</p>
                                  <p className="truncate text-sm font-bold text-gray-900">{user.email}</p>
                                </div>
                                <div className="my-2 h-px bg-gray-100" />
                                
                                <a
                                  href="/me"
                                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                                    isActiveLink(pathname, "/me")
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <FiUser className="h-4 w-4" />
                                  Profile Settings
                                </a>
                                
                                <a
                                  href="/wallet"
                                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                                    isActiveLink(pathname, "/wallet")
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <FiDollarSign className="h-4 w-4" />
                                  Wallet & Earnings
                                </a>

                                {isAdmin && (
                                  <a
                                    href="/admin"
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                                      isActiveLink(pathname, "/admin")
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    <FiShield className="h-4 w-4" />
                                    Admin Dashboard
                                  </a>
                                )}

                                <div className="my-2 h-px bg-gray-100" />
                                
                                <button
                                  onClick={onLogout}
                                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                                  type="button"
                                >
                                  <FiLogOut className="h-4 w-4" />
                                  Logout
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden flex h-12 w-12 items-center justify-center rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                  type="button"
                >
                  <FiMenu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer - Professional Esports Design */}
      <aside
        className={`fixed top-0 right-0 z-[60] h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-5">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo/rbmlogo.png" 
              alt="RBM Esports" 
              className="h-12 w-12 rounded-xl border-2 border-gray-200"
            />
            <div className="flex flex-col">
              <span className="text-base font-black text-gray-900">RBM Esports</span>
              <span className="text-xs text-gray-500">BGMI • Season 2025</span>
            </div>
          </div>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto px-5 py-6">
          {/* User Profile Card */}
          {user ? (
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/30 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
                  <FiUser className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900">{user.name}</h3>
                  <p className="text-xs text-gray-600 capitalize">
                    {user.role === "admin" ? "Administrator" : "Professional Player"}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/me")}
                  className="flex items-center justify-center gap-2 border-2 border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:border-blue-600 hover:text-blue-600"
                  type="button"
                >
                  <FiSettings className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  onClick={() => router.push("/wallet")}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white shadow-lg"
                  type="button"
                >
                  <FiDollarSign className="h-4 w-4" />
                  Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-2xl bg-gray-50 p-5">
              <div className="flex items-center gap-3">
                <IoGameControllerOutline className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-black text-gray-900">Join the Battle</h3>
                  <p className="text-xs text-gray-600">Compete in BGMI tournaments</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="flex items-center justify-center gap-2 border-2 border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:border-blue-600 hover:text-blue-600"
                  type="button"
                >
                  <FiLogIn className="h-4 w-4" />
                  Login
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white shadow-lg"
                  type="button"
                >
                  <FiUserPlus className="h-4 w-4" />
                  Register
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Navigation
            </p>
            {navLinks.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center justify-between rounded-xl px-4 py-3.5 transition-all
                    ${active 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      flex h-10 w-10 items-center justify-center rounded-lg
                      ${active ? "bg-white text-blue-600" : "bg-gray-100 text-gray-600"}
                    `}>
                      {link.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{link.label}</span>
                      <span className="text-xs text-gray-500">{link.description}</span>
                    </div>
                  </div>
                  {active && (
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-3">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Quick Actions
            </p>
            
            <a
              href="/scrims"
              className="flex items-center gap-4 rounded-xl border-2 border-gray-100 bg-white px-4 py-3.5 transition-all hover:border-blue-600"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <FiPlayCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Join Scrims</span>
                <span className="text-xs text-gray-500">Practice matches available</span>
              </div>
            </a>

            {user && (
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-4 rounded-xl border-2 border-gray-100 bg-white px-4 py-3.5 text-left transition-all hover:border-red-200 hover:bg-red-50"
                type="button"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                  <FiLogOut className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-red-600">Logout</span>
                  <span className="text-xs text-gray-500">End your session</span>
                </div>
              </button>
            )}
          </div>

          {/* Esports Tagline */}
          <div className="mt-10 rounded-xl bg-gray-50 p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <GiDeathSkull className="h-5 w-5 text-gray-600" />
              <p className="text-xs font-medium text-gray-600">
                BGMI Pro Circuit • Season 7
              </p>
            </div>
            <p className="mt-1 text-[10px] text-gray-500">
              Compete. Conquer. Claim Victory.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}