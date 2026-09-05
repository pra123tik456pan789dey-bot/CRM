"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Smartphone,
  RefreshCw,
  Sparkles
} from "lucide-react";
import {
  sendOtpAction,
  verifyOtpAction,
  registerEmployeeSelfAction
} from "@/app/actions/authActions";

export default function RegisterEmployeePage() {
  const router = useRouter();

  // Multi-step state: 1 = Details & Credentials, 2 = OTP Verification, 3 = Success
  const [step, setStep] = useState(1);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Format Aadhar Number (e.g. 1234 5678 9012)
  const handleAadharChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 12);
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
    setAadharNumber(formatted);
  };

  // Step 1 Submission -> Send OTP & Proceed to Step 2
  const handleStep1Next = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Full Name is required.");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid Email address.");
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) return setError("Please enter a valid 10-digit mobile number.");
    if (password.length < 6) return setError("Password must be at least 6 characters long.");
    if (password !== confirmPassword) return setError("Passwords do not match!");

    setLoading(true);
    const res = await sendOtpAction(phone);
    setLoading(false);

    if (res.success) {
      setGeneratedOtp(res.otpCode || null);
      setStep(2);
      setTimer(60);
      setCanResend(false);
      setSuccessMsg(`OTP sent to +91 ${phone}`);
    } else {
      setError(res.error || "Failed to send OTP.");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    const res = await sendOtpAction(phone);
    setLoading(false);
    if (res.success) {
      setGeneratedOtp(res.otpCode || null);
      setTimer(60);
      setCanResend(false);
      setSuccessMsg("New OTP sent successfully!");
    } else {
      setError(res.error || "Failed to resend OTP.");
    }
  };

  // Step 2 Submission -> Verify OTP & Register Account
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpCode || otpCode.length < 6) {
      return setError("Please enter the 6-digit OTP code.");
    }

    setLoading(true);
    const otpRes = await verifyOtpAction(phone, otpCode);

    if (!otpRes.success) {
      setLoading(false);
      return setError(otpRes.error || "Invalid OTP code. Please try again.");
    }

    // OTP Verified -> Create Account in DB
    const regRes = await registerEmployeeSelfAction({
      name,
      email,
      phone,
      aadharNumber,
      password,
    });

    setLoading(false);

    if (regRes.success) {
      setStep(3);
      // Auto Login so user session persists automatically
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } else {
      setError(regRes.error || "Failed to create employee account.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-xl w-full bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-indigo-500/30">
            A
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">ApexCRM</h1>
          <p className="text-xs sm:text-sm font-semibold text-indigo-600">
            Employee Self-Registration Portal
          </p>
        </div>

        {/* Instagram-style Step Indicator Progress Bar */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2 flex-1">
            <div
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                step >= 1 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                step >= 2 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                step >= 3 ? "bg-emerald-500" : "bg-gray-200"
              }`}
            />
          </div>
          <span className="text-xs font-bold text-gray-500 ml-4">
            Step {step} of 3
          </span>
        </div>

        {/* Error / Notification Banner */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Personal Details & Identity (Aadhar & Credentials) */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4">
            <div className="border-b border-gray-100 pb-2">
              <h2 className="text-base font-black text-gray-900">1. Fill Employee Details</h2>
              <p className="text-xs text-gray-500">Enter your name, email, phone & Aadhar number</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Gmail / Work Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="rahul@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Aadhar Card Number (Optional / ID Proof)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="1234 5678 9012"
                  value={aadharNumber}
                  onChange={(e) => handleAadharChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all tracking-wider"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Create Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-extrabold text-sm hover:shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? "Sending OTP..." : "Proceed to Mobile OTP Verification"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Mobile OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-gray-900">2. Mobile OTP Verification</h2>
              <p className="text-xs text-gray-500">
                Enter the 6-digit OTP code sent to <span className="font-bold text-gray-900">+91 {phone}</span>
              </p>
            </div>

            {/* Test OTP Badge for instant 1-click auto fill */}
            {generatedOtp && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-amber-900">
                    Test OTP Code: <code className="text-indigo-700 bg-amber-100 px-2 py-0.5 rounded text-sm font-black">{generatedOtp}</code>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedOtp)}
                  className="px-2.5 py-1 bg-amber-600 text-white font-extrabold text-[11px] rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Auto-fill
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 text-center mb-2">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center text-2xl font-black tracking-widest py-3 bg-gray-50 border border-gray-300 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-900 flex items-center gap-1 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to details
              </button>

              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                </button>
              ) : (
                <span>Resend in <span className="font-bold text-indigo-600">{timer}s</span></span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-extrabold text-sm hover:shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? "Verifying & Registering..." : "Verify OTP & Complete Account Setup"}
            </button>
          </form>
        )}

        {/* STEP 3: Success & Auto-Login Redirect */}
        {step === 3 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">Welcome to ApexCRM!</h2>
              <p className="text-sm font-bold text-gray-600">
                Your Employee account (<span className="text-indigo-600">{email}</span>) has been created & verified.
              </p>
              <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 py-2 px-4 rounded-xl border border-emerald-200 inline-block">
                ✅ OTP Verified • Persistent Login Active
              </p>
            </div>

            <button
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-extrabold text-sm hover:shadow-lg hover:shadow-indigo-600/30 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Go to Employee Dashboard Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer Login Link */}
        {step !== 3 && (
          <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Already have an Employee ID?{" "}
            <Link href="/login" className="font-extrabold text-indigo-600 hover:underline">
              Sign In Here →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
