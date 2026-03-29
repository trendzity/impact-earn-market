import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, MoreHorizontal, UserPlus } from "lucide-react";

const clients = [
  { name: "Arjun Media", email: "arjun@media.co", orders: 142, revenue: "₹2,84,000", status: "Active" },
  { name: "SocialBoost Agency", email: "info@socialboost.in", orders: 98, revenue: "₹1,56,200", status: "Active" },
  { name: "DigiGrow", email: "hello@digigrow.com", orders: 67, revenue: "₹89,400", status: "Active" },
  { name: "ViralWave", email: "contact@viralwave.in", orders: 45, revenue: "₹62,800", status: "Inactive" },
  { name: "BrandPush", email: "team@brandpush.co", orders: 34, revenue: "₹48,600", status: "Active" },
];

const ResellerClients = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground text-sm">Manage your client base and track their activity.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
          <UserPlus className="h-4 w-4" /> Add Client
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">All Clients</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search clients..." className="pl-8 h-8 text-sm w-48 bg-muted/50 border-0" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.name} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{client.email}</TableCell>
                    <TableCell>{client.orders}</TableCell>
                    <TableCell className="font-medium">{client.revenue}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={client.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-muted text-muted-foreground"}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResellerClients;
