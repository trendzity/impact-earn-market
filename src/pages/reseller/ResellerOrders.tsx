import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter } from "lucide-react";

const orders = [
  { id: "#4821", client: "Arjun Media", service: "Instagram Followers", qty: "5,000", cost: "₹750", sell: "₹1,200", profit: "₹450", status: "Processing" },
  { id: "#4820", client: "SocialBoost", service: "YouTube Views", qty: "10,000", cost: "₹1,200", sell: "₹2,000", profit: "₹800", status: "Completed" },
  { id: "#4819", client: "DigiGrow", service: "Telegram Members", qty: "2,000", cost: "₹600", sell: "₹1,100", profit: "₹500", status: "Pending" },
  { id: "#4818", client: "ViralWave", service: "Instagram Likes", qty: "20,000", cost: "₹400", sell: "₹800", profit: "₹400", status: "Completed" },
  { id: "#4817", client: "BrandPush", service: "YouTube Subscribers", qty: "1,000", cost: "₹2,500", sell: "₹4,200", profit: "₹1,700", status: "Processing" },
  { id: "#4816", client: "Arjun Media", service: "Instagram Reels Views", qty: "50,000", cost: "₹1,000", sell: "₹1,800", profit: "₹800", status: "Completed" },
];

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  Processing: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  Completed: "bg-green-500/10 text-green-500 border-green-500/30",
};

const ResellerOrders = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground text-sm">Manage all client orders and track delivery status.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-base">All Orders</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search orders..." className="pl-8 h-8 text-sm w-48 bg-muted/50 border-0" />
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Filter className="h-3.5 w-3.5" /> Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Service</TableHead>
                  <TableHead className="hidden lg:table-cell">Qty</TableHead>
                  <TableHead className="hidden lg:table-cell">Cost</TableHead>
                  <TableHead>Sell Price</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                    <TableCell>{order.client}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.service}</TableCell>
                    <TableCell className="hidden lg:table-cell">{order.qty}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{order.cost}</TableCell>
                    <TableCell className="font-medium">{order.sell}</TableCell>
                    <TableCell className="font-semibold text-green-500">{order.profit}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor[order.status]}>{order.status}</Badge>
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

export default ResellerOrders;
