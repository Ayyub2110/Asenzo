"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, loginAsDemo, isSupabaseConnected } = useAuth();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Please enter your work email or username.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setErrorMsg(result.error || "Invalid credentials. Please try again.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Please enter your work email or username.");
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    setIsSubmitting(true);
    const result = await register(email, password, fullName, companyName);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg("Account registered successfully! Logging you in...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 500);
    } else {
      setErrorMsg(result.error || "Failed to create account. Please check your credentials.");
    }
  };

  const handleQuickDemo = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    await loginAsDemo();
    setIsSubmitting(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#08090B] text-[#F8FAFC] relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Gradient Illumination */}
      <div className="absolute -top-[250px] -left-[250px] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-[250px] -right-[250px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Glass Card Container */}
      <div className="relative z-10 w-full max-w-[440px] px-6 py-8">
        
        {/* Top Logo & Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 mb-4">
            <div className="w-full h-full bg-[#0E1015] rounded-[11px] flex items-center justify-center">
              <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-[24px]">
                auto_awesome
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            ASENZO <span className="font-light text-blue-400">OS</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Founder Growth & Revenue Intelligence Operating System
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#101216]/90 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl shadow-black/80">
          
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab("signin"); setErrorMsg(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "signin"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("signup"); setErrorMsg(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "signup"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alert Error Message Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2 text-xs text-red-200 animate-fadeIn">
              <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0">error</span>
              <span className="flex-1">{errorMsg}</span>
              <button 
                type="button" 
                onClick={() => setErrorMsg(null)}
                className="text-red-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          {/* Alert Success Banner */}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-center gap-2 text-xs text-emerald-200 animate-fadeIn">
              <span className="material-symbols-outlined text-[18px] text-emerald-400 shrink-0">check_circle</span>
              <span className="flex-1">{successMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                    mail
                  </span>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@company.com"
                    className="w-full h-10 pl-10 pr-4 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setErrorMsg("Please contact your administrator or Supabase dashboard to reset your password.")}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-10 pr-10 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Operating System</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Mark Alexander"
                    className="w-full h-10 pl-10 pr-4 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                    business
                  </span>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="SaaSify Inc"
                    className="w-full h-10 pl-10 pr-4 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                    mail
                  </span>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@company.com"
                    className="w-full h-10 pl-10 pr-4 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-10 pl-10 pr-10 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Founder Account</span>
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <span className="relative px-3 bg-[#101216] text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
              Or Instant Access
            </span>
          </div>

          {/* Quick Demo Founder Login Button */}
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isSubmitting}
            className="w-full h-9 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">bolt</span>
            <span>Quick Demo Founder Login</span>
          </button>
        </div>

        {/* Footer Security Badges & Supabase Auth Indicator */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span>
              {isSupabaseConnected
                ? "Supabase Auth Backend Active"
                : "Supabase Sandbox Mode (Keys Unconfigured)"}
            </span>
          </div>
          <p className="text-[10px] text-zinc-600">
            256-Bit TLS Encryption · ASENZO Founder Security Architecture
          </p>
        </div>

      </div>
    </div>
  );
}
