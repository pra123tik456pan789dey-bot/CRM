"use client";

export const dynamic = "force-dynamic";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  UserPlus,
  Lock,
  Mail,
  Phone,
  CreditCard,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Smartphone,
  RefreshCw,
  Sparkles,
  LogIn
} from "lucide-react";
import {
  sendOtpAction,
  verifyOtpAction,
  registerEmployeeSelfAction,
  resetPasswordWithOtpAction
} from "@/app/actions/authActions";

export default function LoginPage() {
  const router = useRouter();

  // Active View: "login" | "register" | "forgot"
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login");

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // REGISTER MULTI-STEP STATE (1 = Details, 2 = OTP, 3 = Success)
  const [regStep, setRegStep] = useState(1);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAadhar, setRegAadhar] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  // FORGOT PASSWORD STATE
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtpCode, setForgotOtpCode] = useState("");
  const [forgotGeneratedOtp, setForgotGeneratedOtp] = useState<string | null>(null);
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // OTP Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (activeTab === "register" && regStep === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [activeTab, regStep, timer]);

  // Format Aadhar Card Input
  const handleAadharChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 12);
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
    setRegAadhar(formatted);
  };

  // HANDLE LOGIN
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const res = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });

    setLoginLoading(false);

    if (res?.error) {
      setLoginError("Invalid email address or password.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  // HANDLE REGISTER STEP 1 (Send OTP)
  const handleRegStep1Next = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim()) return setRegError("Full Name is required.");
    if (!regEmail.trim() || !regEmail.includes("@")) return setRegError("Valid Gmail/Email is required.");
    if (!regPhone.trim() || regPhone.replace(/\D/g, "").length < 10) return setRegError("10-Digit Mobile Number is required.");
    if (regPassword.length < 6) return setRegError("Password must be at least 6 characters long.");
    if (regPassword !== regConfirmPassword) return setRegError("Passwords do not match!");

    setRegLoading(true);
    const res = await sendOtpAction(regPhone);
    setRegLoading(false);

    if (res.success) {
      setGeneratedOtp(res.otpCode || null);
      setRegStep(2);
      setTimer(60);
      setCanResend(false);
    } else {
      setRegError(res.error || "Failed to send OTP.");
    }
  };

  // HANDLE RESEND OTP
  const handleResendOtp = async () => {
    setRegError("");
    setRegLoading(true);
    const res = await sendOtpAction(regPhone);
    setRegLoading(false);

    if (res.success) {
      setGeneratedOtp(res.otpCode || null);
      setTimer(60);
      setCanResend(false);
    } else {
      setRegError(res.error || "Failed to resend OTP.");
    }
  };

  // HANDLE REGISTER STEP 2 (Verify OTP & Create Account)
  const handleRegVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!otpCode || otpCode.length < 6) {
      return setRegError("Please enter the 6-digit OTP code.");
    }

    setRegLoading(true);
    const otpRes = await verifyOtpAction(regPhone, otpCode);

    if (!otpRes.success) {
      setRegLoading(false);
      return setRegError(otpRes.error || "Invalid OTP code.");
    }

    const regRes = await registerEmployeeSelfAction({
      name: regName,
      email: regEmail,
      phone: regPhone,
      aadharNumber: regAadhar,
      password: regPassword,
    });

    setRegLoading(false);

    if (regRes.success) {
      setRegStep(3);
      // Auto login so session persists
      await signIn("credentials", {
        email: regEmail,
        password: regPassword,
        redirect: false,
      });
    } else {
      setRegError(regRes.error || "Failed to create account.");
    }
  };

  // HANDLE FORGOT PASSWORD STEP 1 (Send OTP)
  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotIdentifier.trim()) return setForgotError("Please enter registered email or phone.");

    setForgotLoading(true);
    const res = await sendOtpAction(forgotIdentifier);
    setForgotLoading(false);

    if (res.success) {
      setForgotGeneratedOtp(res.otpCode || null);
      setForgotStep(2);
    } else {
      setForgotError(res.error || "Failed to send OTP.");
    }
  };

  // HANDLE FORGOT PASSWORD STEP 2 (Reset Password)
  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotOtpCode || forgotOtpCode.length < 6) return setForgotError("Enter 6-digit OTP.");
    if (forgotNewPassword.length < 6) return setForgotError("Password must be at least 6 characters.");
    if (forgotNewPassword !== forgotConfirmPassword) return setForgotError("Passwords do not match!");

    setForgotLoading(true);
    const otpRes = await verifyOtpAction(forgotIdentifier, forgotOtpCode);

    if (!otpRes.success) {
      setForgotLoading(false);
      return setForgotError(otpRes.error || "Invalid OTP code.");
    }

    const resetRes = await resetPasswordWithOtpAction({
      identifier: forgotIdentifier,
      newPassword: forgotNewPassword,
    });

    setForgotLoading(false);

    if (resetRes.success) {
      setForgotSuccess(true);
    } else {
      setForgotError(resetRes.error || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-indigo-500/30">
            A
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">ApexCRM</h1>
          <p className="text-xs sm:text-sm font-bold text-gray-500">Sign in or Create Employee Workspace ID</p>
        </div>

        {/* Top View Toggle Tabs */}
        <div className="grid grid-cols-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setLoginError("");
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "login"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setRegStep(1);
              setRegError("");
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "register"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Employee ID</span>
          </button>
        </div>

        {/* VIEW 1: SIGN IN FORM */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold text-center">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Work Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("forgot");
                    setForgotStep(1);
                    setForgotError("");
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-extrabold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loginLoading ? "Signing In..." : "Sign In to Dashboard"}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider absolute">
                OR
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setRegStep(1);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-extrabold text-sm hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Employee ID (Self-Register)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* VIEW 2: MULTI-STEP EMPLOYEE REGISTRATION FORM */}
        {activeTab === "register" && (
          <div className="space-y-4">
            {/* Step Progress */}
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
              <span>Step {regStep} of 3</span>
              <div className="flex gap-1.5 w-1/2">
                <div className={`h-1.5 flex-1 rounded-full ${regStep >= 1 ? "bg-emerald-600" : "bg-gray-200"}`} />
                <div className={`h-1.5 flex-1 rounded-full ${regStep >= 2 ? "bg-emerald-600" : "bg-gray-200"}`} />
                <div className={`h-1.5 flex-1 rounded-full ${regStep >= 3 ? "bg-emerald-600" : "bg-gray-200"}`} />
              </div>
            </div>

            {regError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {/* Step 1: Employee Form */}
            {regStep === 1 && (
              <form onSubmit={handleRegStep1Next} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Gmail / Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="rahul@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Mobile Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="9876543210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Aadhar Card Number (Identity Proof)</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012"
                      value={regAadhar}
                      onChange={(e) => handleAadharChange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-600 outline-none tracking-wider"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Confirm *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-600 outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-extrabold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 mt-3 shadow-md shadow-emerald-600/30"
                >
                  {regLoading ? "Sending OTP..." : "Proceed to Mobile OTP Verification"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: OTP Form */}
            {regStep === 2 && (
              <form onSubmit={handleRegVerifyAndSubmit} className="space-y-4 text-center">
                <div className="space-y-1">
                  <Smartphone className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-black text-gray-900">Enter Mobile OTP Verification Code</h3>
                  <p className="text-xs text-gray-500">Sent to +91 {regPhone}</p>
                </div>

                {generatedOtp && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900">
                      Test OTP: <code className="bg-amber-100 text-indigo-700 px-1.5 py-0.5 rounded font-black">{generatedOtp}</code>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(generatedOtp)}
                      className="px-2 py-0.5 bg-amber-600 text-white font-bold text-[10px] rounded"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-xl font-black tracking-widest py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:border-emerald-600 outline-none"
                  required
                />

                <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-emerald-600 font-extrabold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Resend OTP
                    </button>
                  ) : (
                    <span>Resend in <span className="font-bold text-emerald-600">{timer}s</span></span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-extrabold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {regLoading ? "Verifying..." : "Verify OTP & Create Account"}
                </button>
              </form>
            )}

            {/* Step 3: Success */}
            {regStep === 3 && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-black text-gray-900">Account Created & Logged In!</h3>
                <p className="text-xs font-semibold text-gray-600">
                  Welcome <span className="text-emerald-600 font-bold">{regName}</span>! Your employee account is active.
                </p>
                <button
                  onClick={() => {
                    router.push("/");
                    router.refresh();
                  }}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-extrabold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
                >
                  Go to Dashboard Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: FORGOT PASSWORD FORM */}
        {activeTab === "forgot" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-gray-400 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-black text-gray-900">Password Recovery</h3>
            </div>

            {forgotError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black text-gray-900">Password Reset Successfully!</h4>
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs"
                >
                  Sign In Now →
                </button>
              </div>
            ) : forgotStep === 1 ? (
              <form onSubmit={handleForgotStep1} className="space-y-3">
                <p className="text-xs text-gray-500">Enter registered Email or Phone number to receive OTP.</p>
                <div>
                  <input
                    type="text"
                    placeholder="rahul@gmail.com or 9876543210"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/30"
                >
                  {forgotLoading ? "Sending OTP..." : "Send Reset OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotStep2} className="space-y-3">
                {forgotGeneratedOtp && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-900">Test OTP: {forgotGeneratedOtp}</span>
                    <button
                      type="button"
                      onClick={() => setForgotOtpCode(forgotGeneratedOtp)}
                      className="px-2 py-0.5 bg-amber-600 text-white font-bold text-[10px] rounded"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">6-Digit OTP *</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={forgotOtpCode}
                    onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">New Password *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/30"
                >
                  {forgotLoading ? "Updating..." : "Reset Password Now"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Company Link */}
        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          <span>Are you a Company Owner? </span>
          <Link href="/register" className="font-extrabold text-indigo-600 hover:underline">
            Register New Company →
          </Link>
        </div>
      </div>
    </div>
  );
}
