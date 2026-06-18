
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Building2, Star, Briefcase, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getUser, updateUser, getToken, getApiUrl } from "@/utils/auth";

const roles = [
  { id: "general", label: "General User", desc: "Complete tasks and earn rewards", icon: <Users className="w-8 h-8" />, path: "/dashboard", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "business", label: "Business", desc: "Launch campaigns and grow", icon: <Building2 className="w-8 h-8" />, path: "/business", color: "text-accent", bg: "bg-accent/10" },
  { id: "influencer", label: "Influencer", desc: "Connect with brands to earn", icon: <Star className="w-8 h-8" />, path: "/influencer", color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "reseller", label: "Reseller / Agency", desc: "White-label our services locally", icon: <Briefcase className="w-8 h-8" />, path: "/reseller", color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const SelectRole = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

    useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // If a role is already selected, redirect them to onboarding or their dashboard
    if (user.role) {
      if (user.onboarded) {
        const role = user.role.toLowerCase();
        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "general" || role === "user") navigate("/dashboard", { replace: true });
        else navigate(`/${role}`, { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [user, navigate]);


  const handleRoleSelect = async (roleId: string) => {
    const roleData = roles.find(r => r.id === roleId);
    if (!roleData) return;
    
    // Map roleId to backend enum
    const backendRole = {
      general: "GENERAL",
      business: "BUSINESS",
      influencer: "INFLUENCER",
      reseller: "RESELLER"
    }[roleId] || roleId.toUpperCase();

    // Make API call to backend
    const token = getToken();
    try {
      const url = getApiUrl("/profile/role");
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: backendRole })
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }
      
      updateUser({ role: roleId });
      toast.success(`Role selected: ${roleData.label}`);
      navigate("/onboarding");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save role. Please try again.");
    }
  };


  if (!user) return null;

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl"
        >
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-accent font-medium uppercase tracking-wider border border-accent/20 bg-accent/5 mb-4">
              Welcome to the Ecosystem, {user.name || "User"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Select your account type</h1>
            <p className="text-xl text-muted-foreground">Choose how you want to interact with the Trendzity marketplace.</p>
            {user.email && (
              <p className="mt-2 text-sm text-muted-foreground/60">
                Logged in as <span className="text-foreground">{user.email}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {roles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                onClick={() => handleRoleSelect(role.id)}
                className="glass-card-hover rounded-3xl p-8 cursor-pointer relative overflow-hidden group border border-border/50 hover:border-accent/50 text-left flex flex-col justify-between"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow ${role.bg} ${role.color}`}>
                    {role.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{role.label}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{role.desc}</p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-4 border-t border-border/30 pt-4">
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Continue</span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => { localStorage.clear(); sessionStorage.clear(); navigate("/login"); }}
              className="text-sm text-muted-foreground hover:text-accent transition-colors underline underline-offset-4"
            >
              Not {user.name}? Sign in with a different account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectRole;
