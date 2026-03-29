import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Percent, Save } from "lucide-react";

const pricingItems = [
  { service: "Instagram Followers", base: 150, yourPrice: 250, unit: "/1K" },
  { service: "Instagram Likes", base: 80, yourPrice: 150, unit: "/1K" },
  { service: "Instagram Reels Views", base: 20, yourPrice: 45, unit: "/1K" },
  { service: "YouTube Views", base: 120, yourPrice: 220, unit: "/1K" },
  { service: "YouTube Subscribers", base: 2500, yourPrice: 4200, unit: "/1K" },
  { service: "Telegram Members", base: 300, yourPrice: 550, unit: "/1K" },
  { service: "Website Traffic", base: 50, yourPrice: 100, unit: "/1K" },
];

const ResellerPricing = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Pricing Control</h1>
        <p className="text-muted-foreground text-sm">Set your selling prices and manage profit margins.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-base">Global Margin</CardTitle>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Set margin %:</Label>
                <div className="relative w-24">
                  <Input defaultValue="65" className="h-8 text-sm pr-7" />
                  <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <Button size="sm" className="h-8 bg-accent hover:bg-accent/90 text-accent-foreground gap-1">
                  <Save className="h-3.5 w-3.5" /> Apply
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Per-Service Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Base Price (₹)</TableHead>
                  <TableHead>Your Price (₹)</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingItems.map((item) => {
                  const margin = Math.round(((item.yourPrice - item.base) / item.base) * 100);
                  const profit = item.yourPrice - item.base;
                  return (
                    <TableRow key={item.service} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">{item.service}</TableCell>
                      <TableCell className="text-muted-foreground">₹{item.base}{item.unit}</TableCell>
                      <TableCell>
                        <Input defaultValue={item.yourPrice} className="h-8 text-sm w-24" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                          {margin}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-500">₹{profit}{item.unit}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                <Save className="h-4 w-4" /> Save Pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResellerPricing;
