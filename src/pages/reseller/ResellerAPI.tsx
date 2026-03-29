import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Code2, ExternalLink, Lock } from "lucide-react";

const endpoints = [
  { method: "POST", path: "/api/v1/order", desc: "Place a new order" },
  { method: "GET", path: "/api/v1/order/{id}", desc: "Get order status" },
  { method: "GET", path: "/api/v1/services", desc: "List available services" },
  { method: "GET", path: "/api/v1/balance", desc: "Check wallet balance" },
  { method: "POST", path: "/api/v1/order/cancel", desc: "Cancel an order" },
];

const ResellerAPI = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">API & Integrations</h1>
        <p className="text-muted-foreground text-sm">Connect your panel to Trendzity via API.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-accent" />
              <CardTitle className="text-base">API Key</CardTitle>
            </div>
            <CardDescription>Use this key to authenticate API requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Input
                value="tzr_live_a8f2k9d4m1n7x3b6c0e5..."
                readOnly
                className="font-mono text-sm bg-muted/50"
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-accent hover:text-accent">
                  <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-accent" />
                <CardTitle className="text-base">API Endpoints</CardTitle>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> Full Docs
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {endpoints.map((ep) => (
                <div key={ep.path} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <Badge className={`font-mono text-[10px] ${ep.method === "POST" ? "bg-accent/10 text-accent border-accent/30" : "bg-blue-500/10 text-blue-500 border-blue-500/30"}`} variant="outline">
                    {ep.method}
                  </Badge>
                  <code className="text-sm font-mono text-foreground flex-1">{ep.path}</code>
                  <span className="text-xs text-muted-foreground hidden sm:block">{ep.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Example Request</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 rounded-lg bg-muted/50 border border-border/50 overflow-x-auto text-sm font-mono text-foreground">
{`curl -X POST https://api.trendzity.com/v1/order \\
  -H "Authorization: Bearer tzr_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": 1,
    "link": "https://instagram.com/user",
    "quantity": 1000
  }'`}
            </pre>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResellerAPI;
