"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  LogOut,
  LogIn,
  Server,
  Rocket,
  AlertCircle,
  Terminal,
  Activity,
  BarChart3, // ✅ Added
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const navRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔐 Auth check
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  // 🎬 Animation
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  // ✅ UPDATED NAV ITEMS
  const navItems = [
    { name: "Overview", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Server },
    { name: "Deployments", href: "/deployments", icon: Rocket },
    { name: "Alerts", href: "/alerts", icon: AlertCircle },
    { name: "Logs", href: "/logs", icon: Terminal },
    { name: "Health", href: "/health", icon: Activity },

    // 🔥 FIXED: Metrics added
    { name: "Metrics", href: "/metrics", icon: BarChart3 },

    { name: "Bookings", href: "/bookings", icon: Calendar },
  ];

  return (
    <nav
      ref={navRef}
      className="glass-panel border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-50"
    >
      {/* 🔥 LOGO */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg">
          A
        </div>
        <Link href="/" className="text-xl font-bold tracking-tight">
          AI<span className="text-blue-400">Ops</span>
        </Link>
      </div>

      {/* 🔥 NAV LINKS */}
      <div className="flex gap-6">
        <div className="flex gap-6">
          {navItems.map((item) => {
            // ✅ FIX: better active detection
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors relative group ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}

                {/* 🔥 Active underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px bg-white/10 h-6 mx-2"></div>

        {/* 🔐 AUTH BUTTON */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            <LogIn size={18} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}