import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Pause, Play, Eye } from "lucide-react";
import { motion } from "framer-motion";

const campaigns = [
  { name: "Instagram Follow Boost", brand: "FashionHub", budget: "₹50,000", spend: "₹32,400", status: "Active" },
  { name: "YT Subscribe & Like", brand: "TechReviews", budget: "₹1,00,000", spend: "₹0", status: "Pending" },
  { name: "Telegram Join Campaign", brand: "CryptoAlpha", budget: "₹25,000", spend: "₹24,800", status: "Completed" },
  { name: "App Install Drive", brand: "FinApp", budget: "₹75,000", spend: "₹41,200", status: "Active" },
  { name: "Twitter Retweet Wave", brand: "StartupXYZ", budget: "₹30,000", spend: "₹0", status: "Pending" },
  { name: "IG Story Views", brand: "BeautyBrand", budget: "₹40,000", spend: "₹38,500", status: "Active" },
];

export default function AdminCampaigns() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Campaign Management</h1>
        <p className="text-sm text-muted-foreground">Review and manage all platform campaigns</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Campaigns", value: "342" },
          { label: "Active", value: "187" },
          { label: "Pending Approval", value: "23" },
          { label: "Total Spend", value: "₹45.6L" },
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
          <CardTitle className="text-sm font-medium">All Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Campaign</TableHead>
                <TableHead className="text-xs">Brand</TableHead>
                <TableHead className="text-xs">Budget</TableHead>
                <TableHead className="text-xs">Spend</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{c.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.brand}</TableCell>
                  <TableCell className="text-sm font-medium">{c.budget}</TableCell>
                  <TableCell className="text-sm">{c.spend}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-normal ${
                      c.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      c.status === "Pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                      "bg-muted text-muted-foreground border-border"
                    }`}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {c.status === "Pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500"><Check className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-accent"><X className="h-3.5 w-3.5" /></Button>
                        </>
                      )}
                      {c.status === "Active" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pause className="h-3.5 w-3.5" /></Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
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
