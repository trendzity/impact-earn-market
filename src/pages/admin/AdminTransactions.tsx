import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, Download, Filter, Calendar, 
  ArrowUpDown, Loader2, IndianRupee, User,
  ArrowRight
} from "lucide-react";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const CATEGORIES = [
  "ALL",
  "CAMPAIGN_REWARD",
  "ADMIN_CREDIT",
  "ADMIN_DEBIT",
  "DEPOSIT_APPROVED",
  "WITHDRAWAL_PROCESSED",
  "REFERRAL_BONUS"
];

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

const categoryBadge = (cat: string) => {
  const map: Record<string, string> = {
    CAMPAIGN_REWARD: "bg-green-500/10 text-green-600 border-green-500/20",
    ADMIN_CREDIT: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    ADMIN_DEBIT: "bg-red-500/10 text-red-600 border-red-500/20",
    WITHDRAWAL_PROCESSED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    DEPOSIT_APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };
  return map[cat] || "bg-muted text-muted-foreground border-border";
};

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      });
      if (search) params.set("search", search);
      if (category !== "ALL") params.set("category", category);

      const res = await fetch(getApiUrl(`/admin/transactions?${params.toString()}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setTotalPages(data.pagination.pages);
        setTotalCount(data.pagination.total);
      }
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    const delay = setTimeout(() => fetchTransactions(), 300);
    return () => clearTimeout(delay);
  }, [fetchTransactions]);

  const handleExport = () => {
    // Basic CSV Export
    const headers = ["Date,User,Email,Role,Category,Amount,Description,RefID"];
    const rows = transactions.map(t => 
      `${new Date(t.createdAt).toLocaleString()},${t.user.name},${t.user.email},${t.user.role},${t.category},${t.amount},"${t.description || ""}",${t.referenceId || ""}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trendzity_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Ledger exported successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transaction Ledger</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Complete platform financial history 
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span className="text-accent font-bold">{totalCount} total records</span>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="h-9 gap-2 border-border/50 hover:bg-muted">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-muted/20">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user name or email..."
              className="pl-9 bg-background border-border"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="h-10 px-3 py-2 rounded-md border border-border bg-background text-sm focus:ring-1 focus:ring-accent outline-none"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <Button variant="outline" className="h-10 gap-2 border-border">
              <Calendar className="h-4 w-4" /> Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Ledger */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">Retrieving financial records...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-muted-foreground italic">No transactions found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-[10px] font-bold uppercase whitespace-nowrap">Date / Time</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">User</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Role</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Category</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Amount</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Description</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-right">Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/5 border-border/30">
                      <TableCell className="whitespace-nowrap">
                        <p className="text-xs font-medium">{new Date(t.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-bold">{t.user.name}</p>
                        <p className="text-[10px] text-muted-foreground">{t.user.email}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] font-bold border-none ${roleBadge(t.user.role)}`}>
                          {t.user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[9px] font-bold ${categoryBadge(t.category)}`}>
                          {t.category?.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className={`text-sm font-bold ${t.type === "CREDIT" ? "text-green-600" : "text-red-500"}`}>
                          {t.type === "CREDIT" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-xs text-foreground truncate" title={t.description}>{t.description}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <p className="text-[10px] font-mono text-muted-foreground uppercase">{t.referenceType}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">{t.referenceId || "—"}</p>
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="text-xs font-medium px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
