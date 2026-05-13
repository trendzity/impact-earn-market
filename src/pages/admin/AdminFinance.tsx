import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Wallet, TrendingUp, Clock, AlertCircle, Search, PlusCircle, MinusCircle,
  Loader2, X, Check, IndianRupee, Users, ArrowDownCircle, ArrowUpCircle
} from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const ROLES = ["ALL", "INFLUENCER", "GENERAL", "BUSINESS", "RESELLER"];

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    INFLUENCER: "bg-purple-500/10 text-purple-600",
    BUSINESS: "bg-blue-500/10 text-blue-600",
    GENERAL: "bg-slate-500/10 text-slate-500",
    RESELLER: "bg-orange-500/10 text-orange-600",
    ADMIN: "bg-red-500/10 text-red-600",
  };
  return map[role] || "bg-muted text-muted-foreground";
};

export default function AdminFinance() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [modal, setModal] = useState<{ type: "credit" | "debit"; user: any } | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isWithdrawable, setIsWithdrawable] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchStats = async () => {
    try {
      const token = getToken();
      const res = await fetch(getApiUrl("/admin/wallets/stats"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch {}
  };

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter !== "ALL") params.set("role", roleFilter);

      const res = await fetch(getApiUrl(`/admin/wallets?${params.toString()}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWallets(data.wallets);
      }
    } catch {
      toast.error("Failed to load wallets");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => fetchWallets(), 350);
    return () => clearTimeout(delay);
  }, [fetchWallets]);

  const handleAction = async () => {
    if (!modal || !amount || isNaN(parseFloat(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      setIsProcessing(true);
      const token = getToken();
      const endpoint = modal.type === "credit" ? "/admin/wallets/credit" : "/admin/wallets/debit";
      const body: any = { userId: modal.user.id, amount: parseFloat(amount), note };
      if (modal.type === "credit") body.isWithdrawable = isWithdrawable;

      const res = await fetch(getApiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setModal(null);
        setAmount("");
        setNote("");
        setIsWithdrawable(true);
        fetchWallets();
        fetchStats();
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const statCards = [
    { label: "Total Active Wallets", value: stats?.totalWallets ?? "—", icon: Users, color: "text-accent" },
    { label: "Platform Balance", value: stats ? `₹${Number(stats.platformBalance).toLocaleString()}` : "—", icon: IndianRupee, color: "text-green-500" },
    { label: "Pending Withdrawals", value: stats?.pendingWithdrawals ?? "—", icon: ArrowUpCircle, color: "text-orange-500" },
    { label: "Pending Deposits", value: stats?.pendingDeposits ?? "—", icon: ArrowDownCircle, color: "text-blue-500" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wallet Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage all user wallets on the platform</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-9 text-sm bg-muted border-border"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ROLES.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={roleFilter === r ? "default" : "outline"}
              onClick={() => setRoleFilter(r)}
              className={`h-9 text-xs font-bold ${roleFilter === r ? "bg-accent text-white" : "border-border"}`}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-accent" />
              <p className="text-xs text-muted-foreground">Loading wallets...</p>
            </div>
          ) : wallets.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-muted-foreground italic">No wallets found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="text-[10px] font-bold uppercase">User</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Role</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Total Balance</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Withdrawable</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((w) => (
                    <TableRow key={w.id} className="hover:bg-muted/5 border-border/30">
                      <TableCell>
                        <p className="text-xs font-bold">{w.user.name}</p>
                        <p className="text-[10px] text-muted-foreground">{w.user.email}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] font-bold border-none ${roleBadge(w.user.role)}`}>
                          {w.user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className={`text-sm font-bold ${Number(w.balance) < 0 ? "text-red-500" : "text-foreground"}`}>
                          ₹{Number(w.balance).toLocaleString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-green-600 font-medium">₹{Number(w.withdrawableBalance).toLocaleString()}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] font-bold border-none ${w.status === "active" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                          {w.status?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => { setModal({ type: "credit", user: w.user }); setAmount(""); setNote(""); }}
                            className="h-7 px-2 gap-1 text-[10px] font-bold bg-green-600 hover:bg-green-700 text-white"
                          >
                            <PlusCircle className="h-3 w-3" /> Add
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => { setModal({ type: "debit", user: w.user }); setAmount(""); setNote(""); }}
                            className="h-7 px-2 gap-1 text-[10px] font-bold bg-red-500 hover:bg-red-600 text-white"
                          >
                            <MinusCircle className="h-3 w-3" /> Deduct
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credit / Debit Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-background border border-border rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {modal.type === "credit"
                    ? <PlusCircle className="h-5 w-5 text-green-500" />
                    : <MinusCircle className="h-5 w-5 text-red-500" />
                  }
                  <div>
                    <h2 className="text-lg font-bold">{modal.type === "credit" ? "Add Money" : "Deduct Money"}</h2>
                    <p className="text-xs text-muted-foreground">{modal.user.name} — {modal.user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setModal(null)} className="rounded-full h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Amount (₹)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-muted border-border"
                  />
                </div>

                {modal.type === "credit" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Credit Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setIsWithdrawable(true)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${isWithdrawable ? "border-green-500 bg-green-500/10 text-green-600" : "border-border text-muted-foreground"}`}
                      >
                        ✅ Withdrawable
                      </button>
                      <button
                        onClick={() => setIsWithdrawable(false)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${!isWithdrawable ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground"}`}
                      >
                        🔒 Non-Withdrawable
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Note (Optional)</label>
                  <Input
                    placeholder="Reason for this transaction..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="bg-muted border-border"
                  />
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setModal(null)} disabled={isProcessing}>Cancel</Button>
                <Button
                  onClick={handleAction}
                  disabled={isProcessing}
                  className={modal.type === "credit" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"}
                >
                  {isProcessing
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : modal.type === "credit" ? "Confirm Credit" : "Confirm Deduct"
                  }
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
