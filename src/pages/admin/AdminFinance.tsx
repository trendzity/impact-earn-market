import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const financeData = [
  { month: "Jan", deposits: 500000, payouts: 350000 },
  { month: "Feb", deposits: 620000, payouts: 410000 },
  { month: "Mar", deposits: 780000, payouts: 520000 },
  { month: "Apr", deposits: 850000, payouts: 580000 },
  { month: "May", deposits: 920000, payouts: 640000 },
  { month: "Jun", deposits: 1100000, payouts: 750000 },
];

const transactions = [
  { date: "27 Mar", user: "Priya K.", type: "Commission", amount: "₹250", status: "Completed" },
  { date: "27 Mar", user: "TechBrand", type: "Deposit", amount: "₹50,000", status: "Completed" },
  { date: "27 Mar", user: "Rahul S.", type: "Withdrawal", amount: "₹5,000", status: "Processing" },
  { date: "26 Mar", user: "FashionHub", type: "Deposit", amount: "₹25,000", status: "Completed" },
  { date: "26 Mar", user: "Deepak V.", type: "Withdrawal", amount: "₹12,000", status: "Completed" },
  { date: "26 Mar", user: "Platform", type: "Commission", amount: "₹4,800", status: "Completed" },
];

const chartConfig = {
  deposits: { label: "Deposits", color: "hsl(var(--accent))" },
  payouts: { label: "Payouts", color: "hsl(var(--muted-foreground))" },
};

export default function AdminFinance() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Wallet & Finance</h1>
        <p className="text-sm text-muted-foreground">Financial overview and transaction history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: "Total Deposits", value: "₹47,70,000", color: "text-green-500" },
          { label: "Total Payouts", value: "₹32,50,000", color: "text-accent" },
          { label: "Platform Revenue", value: "₹15,20,000", color: "text-foreground" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-5">
              <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Deposits vs Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={financeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="deposits" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="payouts" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">User</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                  <TableCell className="text-sm font-medium">{t.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal">{t.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm font-bold">{t.amount}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-normal ${
                      t.status === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}>{t.status}</Badge>
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
