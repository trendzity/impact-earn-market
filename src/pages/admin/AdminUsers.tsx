import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal, Eye, Ban, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const users = [
  { id: "USR-001", name: "Priya Kumari", role: "Creator", earnings: "₹12,450", status: "Active", fraudScore: 5 },
  { id: "USR-002", name: "Rahul Sharma", role: "Influencer", earnings: "₹45,200", status: "Active", fraudScore: 12 },
  { id: "USR-003", name: "Deepak Verma", role: "Reseller", earnings: "₹1,28,000", status: "Active", fraudScore: 3 },
  { id: "USR-004", name: "Sneha Patel", role: "Creator", earnings: "₹8,900", status: "Flagged", fraudScore: 72 },
  { id: "USR-005", name: "Amit Kumar", role: "Business", earnings: "₹0", status: "Active", fraudScore: 0 },
  { id: "USR-006", name: "Riya Gupta", role: "Creator", earnings: "₹3,200", status: "Suspended", fraudScore: 88 },
  { id: "USR-007", name: "Vikash Singh", role: "Influencer", earnings: "₹22,100", status: "Active", fraudScore: 8 },
  { id: "USR-008", name: "Pooja Reddy", role: "Creator", earnings: "₹6,750", status: "Active", fraudScore: 15 },
];

export default function AdminUsers() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage all platform users</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">All Users ({users.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-8 h-8 text-sm w-48 bg-muted/50 border-0" />
              </div>
              <Select>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">User ID</TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Earnings</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Fraud Score</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-xs font-mono text-muted-foreground">{user.id}</TableCell>
                  <TableCell className="text-sm font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{user.earnings}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-normal ${
                      user.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      user.status === "Flagged" ? "bg-accent/10 text-accent border-accent/20" :
                      "bg-muted text-muted-foreground border-border"
                    }`}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${user.fraudScore > 60 ? "bg-accent" : user.fraudScore > 30 ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${user.fraudScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{user.fraudScore}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Ban className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Wallet className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
