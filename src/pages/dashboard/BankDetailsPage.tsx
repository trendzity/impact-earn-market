import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Smartphone, Plus, Trash2, CheckCircle2, 
  MoreVertical, Edit2, ShieldCheck, Loader2, Landmark
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getToken, getApiUrl } from "@/utils/auth";
import { toast } from "sonner";

const BankDetailsPage = () => {
  const [banks, setBanks] = useState<any[]>([]);
  const [upis, setUpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form States
  const [bankForm, setBankForm] = useState({ bankName: "", accountNumber: "", ifscCode: "", isDefault: false });
  const [upiForm, setUpiForm] = useState({ upiId: "", isDefault: false });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(getApiUrl("/accounts/bank"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBanks(data.banks);
        setUpis(data.upis);
      }
    } catch (error) {
      toast.error("Failed to load account details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveBank = async () => {
    try {
      const token = getToken();
      const url = editingId ? getApiUrl(`/accounts/bank/${editingId}`) : getApiUrl("/accounts/bank");
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(bankForm)
      });
      
      if (res.ok) {
        toast.success(editingId ? "Bank account updated" : "Bank account added");
        setIsBankModalOpen(false);
        setEditingId(null);
        setBankForm({ bankName: "", accountNumber: "", ifscCode: "", isDefault: false });
        fetchData();
      }
    } catch { toast.error("Action failed"); }
  };

  const handleSaveUpi = async () => {
    try {
      const token = getToken();
      const res = await fetch(getApiUrl("/accounts/upi"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(upiForm)
      });
      if (res.ok) {
        toast.success("UPI ID added");
        setIsUpiModalOpen(false);
        setUpiForm({ upiId: "", isDefault: false });
        fetchData();
      }
    } catch { toast.error("Action failed"); }
  };

  const handleDelete = async (type: "bank" | "upi", id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    try {
      const token = getToken();
      const res = await fetch(getApiUrl(`/accounts/${type}/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchData();
      }
    } catch { toast.error("Delete failed"); }
  };

  const handleSetDefault = async (type: "bank" | "upi", id: string) => {
    try {
      const token = getToken();
      const res = await fetch(getApiUrl(`/accounts/${type}/${id}/default`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Default set successfully");
        fetchData();
      }
    } catch { toast.error("Failed to set default"); }
  };

  const maskAccount = (num: string) => {
    if (!num) return "";
    return `****${num.slice(-4)}`;
  };

  if (loading && banks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-muted-foreground animate-pulse">Syncing your accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Payout Settings</h1>
        <p className="text-muted-foreground mt-1">Manage where you receive your platform earnings.</p>
      </div>

      <Tabs defaultValue="bank" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="bank" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Building2 className="w-4 h-4" /> Bank Accounts
            </TabsTrigger>
            <TabsTrigger value="upi" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Smartphone className="w-4 h-4" /> UPI IDs
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="bank" className="m-0">
              <Button onClick={() => { setEditingId(null); setIsBankModalOpen(true); }} className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Add Bank
              </Button>
            </TabsContent>
            <TabsContent value="upi" className="m-0">
              <Button onClick={() => setIsUpiModalOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Add UPI
              </Button>
            </TabsContent>
          </AnimatePresence>
        </div>

        <TabsContent value="bank" className="space-y-4 outline-none">
          {banks.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-bold">No bank accounts saved</p>
                  <p className="text-xs text-muted-foreground">Add your bank details to start receiving payouts.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banks.map((bank) => (
                <Card key={bank.id} className={`border-border/50 relative group transition-all hover:shadow-md ${bank.isDefault ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!bank.isDefault && (
                            <DropdownMenuItem onClick={() => handleSetDefault("bank", bank.id)} className="gap-2">
                              <CheckCircle2 className="w-4 h-4" /> Set Default
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => { setEditingId(bank.id); setBankForm(bank); setIsBankModalOpen(true); }} className="gap-2">
                            <Edit2 className="w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete("bank", bank.id)} className="gap-2 text-red-600 focus:text-red-600">
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {bank.bankName}
                        {bank.isDefault && <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none text-[10px] px-1.5 h-4 uppercase">Default</Badge>}
                      </h3>
                      <p className="text-sm font-mono tracking-wider">{maskAccount(bank.accountNumber)}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{bank.ifscCode}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upi" className="space-y-4 outline-none">
          {upis.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-bold">No UPI IDs saved</p>
                  <p className="text-xs text-muted-foreground">Add a UPI ID for lightning-fast payouts.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upis.map((upi) => (
                <Card key={upi.id} className={`border-border/50 relative group transition-all hover:shadow-md ${upi.isDefault ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/5 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-accent" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!upi.isDefault && (
                            <DropdownMenuItem onClick={() => handleSetDefault("upi", upi.id)} className="gap-2">
                              <CheckCircle2 className="w-4 h-4" /> Set Default
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete("upi", upi.id)} className="gap-2 text-red-600 focus:text-red-600">
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {upi.upiId}
                        {upi.isDefault && <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none text-[10px] px-1.5 h-4 uppercase">Default</Badge>}
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Personal UPI Account</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-primary/5 border-primary/20 shadow-none">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold">Secure Verification</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Your financial data is encrypted. We only share these details with our payment partners to process your withdrawals safely.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Bank Modal */}
      <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Bank Name</label>
              <Input placeholder="e.g. HDFC Bank" value={bankForm.bankName} onChange={e => setBankForm({...bankForm, bankName: e.target.value})} />
            </div>
            {!editingId && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</label>
                <Input placeholder="Enter Account Number" value={bankForm.accountNumber} onChange={e => setBankForm({...bankForm, accountNumber: e.target.value})} />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">IFSC Code</label>
              <Input placeholder="e.g. HDFC0001234" value={bankForm.ifscCode} onChange={e => setBankForm({...bankForm, ifscCode: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="def-bank"
                checked={bankForm.isDefault} 
                onChange={e => setBankForm({...bankForm, isDefault: e.target.checked})} 
                className="rounded border-border"
              />
              <label htmlFor="def-bank" className="text-xs font-bold text-muted-foreground">Set as Default Account</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsBankModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBank}>Save Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add UPI Modal */}
      <Dialog open={isUpiModalOpen} onOpenChange={setIsUpiModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add UPI ID</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">UPI ID</label>
              <Input placeholder="e.g. name@upi" value={upiForm.upiId} onChange={e => setUpiForm({...upiForm, upiId: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="def-upi"
                checked={upiForm.isDefault} 
                onChange={e => setUpiForm({...upiForm, isDefault: e.target.checked})} 
                className="rounded border-border"
              />
              <label htmlFor="def-upi" className="text-xs font-bold text-muted-foreground">Set as Default ID</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsUpiModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUpi}>Save UPI ID</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankDetailsPage;
