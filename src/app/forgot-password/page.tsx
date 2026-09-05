"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import {
  sendOtpAction,
  verifyOtpAction,
  resetPasswordWithOtpAction
} from "@/app/actions/authActions";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Send Reset OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim()) return setError("Please enter your registered Email or Mobile Phone.");

    setLoading(true);
    const res = await sendOtpAction(identifier);
    setLoading(false);

    if (res.success) {
      setGeneratedOtp(res.otpCode || null);
      setStep(2);
      setSuccessMsg(`Reset OTP sent to ${identifier}`);
    } else {
      setError(res.error || "Failed to send OTP.");
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpCode || otpCode.length < 6) return setError("Please enter the 6-digit OTP code.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters long.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match!");

    setLoading(true);
    const otpRes = await verifyOtpAction(identifier, otpCode);

    if (!otpRes.success) {
      setLoading(false);
      return setError(otpRes.error || "Invalid OTP code.");
    }

    const resetRes = await resetPasswordWithOtpAction({
      identifier,
      newPassword,
    });

    setLoading(false);

    if (resetRes.success) {
      setStep(3);
    } else {
      setError(resetRes.error || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-indigo-500/20">
            A
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">ApexCRM</h1>
          <p className="text-xs text-gray-500 font-semibold">Account Password Recovery</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Identifier Input */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="text-center">
              <h2 className="text-base font-black text-gray-900">Forgot Your Password?</h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your registered Work Email or Mobile Phone to receive a reset OTP.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Registered Email or Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. rahul@gmail.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-extrabold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
            >
              {loading ? "Sending Reset OTP..." : "Send Reset OTP"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: OTP & New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center">
              <h2 className="text-base font-black text-gray-900">Verify OTP & Set New Password</h2>
              <p className="text-xs text-gray-500 mt-1">
                OTP sent to <span className="font-bold text-gray-900">{identifier}</span>
              </p>
            </div>

            {/* Test OTP Badge */}
            {generatedOtp && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-amber-900">
                    Test OTP: <code className="text-indigo-700 bg-amber-100 px-2 py-0.5 rounded font-black">{generatedOtp}</code>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedOtp)}
                  className="px-2.5 py-1 bg-amber-600 text-white font-extrabold text-[11px] rounded-lg"
                >
                  Auto-fill
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                6-Digit Reset OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center text-xl font-black tracking-widest py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-indigo-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none"
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
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-900 flex items-center gap-1 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change Email/Phone
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-extrabold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? "Updating Password..." : "Update Password Now"}
            </button>
          </form>
        )}

        {/* Step 3: Password Updated Success */}
        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Password Updated!</h2>
            <p className="text-xs font-semibold text-gray-600">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-extrabold text-sm hover:bg-indigo-700 transition-colors block text-center shadow-md shadow-indigo-600/20"
            >
              Back to Login Screen →
            </Link>
          </div>
        )}

        {/* Footer Link */}
        {step !== 3 && (
          <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Remembered your password?{" "}
            <Link href="/login" className="font-extrabold text-indigo-600 hover:underline">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
