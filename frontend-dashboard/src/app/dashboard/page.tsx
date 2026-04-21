"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, logoutUser } from "@/services/authApi";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error("Not authenticated", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  if (loading) return <div className="text-white p-10">Loading secure data...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Account Dashboard</h1>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
        <h2 className="text-xl mb-4 text-blue-400">User Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-sm">Name</p>
            <p className="text-white font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Email</p>
            <p className="text-white font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">User ID</p>
            <p className="text-white font-mono text-sm">{user?.id}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Role</p>
            <p className="text-white font-medium">Administrator</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}