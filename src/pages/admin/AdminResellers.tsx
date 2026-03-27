import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Ban, Check } from "lucide-react";
import { motion } from "framer-motion";

const resellers = [
  { name: "GrowthAgency", clients: 45, revenue: "₹4,50,000", apiCalls: "12.4K", status: "Active" },
  { name: "SocialBoost Pro", clients: 120, revenue: "₹12,80,000", apiCalls: "45.2K", status: "Active" },
  { name: "InfluenceHub", clients: 28, revenue: "₹2,10,000", apiCalls: "8.1K", status: "Pending" },
  { name: "MediaWorks", clients: 67, revenue: "₹6,75,000", apiCalls: "22.8K", status: "Active" },
  { name: "QuickGrow", clients: 8, revenue: "₹45,000", apiCalls: "1.2K", status: "Suspended" },
];

export default function AdminResellers() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Reseller Management</h1>
        <p className="text-sm text-muted-foreground">Manage reseller accounts and performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Resellers", value: "48" },
          { label: "Active", value: "41" },
          { label: "Revenue Generated", value: "₹26.6L" },
          { label: "API Calls/Day", value: "89.7K" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-lg font-bold font-display text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Resellers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Reseller</TableHead>
                <TableHead className="text-xs">Clients</TableHead>
                <TableHead className="text-xs">Revenue</TableHead>
                <TableHead className="text-xs">API Usage</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resellers.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{r.name}</TableCell>
                  <TableCell className="text-sm">{r.clients}</TableCell>
                  <TableCell className="text-sm font-bold">{r.revenue}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{r.apiCalls}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-normal ${
                      r.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      r.status === "Pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                      "bg-muted text-muted-foreground border-border"
                    }`}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                      {r.status === "Pending" && <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500"><Check className="h-3.5 w-3.5" /></Button>}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-accent"><Ban className="h-3.5 w-3.5" /></Button>
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
