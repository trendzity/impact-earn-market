import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Globe, Palette, Eye, Save } from "lucide-react";

const ResellerWhitelabel = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">White-label Settings</h1>
        <p className="text-muted-foreground text-sm">Customize your branded panel for clients.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4 text-accent" /> Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Brand Name</Label>
                  <Input placeholder="Your Brand Name" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm">Logo</Label>
                  <div className="mt-1.5 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload logo</p>
                    <p className="text-xs text-muted-foreground">PNG, SVG • Max 2MB</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Favicon</Label>
                  <div className="mt-1.5 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent/50 transition-colors cursor-pointer">
                    <p className="text-sm text-muted-foreground">Upload favicon (32x32)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4 text-accent" /> Custom Domain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm">Domain</Label>
                  <Input placeholder="panel.yourbrand.com" className="mt-1.5" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Not Configured</Badge>
                  <span className="text-xs text-muted-foreground">Point your CNAME to panel.trendzity.com</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4 text-accent" /> Theme Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Primary Color</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="h-9 w-9 rounded-md bg-accent border border-border" />
                      <Input defaultValue="#E53E3E" className="h-9 font-mono text-sm" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Background</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="h-9 w-9 rounded-md bg-background border border-border" />
                      <Input defaultValue="#0A0A0A" className="h-9 font-mono text-sm" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-border/50 h-fit sticky top-20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" /> Preview
                </CardTitle>
                <Badge variant="outline">Live Preview</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <div className="h-6 w-6 rounded bg-accent/20" />
                  <span className="text-sm font-semibold text-foreground">Your Brand</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 rounded-lg bg-accent/10 border border-accent/20" />
                  <div className="h-16 rounded-lg bg-muted/50 border border-border" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-8 rounded bg-muted/50" />
                  <div className="h-8 rounded bg-muted/50" />
                  <div className="h-8 rounded bg-muted/50" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                  <Save className="h-4 w-4" /> Save & Publish
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResellerWhitelabel;
