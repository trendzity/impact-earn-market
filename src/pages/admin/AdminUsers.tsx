import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Eye, Ban, Wallet, Loader2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      let url = getApiUrl("/admin/users?");
      if (roleFilter !== "all") url += `role=${roleFilter.toUpperCase()}&`;
      if (search) url += `search=${search}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">User Directory</h1>
          <p className="text-sm text-muted-foreground">Manage accounts, roles, and wallet balances</p>
        </div>
        <div className="bg-accent/10 px-4 py-2 rounded-xl border border-accent/20">
          <p className="text-[10px] uppercase font-bold text-accent tracking-widest">Platform Users</p>
          <p className="text-xl font-bold text-foreground">{users.length}</p>
        </div>
      </div>

      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
               User List
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Search name or email..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs w-48 md:w-64 bg-background border-border" 
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-8 w-32 text-xs bg-background">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-xs text-muted-foreground">Fetching platform users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground italic text-sm">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/30">
                    <TableHead className="text-[10px] font-bold uppercase py-3">User</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Role</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Balance</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Lifetime Earnings</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase">Joined</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/5 transition-colors">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-[10px]">
                            {user.name?.[0] || "U"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{user.name || "Anonymous"}</p>
                            <p className="text-[10px] text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] font-bold px-2 py-0.5 border-none ${
                          user.role === "INFLUENCER" ? "bg-purple-500/10 text-purple-600" :
                          user.role === "BUSINESS" ? "bg-blue-500/10 text-blue-600" :
                          user.role === "ADMIN" ? "bg-red-500/10 text-red-600" :
                          "bg-slate-500/10 text-slate-600"
                        }`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-bold text-foreground">₹{user.wallet?.balance || "0"}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground">₹{user.wallet?.totalEarned || "0"}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-accent"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500"><Ban className="h-4 w-4" /></Button>
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
    </motion.div>
  );
}
