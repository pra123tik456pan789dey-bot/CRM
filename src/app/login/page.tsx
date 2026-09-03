"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-md shadow-indigo-500/20">
            A
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">ApexCRM</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in to your business workspace</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center">{error}</div>}
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Work Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@company.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none" 
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none" 
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/30 mt-2"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-500 pt-6 border-t border-gray-100">
          <span>Need a new CRM account for your company? </span>
          <Link href="/register" className="font-bold text-indigo-600 hover:underline block mt-1">
            Register New Company →
          </Link>
        </div>
      </div>
    </div>
  );
}
