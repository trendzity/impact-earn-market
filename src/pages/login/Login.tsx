
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  saveUser,
  saveToken,
  UserData,
  getApiUrl,
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

  const setAuthMode = (next: "login" | "signup") => {
    setMode(next);
    if (next === "signup") {
      const params = new URLSearchParams(searchParams);
      params.set("mode", "signup");
      navigate({ pathname: "/signup", search: params.toString() }, { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

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
      // URLSearchParams already decodes percent-encoding in most browsers, but
      // keep a safe fallback since backend redirects may double-encode.
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
        profileImage:
          rawUserData.profileImage || "",
        loginType:
          rawUserData.provider || "google",
        role: rawUserData.role?.toLowerCase(),
        onboarded: rawUserData.onboarded,
      };

      saveUser(userData);

      saveToken(tokenParam);

      // Remove only sensitive params (keep others like mode/ref).
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("user");
      newParams.delete("token");
      setSearchParams(newParams, { replace: true });

      toast.success(`Welcome ${userData.name}!`);

      navigate(getPostAuthPath(userData));
    } catch (error) {
      console.error(
        "Failed to parse user data",
        error
      );

      toast.error(
        "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }
}, [searchParams, navigate]);

const handleOAuth = (
  provider: "google" | "facebook" | "linkedin"
) => {
  window.location.href =
    getApiUrl(`/auth/${provider}`);
};

const handleAuth = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  setLoading(true);

  try {
    const endpoint =
      mode === "signup"
        ? "/auth/register"
        : "/auth/login";

    const payload =
      mode === "signup"
        ? {
            name: name.trim(),
            email: email.trim(),
            password,
          }
        : {
            email: email.trim(),
            password,
          };

    const result = await apiFetch<{
      user: any;
      token: string;
    }>(endpoint, {
      method: "POST",
      auth: false,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!result.ok) {
      throw new Error(
        result.error ||
          "Authentication failed"
      );
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

    if (mode === "signup") {
      toast.success(
        "Account created successfully!"
      );

      navigate("/select-role");
    } else {
      toast.success("Welcome back!");

      navigate(getPostAuthPath(userData));
    }
  } catch (error: any) {
    console.error("Auth error:", error);

    toast.error(
      error?.message ||
        "Something went wrong. Please try again."
    );
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
                <h2 className="text-2xl font-bold">{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
                <p className="text-muted-foreground mt-2">
                  {mode === "login" ? `Sign in to Trendzity` : `Register to join Trendzity`}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {mode === "signup" && (
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
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-background/50 border-white/10 focus:border-accent" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
                    )}
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
                      {mode === "login" ? "Sign In" : "Sign Up"} <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-background/50 border-white/10 hover:border-accent/40"
                    onClick={() => handleOAuth("google")}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-background/50 border-white/10 hover:border-accent/40"
                    onClick={() => handleOAuth("facebook")}
                  >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="col-span-2 bg-background/50 border-white/10 hover:border-accent/40"
                    onClick={() => handleOAuth("linkedin")}
                  >
                    <svg className="mr-2 h-4 w-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </Button>
                </div>
              </form>

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
