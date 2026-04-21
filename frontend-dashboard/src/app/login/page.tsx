"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authApi";

export default function Login() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(".input-group", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser(formData.email, formData.password);
      // Force a full page reload to update Navbar state correctly
      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div ref={containerRef} className="w-full max-w-md glass-panel p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-slate-400 text-sm">Access AI Command Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
             <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="input-group">
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600" 
              placeholder="admin@enterprise.com" 
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input 
              required
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600" 
              placeholder="•••••••••" 
            />
          </div>

          <div className="input-group flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.rememberMe}
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0" 
              />
              Remember me
            </label>
            <a href="#" className="text-blue-400 hover:text-blue-300">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="input-group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Don't have access? <Link href="/register" className="text-blue-400 hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}