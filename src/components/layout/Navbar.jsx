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
  FiChevronDown
} from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";

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
    // close menus on route change
    setMobileOpen(false);
    setUserMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      { href: "/tournaments", label: "Tournaments", icon: <GiTrophy className="w-4 h-4" /> },
      { href: "/winners", label: "Winners", icon: <FiAward className="w-4 h-4" /> },
      ...(user
        ? [
            { href: "/me", label: "My Account", icon: <FiUser className="w-4 h-4" /> },
            { href: "/wallet", label: "Wallet", icon: <FiDollarSign className="w-4 h-4" /> }
          ]
        : []),
      ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: <FiShield className="w-4 h-4" /> }] : [])
    ];
  }, [user, isAdmin]);

  const primaryCtaHref = user ? "/wallet" : "/register";
  const primaryCtaLabel = user ? "Wallet" : "Get Started";

  return (
    <>
      <header className="sticky mb-4 top-0 z-50">
        {/* top glass bar */}
        <div
          className="border-b bg-white/70 backdrop-blur-xl"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="container h-16 flex items-center justify-between gap-3">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
                <GiTrophy className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RBM ESports
                </div>
                <div className="text-[11px] text-slate-600">BGMI Tournaments</div>
              </div>
            </a>

            {/* Center pill nav (desktop) */}
            <nav className="hidden lg:flex items-center justify-center flex-1">
              <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/70 px-2 py-2 shadow-sm">
                {navLinks.map((link) => {
                  const active = isActiveLink(pathname, link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`relative px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
                        active
                          ? "text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                      {active && (
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                      )}
                    </a>
                  );
                })}
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Desktop quick links (md) */}
              <div className="hidden md:flex items-center gap-2">
                {!user ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/login")}
                      className="hidden md:flex items-center gap-2"
                      type="button"
                    >
                      <FiLogIn className="w-4 h-4" />
                      Login
                    </Button>
                    <Button
                      onClick={() => router.push(primaryCtaHref)}
                      className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      type="button"
                    >
                      <FiUserPlus className="w-4 h-4" />
                      {primaryCtaLabel}
                    </Button>
                  </>
                ) : (
                  <>
                    {/* user dropdown */}
                    <div className="relative hidden md:block">
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen((v) => !v)}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 hover:bg-white transition"
                        aria-label="Open user menu"
                      >
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-blue-700" />
                        </div>
                        <div className="text-left leading-tight">
                          <div className="text-sm font-semibold text-slate-900 max-w-[140px] truncate">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-slate-500 capitalize">{user.role}</div>
                        </div>
                        <FiChevronDown className="w-4 h-4 text-slate-600" />
                      </button>

                      {userMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setUserMenuOpen(false)}
                          />
                          <div className="absolute right-0 mt-2 z-50 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                            <div className="p-2">
                              <a
                                href="/me"
                                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                  isActiveLink(pathname, "/me")
                                    ? "bg-blue-50 text-blue-700"
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <FiUser className="w-4 h-4" />
                                My Account
                              </a>

                              <a
                                href="/wallet"
                                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                  isActiveLink(pathname, "/wallet")
                                    ? "bg-blue-50 text-blue-700"
                                    : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <FiDollarSign className="w-4 h-4" />
                                Wallet
                              </a>

                              {isAdmin && (
                                <a
                                  href="/admin"
                                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                    isActiveLink(pathname, "/admin")
                                      ? "bg-blue-50 text-blue-700"
                                      : "hover:bg-slate-50 text-slate-700"
                                  }`}
                                >
                                  <FiShield className="w-4 h-4" />
                                  Admin
                                </a>
                              )}

                              <div className="my-2 h-px bg-slate-100" />

                              <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 transition"
                                type="button"
                              >
                                <FiLogOut className="w-4 h-4" />
                                Logout
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Mobile toggle */}
              <button
                className="lg:hidden p-2 rounded-2xl border border-slate-200 bg-white/70 hover:bg-white transition"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                type="button"
              >
                <FiMenu className="w-6 h-6 text-slate-800" />
              </button>
            </div>
          </div>
        </div>

      
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 right-0 z-[60] h-full w-[86%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="h-16 px-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <GiTrophy className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-slate-900">RBM ESports</div>
              <div className="text-[11px] text-slate-600">Menu</div>
            </div>
          </div>

          <button
            className="p-2 rounded-xl hover:bg-slate-100"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            type="button"
          >
            <FiX className="w-6 h-6 text-slate-800" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* user card */}
          {user ? (
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center border border-slate-200">
                  <FiUser className="w-5 h-5 text-blue-700" />
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 truncate">{user.name}</div>
                  <div className="text-xs text-slate-600 capitalize">{user.role}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  onClick={() => router.push("/me")}
                  type="button"
                >
                  Account
                </button>
                <button
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700"
                  onClick={() => router.push("/wallet")}
                  type="button"
                >
                  Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-extrabold text-slate-900">Welcome</div>
              <div className="text-xs text-slate-600 mt-1">
                Login/register to join paid tournaments and manage wallet.
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => router.push("/login")} type="button">
                  Login
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  type="button"
                >
                  Register
                </Button>
              </div>
            </div>
          )}

          {/* nav list */}
          <div className="space-y-2">
            {navLinks.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      active ? "bg-white" : "bg-slate-50"
                    }`}>
                      {link.icon}
                    </span>
                    {link.label}
                  </span>
                  <span className={`h-2 w-2 rounded-full ${active ? "bg-blue-600" : "bg-slate-300"}`} />
                </a>
              );
            })}
          </div>

          {/* bottom actions */}
          {user ? (
            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2"
              type="button"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/tournaments")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              type="button"
            >
              Join Tournament
            </Button>
          )}

          <div className="text-[11px] text-slate-500 pt-2">
            Tip: Tap outside the drawer or press <span className="font-semibold">Esc</span> to close.
          </div>
        </div>
      </aside>
    </>
  );
}