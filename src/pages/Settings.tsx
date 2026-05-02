import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Lock, Mail, Loader2, Save, MapPin, Phone, Bell, MessageSquare, Smartphone, BellRing } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [areaOfResidence, setAreaOfResidence] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification preferences state
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefInApp, setPrefInApp] = useState(true);
  const [prefSms, setPrefSms] = useState(false);
  const [prefPush, setPrefPush] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id ?? "")
        .single();
      if (error) throw error;
      if (data) {
        setDisplayName(data.display_name || "");
        setFullName((data as any).full_name || "");
        setPhone((data as any).phone_number || "");
        setAreaOfResidence((data as any).area_of_residence || "");
        setDeliveryAddress((data as any).delivery_address || "");
      }
      return data;
    },
    enabled: !!user,
  });

  // Load notification preferences (auto-create defaults on first visit)
  useQuery({
    queryKey: ["notification-preferences", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("notification_preferences" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setPrefEmail((data as any).message_email);
        setPrefInApp((data as any).message_in_app);
        setPrefSms((data as any).message_sms);
        setPrefPush((data as any).message_push);
      }
      return data;
    },
    enabled: !!user,
  });

  const saveNotifications = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from("notification_preferences" as any)
        .upsert(
          {
            user_id: user.id,
            message_email: prefEmail,
            message_in_app: prefInApp,
            message_sms: prefSms,
            message_push: prefPush,
          } as any,
          { onConflict: "user_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences", user?.id] });
      toast({ title: "Preferences saved", description: "Your notification settings have been updated." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          full_name: fullName,
          phone_number: phone,
          area_of_residence: areaOfResidence,
          delivery_address: deliveryAddress,
        } as any)
        .eq("user_id", user?.id ?? "");
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Profile updated", description: "Your display name has been saved." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "Your password has been changed." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-card-foreground">Profile</h3>
              <p className="text-xs text-muted-foreground">Manage your account information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-card-foreground">Email</Label>
              <Input value={user?.email || ""} disabled className="bg-muted border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-card-foreground">Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-card-foreground">Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="bg-secondary border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-card-foreground">Phone Number</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+31 6 1234 5678"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-card-foreground">Area of Residence</Label>
                <Input
                  value={areaOfResidence}
                  onChange={(e) => setAreaOfResidence(e.target.value)}
                  placeholder="e.g., Amsterdam, Netherlands"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-card-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Delivery Address
              </Label>
              <Textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={"Street address, building/unit\nCity, State/Province, Postal code\nCountry"}
                rows={3}
                className="bg-secondary border-border resize-none"
              />
              <p className="text-[11px] text-muted-foreground">This address will be used as default for your sourcing requests.</p>
            </div>
            <Button
              onClick={() => updateProfile.mutate()}
              disabled={updateProfile.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Profile
            </Button>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-card-foreground">Notifications</h3>
              <p className="text-xs text-muted-foreground">Choose how you want to be notified about new messages on your active sourcing requests</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-card-foreground font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">Receive an email at {user?.email || "your account email"}</p>
                </div>
              </div>
              <Switch checked={prefEmail} onCheckedChange={setPrefEmail} />
            </div>

            {/* In-app */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-card-foreground font-medium">In-app</p>
                  <p className="text-xs text-muted-foreground">Show unread badges and toasts inside the dashboard</p>
                </div>
              </div>
              <Switch checked={prefInApp} onCheckedChange={setPrefInApp} />
            </div>

            {/* SMS — coming soon */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 opacity-70">
              <div className="flex items-start gap-3">
                <Smartphone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-card-foreground font-medium flex items-center gap-2">
                    SMS
                    <span className="text-[10px] uppercase tracking-wide rounded-full bg-muted px-2 py-0.5 text-muted-foreground border border-border">Coming soon</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Text messages to your verified phone number</p>
                </div>
              </div>
              <Switch checked={prefSms} onCheckedChange={setPrefSms} disabled />
            </div>

            {/* Push — coming soon */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 opacity-70">
              <div className="flex items-start gap-3">
                <BellRing className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-card-foreground font-medium flex items-center gap-2">
                    Push
                    <span className="text-[10px] uppercase tracking-wide rounded-full bg-muted px-2 py-0.5 text-muted-foreground border border-border">Coming soon</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Browser and mobile push notifications</p>
                </div>
              </div>
              <Switch checked={prefPush} onCheckedChange={setPrefPush} disabled />
            </div>

            <Button
              onClick={() => saveNotifications.mutate()}
              disabled={saveNotifications.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saveNotifications.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Preferences
            </Button>
          </div>
        </motion.div>

        {/* Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-card-foreground">Change Password</h3>
              <p className="text-xs text-muted-foreground">Update your account password</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-card-foreground">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-card-foreground">Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border"
              />
            </div>
            <Button
              onClick={updatePassword}
              disabled={!newPassword || !confirmPassword}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Update Password
            </Button>
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-card-foreground">Account</h3>
              <p className="text-xs text-muted-foreground">Manage your account session</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div>
              <p className="text-sm text-card-foreground font-medium">Sign out of your account</p>
              <p className="text-xs text-muted-foreground">You'll need to sign in again to access the dashboard</p>
            </div>
            <Button variant="destructive" onClick={signOut} className="shrink-0">
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
