
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

import { toast } from "sonner";
import {
  saveUser,
  saveToken,
  UserData,
  getApiUrl,
  getUser,
} from "@/utils/auth";

import { apiFetch } from "@/utils/api";

function getPostAuthPath(user: UserData) {
  const role = user.role?.toLowerCase();

  if (role === "admin") return "/admin";

  if (!role) return "/select-role";

  if (!user.onboarded) return "/select-role";

  if (role === "general" || role === "user") return "/dashboard";

  return `/${role}`;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  
  // OTP state variables
  const [otpScreen, setOtpScreen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Password Reset state variables
  const [forgotScreen, setForgotScreen] = useState(false);
  const [resetScreen, setResetScreen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtpCode, setResetOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [resetOtpVerified, setResetOtpVerified] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetResendCooldown, setResetResendCooldown] = useState(0);

  const setAuthMode = (next: "login" | "signup") => {
    setMode(next);
    setOtpScreen(false);
    setNeedsPassword(false);
    if (next === "signup") {
      const params = new URLSearchParams(searchParams);
      params.set("mode", "signup");
      navigate({ pathname: "/signup", search: params.toString() }, { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  // Cooldown timers for resending OTPs
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0 || resetResendCooldown > 0) {
      timer = setTimeout(() => {
        if (resendCooldown > 0) setResendCooldown((prev) => prev - 1);
        if (resetResendCooldown > 0) setResetResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown, resetResendCooldown]);


  // Redirect already logged-in users away from the login/signup screens
  useEffect(() => {
    const loggedInUser = getUser();
    if (loggedInUser) {
      navigate(getPostAuthPath(loggedInUser), { replace: true });
    }
  }, [navigate]);

  // Keep signup UI in sync with canonical URL (/signup?mode=signup).
  useEffect(() => {
    if (location.pathname === "/signup" && searchParams.get("mode") !== "signup") {
      const params = new URLSearchParams(searchParams);
      params.set("mode", "signup");
      navigate({ pathname: "/signup", search: params.toString() }, { replace: true });
      return;
    }
    const urlMode = searchParams.get("mode") === "signup" ? "signup" : "login";
    setMode(urlMode);
  }, [location.pathname, searchParams, navigate]);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const userParam = searchParams.get("user");
    const tokenParam = searchParams.get("token");

    if (userParam && tokenParam) {
      setLoading(true);

      try {
        const decodedUserParam = (() => {
          try {
            return decodeURIComponent(userParam);
          } catch {
            return userParam;
          }
        })();

        const rawUserData = JSON.parse(decodedUserParam);

        const userData: UserData = {
          name: rawUserData.name || "User",
          email: rawUserData.email || "",
          profileImage: rawUserData.profileImage || "",
          loginType: rawUserData.provider || "google",
          role: rawUserData.role?.toLowerCase(),
          onboarded: rawUserData.onboarded,
        };

        saveUser(userData);
        saveToken(tokenParam);

        const newParams = new URLSearchParams(searchParams);
        newParams.delete("user");
        newParams.delete("token");
        setSearchParams(newParams, { replace: true });

        toast.success(`Welcome ${userData.name}!`);
        navigate(getPostAuthPath(userData));
      } catch (error) {
        console.error("Failed to parse user data", error);
        toast.error("Authentication failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }, [searchParams, navigate]);

  const handleOAuth = (provider: "google" | "facebook" | "linkedin") => {
    window.location.href = getApiUrl(`/auth/${provider}`);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        if (needsPassword) {

        // Verify password length (minimum 8 characters for new signups)
        if (!password || password.length < 8) {
          toast.error("Password must be at least 8 characters long");
          setLoading(false);
          return;
        }

          // Verify matching passwords first
          if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
          }
          // Phase 3: Complete registration (Set name and password)
          const result = await apiFetch<{
            user: any;
            token: string;
          }>("/auth/complete-signup", {
            method: "POST",
            auth: false,
            redirectOnAuthError: false,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.trim(),
              name: name.trim(),
              password,
            }),
          });

          if (!result.ok) {
            throw new Error((result as any).error || "Failed to complete registration");
          }

          const data = result.data;
          const userData: UserData = {
            name: data.user.name,
            email: data.user.email,
            loginType: "manual",
            role: data.user.role?.toLowerCase(),
            onboarded: data.user.onboarded,
          };

          saveUser(userData);
          saveToken(data.token);

          toast.success("Account created successfully!");
          navigate("/select-role");
        } else {
          // Phase 1: Send registration OTP
          const result = await apiFetch<any>("/auth/register", {
            method: "POST",
            auth: false,
            redirectOnAuthError: false,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim() }),
          });

          if (!result.ok) {
            throw new Error((result as any).error || "Failed to send code");
          }

          if (result.data?.status === "PENDING_VERIFICATION") {
            setOtpEmail(email.trim());
            setOtpScreen(true);
            toast.success("Verification code sent to your email!");
          }
        }
      } else {
        // Normal Login
        const result = await apiFetch<any>("/auth/login", {
          method: "POST",
          auth: false,
          redirectOnAuthError: false,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        });

        if (!result.ok) {
          // Catch unverified user
          if (result.data?.status === "PENDING_VERIFICATION") {
            setOtpEmail(email.trim());
            setOtpScreen(true);
            toast.warning("Email is unverified. A verification code has been sent!");
            return;
          }
          throw new Error((result as any).error || "Login failed");
        }

        const data = result.data;
        const userData: UserData = {
          name: data.user.name,
          email: data.user.email,
          loginType: "manual",
          role: data.user.role?.toLowerCase(),
          onboarded: data.user.onboarded,
        };

        saveUser(userData);
        saveToken(data.token);

        toast.success("Welcome back!");
        navigate(getPostAuthPath(userData));
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }
    setLoading(true);

    try {
      const result = await apiFetch<any>("/auth/verify-otp", {
        method: "POST",
        auth: false,
        redirectOnAuthError: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpEmail,
          otp: otpCode,
        }),
      });

      if (!result.ok) {
        throw new Error((result as any).error || "Verification failed");
      }

      toast.success("Email verified successfully!");

      const data = result.data;
      if (data.token) {
        // Already registered user (auto-logged in by verify-otp)
        const userData: UserData = {
          name: data.user.name,
          email: data.user.email,
          loginType: "manual",
          role: data.user.role?.toLowerCase(),
          onboarded: data.user.onboarded,
        };
        saveUser(userData);
        saveToken(data.token);
        navigate(getPostAuthPath(userData));
      } else if (data.needsPassword) {
        // New user signup, needs to set name and password
        setOtpScreen(false);
        setNeedsPassword(true);
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error?.message || "Invalid or expired verification code");
    } finally {
      setLoading(false);
    }
  };

    const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setLoading(true);

    try {
      const result = await apiFetch<any>("/auth/forgot-password", {
        method: "POST",
        auth: false,
        redirectOnAuthError: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });

      if (!result.ok) {
        throw new Error((result as any).error || "Failed to send reset code");
      }

      toast.success("Verification code sent to your email!");
      setForgotScreen(false);
      setResetScreen(true);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtpCode || resetOtpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }
    setLoading(true);

    try {
      const result = await apiFetch<any>("/auth/verify-reset-otp", {
        method: "POST",
        auth: false,
        redirectOnAuthError: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail.trim(),
          otp: resetOtpCode,
        }),
      });

      if (!result.ok) {
        throw new Error((result as any).error || "Invalid or expired reset code");
      }

      toast.success("Verification code verified successfully!");
      setResetOtpVerified(true);
    } catch (error: any) {
      console.error("Verify reset OTP error:", error);
      toast.error(error?.message || "Invalid or expired verification code");
    } finally {
      setLoading(false);
    }
  };

    const handleResendResetOtp = async () => {
    if (resetResendCooldown > 0) return;
    setLoading(true);

    try {
      const result = await apiFetch<any>("/auth/forgot-password", {
        method: "POST",
        auth: false,
        redirectOnAuthError: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });

      if (!result.ok) {
        throw new Error((result as any).error || "Failed to resend code");
      }

      toast.success("A new verification code has been sent!");
      setResetResendCooldown(60);
    } catch (error: any) {
      console.error("Resend reset OTP error:", error);
      toast.error(error?.message || "Failed to resend verification code");
    } finally {
      setLoading(false);
    }
  };



    const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtpCode || resetOtpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const result = await apiFetch<any>("/auth/reset-password", {
        method: "POST",
        auth: false,
        redirectOnAuthError: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail.trim(),
          otp: resetOtpCode,
          newPassword,
        }),
      });

      if (!result.ok) {
        throw new Error((result as any).error || "Failed to reset password");
      }

      toast.success("Password reset successfully! Please log in.");
      setResetScreen(false);
      setForgotScreen(false);
      setResetOtpVerified(false);
      setMode("login");
      setEmail(resetEmail);
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);

    try {
      const result = await apiFetch<any>("/auth/resend-otp", {
        method: "POST",
        auth: false,
        redirectOnAuthError: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });

      if (!result.ok) {
        throw new Error((result as any).error || "Failed to resend code");
      }

      toast.success("A new verification code has been sent!");
      setResendCooldown(60);
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(error?.message || "Failed to resend verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />
      
      {/* Simple Header */}
      <div className="p-6 relative z-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-bold text-lg text-accent-foreground shadow-glow group-hover:scale-110 transition-transform duration-300">T</div>
          <span className="text-2xl font-bold font-[family-name:var(--font-display)] text-foreground">Trendzity</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="auth-form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md relative"
          >
            <div className="glass-card rounded-3xl p-8 border border-border/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent to-purple-500" />
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-accent/10 text-accent">
                  <Zap className="w-8 h-8" />
                </div>
                                <h2 className="text-2xl font-bold">
                  {otpScreen 
                    ? "Verify Email" 
                    : needsPassword 
                      ? "Setup Profile" 
                      : forgotScreen
                        ? "Forgot Password"
                        : resetScreen
                          ? "Reset Password"
                          : mode === "login" 
                            ? "Welcome Back" 
                            : "Create Account"}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {otpScreen 
                    ? "Enter verification code" 
                    : needsPassword 
                      ? "Complete your profile details" 
                      : forgotScreen
                        ? "Enter your email to receive a recovery code"
                        : resetScreen
                          ? "Enter the code and your new password"
                          : mode === "login" 
                            ? "Sign in to Trendzity" 
                            : "Enter your email to sign up"}
                </p>
              </div>

              {otpScreen ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-xs text-muted-foreground">
                      We sent a 6-digit verification code to
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">{otpEmail}</p>
                  </div>

                                    <div className="space-y-2 flex flex-col items-center">
                    <Label htmlFor="otp" className="self-start">Verification Code</Label>
                                        <InputOTP
                      id="otp"
                      autoFocus
                      maxLength={6}
                      value={otpCode}
                      onChange={(value) => setOtpCode(value)}
                      containerClassName="flex items-center justify-center gap-2"
                    >
                      <InputOTPGroup><InputOTPSlot index={0} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                      <InputOTPGroup><InputOTPSlot index={1} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                      <InputOTPGroup><InputOTPSlot index={2} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                      <InputOTPGroup><InputOTPSlot index={3} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                      <InputOTPGroup><InputOTPSlot index={4} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                      <InputOTPGroup><InputOTPSlot index={5} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                    </InputOTP>

                  </div>


                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow mt-6" disabled={loading}>
                    {loading ? "Verifying..." : "Verify Email"}
                  </Button>

                  <div className="flex justify-between items-center mt-6 text-sm">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || loading}
                      className="text-accent hover:underline disabled:text-muted-foreground disabled:no-underline font-medium text-xs"
                    >
                      {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : "Resend Code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpScreen(false);
                        setNeedsPassword(false);
                        setEmail("");
                        setPassword("");
                        setName("");
                      }}
                      className="text-muted-foreground hover:text-foreground hover:underline text-xs"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : needsPassword ? (
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-xs text-muted-foreground">Email verified! Let's choose your password.</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="bg-background/50 border-white/10 focus:border-accent"
                    />
                  </div>

                                    <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-background/50 border-white/10 focus:border-accent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {/* Password Strength Guideline Indicator */}
                    <div className="pt-1 flex items-center gap-1.5 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={password.length >= 8 ? 'text-green-500/80 font-medium' : 'text-muted-foreground'}>
                        Must be at least 8 characters
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-background/50 border-white/10 focus:border-accent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>


                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow mt-6" disabled={loading}>
                    {loading ? "Completing Registration..." : "Complete Sign Up"}
                  </Button>

                  <div className="text-center mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setNeedsPassword(false);
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        setName("");
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : forgotScreen ? (
                
                // --- Part C: Forgot Password UI Panel ---
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="bg-background/50 border-white/10 focus:border-accent"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow mt-6" disabled={loading}>
                    {loading ? "Sending Code..." : "Send Recovery Code"}
                  </Button>
                  <div className="text-center mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotScreen(false);
                        setResetScreen(false);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
                            ) : resetScreen ? (
                
                // --- Part D: Reset Password UI Panel (Two-Step Animating Wizard) ---
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-xs text-muted-foreground">
                      We sent a 6-digit recovery code to
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">{resetEmail}</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {!resetOtpVerified ? (
                      <motion.form
                        key="verify-otp-step"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleVerifyResetOtp}
                        className="space-y-4"
                      >
                        <div className="space-y-2 flex flex-col items-center">
                          <Label htmlFor="reset-otp" className="self-start">Recovery Code</Label>
                          <InputOTP
                            id="reset-otp"
                            autoFocus
                            maxLength={6}
                            value={resetOtpCode}
                            onChange={(value) => setResetOtpCode(value)}
                            containerClassName="flex items-center justify-center gap-2"
                          >
                            <InputOTPGroup><InputOTPSlot index={0} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                            <InputOTPGroup><InputOTPSlot index={1} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                            <InputOTPGroup><InputOTPSlot index={2} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                            <InputOTPGroup><InputOTPSlot index={3} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                            <InputOTPGroup><InputOTPSlot index={4} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                            <InputOTPGroup><InputOTPSlot index={5} className="w-12 h-12 text-lg bg-background/50 border-white/20 rounded-xl focus-visible:ring-accent" /></InputOTPGroup>
                          </InputOTP>
                        </div>

                        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow mt-6" disabled={loading}>
                          {loading ? "Verifying..." : "Verify Code"}
                        </Button>

                        <div className="flex justify-between items-center mt-6 text-sm">
                          <button
                            type="button"
                            onClick={handleResendResetOtp}
                            disabled={resetResendCooldown > 0 || loading}
                            className="text-accent hover:underline disabled:text-muted-foreground disabled:no-underline font-medium text-xs bg-transparent border-0 cursor-pointer"
                          >
                            {resetResendCooldown > 0 ? `Resend Code (${resetResendCooldown}s)` : "Resend Code"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setResetScreen(false);
                              setForgotScreen(true);
                            }}
                            className="text-muted-foreground hover:text-foreground hover:underline text-xs bg-transparent border-0 cursor-pointer"
                          >
                            Back
                          </button>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="reset-password-step"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleResetPassword}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              required
                              className="bg-background/50 border-white/10 focus:border-accent pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <div className="pt-1 flex items-center gap-1.5 text-xs">
                          <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={newPassword.length >= 8 ? 'text-green-500/80 font-medium' : 'text-muted-foreground'}>
                            Must be at least 8 characters
                          </span>
                        </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm-reset-password">Confirm Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm-reset-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              required
                              className="bg-background/50 border-white/10 focus:border-accent pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow mt-6" disabled={loading}>
                          {loading ? "Resetting..." : "Reset Password"}
                        </Button>

                        <div className="text-center mt-6">
                          <button
                            type="button"
                            onClick={() => {
                              setResetOtpVerified(false);
                              setNewPassword("");
                              setConfirmPassword("");
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Back to Code Verification
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>


              ): (
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-background/50 border-white/10 focus:border-accent" />
                  </div>
                  
                  {mode === "login" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotScreen(true);
                            setResetScreen(false);
                            setResetOtpVerified(false);
                            setResetEmail(email); // autofill the current email input
                            setResetOtpCode("");
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                          className="text-xs text-accent hover:underline bg-transparent border-0 cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="••••••••" 
                          required 
                          className="bg-background/50 border-white/10 focus:border-accent pr-10" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow mt-6" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Zap className="w-4 h-4" />
                        </motion.div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {mode === "login" ? "Sign In" : "Send Verification Code"} <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 text-muted-foreground font-medium">Or continue with</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full bg-background/50 border-white/10 hover:border-accent/40 gap-2 h-10"
                      onClick={() => handleOAuth("google")}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" fill-rule="evenodd" clip-rule="evenodd" />
                      </svg>
                      Continue with Google
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-8 text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <p>Don't have an account? <button type="button" onClick={() => setAuthMode("signup")} className="text-foreground font-semibold hover:text-accent transition-colors">Sign up</button></p>
                ) : (
                  <p>Already have an account? <button type="button" onClick={() => setAuthMode("login")} className="text-foreground font-semibold hover:text-accent transition-colors">Log in</button></p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;