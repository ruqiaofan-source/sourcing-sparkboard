import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Send, Loader2, Check, Leaf, LeafyGreen, Award, Sparkles, ShieldCheck, Globe, Zap, CheckCircle2, ArrowUpRight, Camera, Shirt, Tag, PackageCheck, Truck, Search, Scissors, Ruler, Box, Layers, ScanLine, Video, ImagePlus, Palette, Stamp, Shield, Wrench, Package, Warehouse, ShoppingBag, Plug, Brush, ChevronDown } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import SourcingAssistant from "@/components/SourcingAssistant";

const currencies = ["EUR", "USD", "GBP", "CNY", "JPY"];
const countries = [
  "Netherlands", "Germany", "France", "Belgium", "United Kingdom",
  "Spain", "Italy", "Austria", "Sweden", "Denmark", "Norway", "Finland",
  "Poland", "Portugal", "Ireland", "Switzerland",
  "United States", "Canada", "Australia",
  "Japan", "South Korea", "Singapore",
  "United Arab Emirates", "Brazil", "Mexico", "India", "Other",
];

const ecoOptions = [
  { value: "none", label: "None", desc: "No eco-friendly requirements", icon: null, color: "border-border bg-secondary/20", activeColor: "border-muted-foreground/40 bg-muted/20 ring-1 ring-muted-foreground/20", iconColor: "text-muted-foreground" },
  { value: "preferred", label: "Preferred", desc: "Prioritize eco-friendly options when available", icon: Leaf, color: "border-border bg-secondary/20", activeColor: "border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/25", iconColor: "text-emerald-400" },
  { value: "required", label: "Required", desc: "Only eco-friendly materials and processes", icon: LeafyGreen, color: "border-border bg-secondary/20", activeColor: "border-emerald-400/50 bg-emerald-500/[0.10] ring-1 ring-emerald-400/35", iconColor: "text-emerald-300" },
  { value: "certified_only", label: "Certified Only", desc: "Must have official certifications (OEKO-TEX, FSC...)", icon: Award, color: "border-border bg-secondary/20", activeColor: "border-green-400/60 bg-green-500/[0.12] ring-1 ring-green-400/40 shadow-[0_0_20px_-5px_rgba(34,197,94,0.2)]", iconColor: "text-green-300" },
];

const categoryColors: Record<string, { border: string; bg: string; ring: string; icon: string; badge: string }> = {
  "Quality & Inspection": { border: "border-blue-500/40", bg: "bg-blue-500/[0.06]", ring: "ring-blue-500/25", icon: "text-blue-400", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  "Photography & Media": { border: "border-amber-500/40", bg: "bg-amber-500/[0.06]", ring: "ring-amber-500/25", icon: "text-amber-400", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  "Branding & Labels": { border: "border-violet-500/40", bg: "bg-violet-500/[0.06]", ring: "ring-violet-500/25", icon: "text-violet-400", badge: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  "Packaging & Protection": { border: "border-emerald-500/40", bg: "bg-emerald-500/[0.06]", ring: "ring-emerald-500/25", icon: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  "Garment Services": { border: "border-rose-500/40", bg: "bg-rose-500/[0.06]", ring: "ring-rose-500/25", icon: "text-rose-400", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  "Logistics & Fulfillment": { border: "border-cyan-500/40", bg: "bg-cyan-500/[0.06]", ring: "ring-cyan-500/25", icon: "text-cyan-400", badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  "Product Sourcing": { border: "border-orange-500/40", bg: "bg-orange-500/[0.06]", ring: "ring-orange-500/25", icon: "text-orange-400", badge: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
};

const serviceAddons = [
  // Quality & Inspection
  { id: "standard_inspection", label: "Standard Quality Inspection", desc: "Pre-warehouse inspection to verify product quality and condition", icon: ScanLine, category: "Quality & Inspection" },
  { id: "detailed_inspection", label: "Detailed Quality Inspection", desc: "Thorough inspection with detailed reporting on defects and issues", icon: Shield, category: "Quality & Inspection" },
  { id: "outer_packaging_check", label: "Outer Packaging Check", desc: "Inspect outer packaging condition before warehousing", icon: Box, category: "Quality & Inspection" },
  { id: "electrical_test", label: "Electrical Power-on Test", desc: "Functional test for 3C/electronic products before warehousing", icon: Plug, category: "Quality & Inspection" },
  { id: "garment_measurement", label: "Garment Measurement", desc: "Measure key dimensions and compare with seller specs", icon: Ruler, category: "Quality & Inspection" },

  // Photography & Media
  { id: "standard_photos", label: "Standard Product Photos", desc: "3 photos per SKU: front/back, product & accessories, packaging", icon: Camera, category: "Photography & Media" },
  { id: "detailed_photos", label: "Detailed Product Photos", desc: "Close-up high-detail photography for product listings", icon: ImagePlus, category: "Photography & Media" },
  { id: "product_video", label: "Product Video (360)", desc: "360-degree product video for enhanced listing presentation", icon: Video, category: "Photography & Media" },
  { id: "parcel_photo", label: "Parcel Photo", desc: "Pre-shipment photo of your packed parcel for verification", icon: Camera, category: "Photography & Media" },
  { id: "model_photos", label: "Model Try-on Photos", desc: "Real model try-on photos for apparel/shoe products", icon: Camera, category: "Photography & Media" },

  // Branding & Labels
  { id: "custom_packaging_bags", label: "Custom Packaging Bags", desc: "Branded packaging bags with your logo (min 200 pcs)", icon: PackageCheck, category: "Branding & Labels" },
  { id: "neck_labels", label: "Neck Label Customization", desc: "Custom branded neck labels for apparel (min 200 pcs)", icon: Tag, category: "Branding & Labels" },
  { id: "hangtag", label: "Hangtag Customization", desc: "Branded hangtags with your logo (min 200 pcs)", icon: Tag, category: "Branding & Labels" },
  { id: "product_labeling", label: "Product Labeling", desc: "Print and attach custom labels to your products", icon: Stamp, category: "Branding & Labels" },
  { id: "parcel_labeling", label: "Parcel Label Printing", desc: "Print and attach labels to outer parcel packaging", icon: Stamp, category: "Branding & Labels" },
  { id: "logo_sewing", label: "Logo Sewing", desc: "Sew branded logo labels onto products", icon: Palette, category: "Branding & Labels" },
  { id: "tag_switch", label: "Tag Switch / Removal", desc: "Remove original tags and optionally replace with yours", icon: Scissors, category: "Branding & Labels" },
  { id: "oem_odm", label: "OEM/ODM Customization", desc: "Full custom product development with factory coordination", icon: Wrench, category: "Branding & Labels" },

  // Packaging & Protection
  { id: "plastic_sealing", label: "Plastic Sealing", desc: "Heat-seal products in plastic for protection", icon: Package, category: "Packaging & Protection" },
  { id: "bubble_wrap", label: "Bubble Column Packaging", desc: "Bubble film wrapping for fragile item protection", icon: Layers, category: "Packaging & Protection" },
  { id: "foam_filling", label: "Foam Board Filling", desc: "Foam inserts to fill gaps and prevent movement in box", icon: Box, category: "Packaging & Protection" },
  { id: "pearl_cotton", label: "Pearl Cotton Packaging", desc: "Standard pearl cotton wrap for product protection", icon: Package, category: "Packaging & Protection" },
  { id: "custom_pearl_cotton", label: "Custom Pearl Cotton", desc: "Custom-sized pearl cotton packaging for exact product fit", icon: Package, category: "Packaging & Protection" },
  { id: "vacuum_bag", label: "Vacuum Compression Bag", desc: "Vacuum-seal products to reduce volume and protect", icon: Package, category: "Packaging & Protection" },
  { id: "stretch_film", label: "Stretch Film Wrapping", desc: "Wrap parcels in stretch film for extra protection", icon: Package, category: "Packaging & Protection" },
  { id: "corner_protector", label: "Corner Protectors", desc: "Cardboard corner guards for box shipments", icon: Shield, category: "Packaging & Protection" },
  { id: "wooden_crate", label: "Wooden Crate Reinforcement", desc: "Heavy-duty wooden crate for oversized/fragile items", icon: Box, category: "Packaging & Protection" },
  { id: "moisture_bag", label: "Moisture-proof Bag", desc: "Moisture-proof bag protection for parcel exteriors", icon: Shield, category: "Packaging & Protection" },
  { id: "gift_wrap", label: "Gift Paper Packaging", desc: "Wrap products in gift paper for a premium unboxing", icon: ShoppingBag, category: "Packaging & Protection" },
  { id: "dust_bag", label: "Dust Bag Packaging", desc: "Protective dust bags for products (handbags, shoes, etc.)", icon: ShoppingBag, category: "Packaging & Protection" },
  { id: "pallet_packaging", label: "Pallet Packaging", desc: "Export-standard pallet wrapping for large shipments", icon: Warehouse, category: "Packaging & Protection" },

  // Garment Services
  { id: "garment_ironing", label: "Garment Ironing", desc: "Professional ironing and pressing for wrinkle-free products", icon: Shirt, category: "Garment Services" },
  { id: "garment_reinforcement", label: "Garment Reinforcement", desc: "Cardboard + clip folding to prevent wrinkles in transit", icon: PackageCheck, category: "Garment Services" },
  { id: "garment_pocket_opening", label: "Pocket Opening", desc: "Open all sealed pockets on garments for better UX", icon: Scissors, category: "Garment Services" },
  { id: "thread_trimming", label: "Thread Trimming", desc: "Trim excess threads for a clean product finish", icon: Scissors, category: "Garment Services" },
  { id: "stain_cleaning", label: "Stain Cleaning", desc: "Clean and dry stained products before packaging", icon: Brush, category: "Garment Services" },
  { id: "button_opening", label: "Button Hole Opening", desc: "Open all unopened button holes on garments", icon: Scissors, category: "Garment Services" },
  { id: "zipper_bag_replace", label: "No-logo Zipper Bag", desc: "Replace branded zipper bags with plain unbranded ones", icon: Package, category: "Garment Services" },

  // Logistics & Fulfillment
  { id: "priority_procurement", label: "Priority Procurement", desc: "Fast-track your order with expedited processing", icon: Zap, category: "Logistics & Fulfillment" },
  { id: "priority_shipping", label: "Priority Shipping", desc: "Prioritize international parcel processing and dispatch", icon: Truck, category: "Logistics & Fulfillment" },
  { id: "custom_logistics_plan", label: "Custom Logistics Plan", desc: "Tailored shipping solution designed for your specific order", icon: Truck, category: "Logistics & Fulfillment" },
  { id: "packing_list", label: "Packing List Printing", desc: "Printed packing list included with each parcel", icon: Stamp, category: "Logistics & Fulfillment" },
  { id: "commercial_invoice", label: "Commercial Invoice", desc: "Printed commercial invoice for customs clearance", icon: Stamp, category: "Logistics & Fulfillment" },
  { id: "marketing_material", label: "Marketing Material Insert", desc: "Include your promotional materials in each parcel", icon: Palette, category: "Logistics & Fulfillment" },

  // Product Sourcing
  { id: "source_finding", label: "Source Finding", desc: "Find matching suppliers based on product links or images", icon: Search, category: "Product Sourcing" },
  { id: "source_finding_pro", label: "Source Finding (Pro)", desc: "Professional multi-source comparison with price negotiation", icon: Search, category: "Product Sourcing" },
  { id: "source_replacement", label: "Source Replacement", desc: "Find alternative suppliers when original source is unavailable", icon: Search, category: "Product Sourcing" },
  { id: "packaging_material_procurement", label: "Packaging Material Procurement", desc: "Source and stock custom packaging materials in warehouse", icon: Warehouse, category: "Product Sourcing" },
];

const TOTAL_STEPS = 8;

const NewRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [customCountry, setCustomCountry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [addonSearch, setAddonSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    budget_per_unit: "",
    currency: "EUR",
    eco_friendly: "none",
  });
  const [attachments, setAttachments] = useState<string[]>([]);

  // Fetch user profile for delivery address
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile-for-request", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return form.title.trim().length > 0;
      case 2: return form.description.trim().length > 0;
      case 3: return form.quantity.trim().length > 0 && parseInt(form.quantity) > 0;
      case 4: return form.budget_per_unit.trim().length > 0 && parseFloat(form.budget_per_unit) > 0;
      case 5: return true;
      case 6: return true; // add-ons optional
      case 7: return true; // photos optional
      case 8: return true; // review
      default: return false;
    }
  };

  const goTo = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };
  const next = () => { if (canProceed() && step < TOTAL_STEPS) goTo(step + 1); };
  const prev = () => { if (step > 1) goTo(step - 1); };

  const profileAddress = (userProfile as any)?.delivery_address || "";

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Ensure profile exists (safety net for users who signed up before trigger was active)
      await supabase.from("profiles").upsert(
        { user_id: user.id, display_name: user.email?.split("@")[0] || "User", email: user.email || "" } as any,
        { onConflict: "user_id" }
      );

      const { error } = await supabase.from("sourcing_requests").insert({
        user_id: user.id,
        title: form.title,
        description: form.description,
        quantity: parseInt(form.quantity) || 1,
        budget_per_unit: parseFloat(form.budget_per_unit) || 0,
        currency: form.currency,
        eco_friendly: form.eco_friendly,
        delivery_country: "",
        delivery_address: profileAddress,
        status: "pending",
        attachment_paths: attachments,
        service_addons: selectedAddons,
      } as any);
      if (error) throw error;

      // Notify admin of new sourcing request
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "admin-notification",
            recipientEmail: "admin@equilinq.eu",
            idempotencyKey: `admin-new-request-${user.id}-${Date.now()}`,
            templateData: {
              eventType: "new_sourcing_request",
              title: "New sourcing request submitted",
              summary: `${user.email || "A customer"} submitted a new sourcing request.`,
              details: {
                Title: form.title,
                Quantity: form.quantity,
                "Budget per unit": `${form.budget_per_unit} ${form.currency}`,
                "Customer email": user.email,
              },
              link: `${window.location.origin}/admin/requests`,
            },
          },
        });
      } catch (notifyErr) {
        console.error("Failed to send admin request notification:", notifyErr);
      }

      setSubmitted(true);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && step < TOTAL_STEPS) {
      e.preventDefault();
      next();
    }
  };

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 60 : -60, scale: 0.96 }),
    center: { opacity: 1, y: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -60 : 60, scale: 0.96 }),
  };

  // Success screen
  if (submitted) {
    return (
      <DashboardLayout title="Request Submitted">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative mb-8"
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, hsl(239 100% 65% / 0.2), transparent 70%)" }}
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.4, 1.2] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute -inset-4 rounded-full border border-primary/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0, 1, 0.3] }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
            <motion.div
              className="absolute -inset-8 rounded-full border border-primary/10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0, 0.8, 0.15] }}
              transition={{ duration: 1.4, delay: 0.5 }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="relative z-10 w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
            >
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-foreground"
          >
            Request submitted!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="text-muted-foreground mt-3 max-w-md text-base"
          >
            We'll start sourcing <span className="text-foreground font-medium">{form.title}</span> right away.
            Expect your first quotes within 3–5 business days.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {[
              `${parseInt(form.quantity).toLocaleString()} units`,
              `${form.currency} ${parseFloat(form.budget_per_unit).toFixed(2)}/unit`,
              profileAddress ? profileAddress.split("\n")[0] : "Using account address",
              ...(selectedAddons.length > 0 ? [`${selectedAddons.length} add-on(s)`] : []),
            ].map((pill, i) => (
              <motion.span
                key={pill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="px-3 py-1.5 rounded-full border border-border bg-secondary/30 text-xs text-muted-foreground"
              >
                {pill}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex gap-3 mt-10"
          >
            <Button
              variant="outline"
              onClick={() => navigate("/sourcing-requests")}
              className="rounded-xl h-11 px-6"
            >
              View my requests
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setForm({ title: "", description: "", quantity: "", budget_per_unit: "", currency: "EUR", eco_friendly: "none" });
                setAttachments([]);
                setSelectedAddons([]);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 px-6 shadow-[0_0_25px_-5px_hsl(239_100%_65%/0.35)]"
            >
              Submit another
            </Button>
          </motion.div>

          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 3 === 0 ? "hsl(239 100% 65%)" : i % 3 === 1 ? "hsl(262 83% 58%)" : "hsl(160 84% 39%)",
                top: "40%",
                left: "50%",
              }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos((i * 30 * Math.PI) / 180) * (80 + Math.random() * 60),
                y: Math.sin((i * 30 * Math.PI) / 180) * (80 + Math.random() * 60) - 20,
                scale: [0, 1, 0.5],
              }}
              transition={{ duration: 1, delay: 0.3 + i * 0.04, ease: "easeOut" }}
            />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const addonCategories = ["Quality & Inspection", "Photography & Media", "Branding & Labels", "Packaging & Protection", "Garment Services", "Logistics & Fulfillment", "Product Sourcing"] as const;

  return (
    <DashboardLayout title="New Request">
      <div className="max-w-2xl mx-auto flex flex-col min-h-[70vh]">
        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium">Step {step} of {TOTAL_STEPS}</span>
            <span className="text-xs text-muted-foreground">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(239 100% 65%), hsl(262 83% 58%))" }}
              initial={false}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-5 mb-6"
        >
          {[
            { icon: ShieldCheck, text: "Verified factories" },
            { icon: Globe, text: "200+ countries" },
            { icon: Zap, text: "From 10 units" },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-1.5">
              <t.icon className="h-3 w-3 text-emerald-500/70" />
              <span className="text-[11px] text-muted-foreground/60">{t.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Step content */}
        <div className="flex-1 flex flex-col justify-center" onKeyDown={handleKeyDown}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {step === 1 && (
                <StepWrapper number="01" title="Which product do you want to source?" subtitle="Give it a short, descriptive name so we know what to look for.">
                  <Input autoFocus value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g., Branded USB-C cables, Custom tote bags, Phone cases..." className="bg-secondary/50 border-border h-14 text-lg placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/30 transition-all" />
                  <SourcingAssistant
                    onApplySuggestion={(s) => {
                      setForm((f) => ({
                        ...f,
                        title: s.title,
                        description: s.description,
                        quantity: String(s.quantity_recommended),
                        budget_per_unit: String(s.budget_per_unit_eur),
                        currency: "EUR",
                        eco_friendly: s.eco_friendly,
                      }));
                    }}
                  />
                </StepWrapper>
              )}

              {step === 2 && (
                <StepWrapper number="02" title="Tell us more about your product" subtitle="Material, size, certifications, color, finishing: the more detail, the better.">
                  <Textarea autoFocus value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe what it looks like, material, certifications (CE, FDA), color, finishing..." rows={5} className="bg-secondary/50 border-border resize-none text-base placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/30 transition-all" />
                </StepWrapper>
              )}

              {step === 3 && (
                <StepWrapper number="03" title="How many units do you need?" subtitle="We support orders as small as 10 units, perfect for testing.">
                  <Input autoFocus type="number" min="1" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="e.g., 100" className="bg-secondary/50 border-border h-14 text-lg placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/30 transition-all" />
                </StepWrapper>
              )}

              {step === 4 && (
                <StepWrapper number="04" title="Target price per unit" subtitle="Your ideal budget. We'll find the best match from our factory network.">
                  <div className="flex gap-3">
                    <select value={form.currency} onChange={(e) => update("currency", e.target.value)} className="w-24 shrink-0 rounded-xl border border-border bg-secondary/50 px-3 py-3 text-base text-foreground h-14 focus:ring-2 focus:ring-primary/30 transition-all">
                      {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Input autoFocus type="number" step="0.01" min="0" value={form.budget_per_unit} onChange={(e) => update("budget_per_unit", e.target.value)} placeholder="0.00" className="bg-secondary/50 border-border flex-1 h-14 text-lg placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/30 transition-all" />
                  </div>
                </StepWrapper>
              )}

              {step === 5 && (
                <StepWrapper number="05" title="Eco-friendly preference?" subtitle="Let us know if sustainability matters for this product.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ecoOptions.map((opt, i) => {
                      const isActive = form.eco_friendly === opt.value;
                      return (
                        <motion.button key={opt.value} type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} onClick={() => update("eco_friendly", opt.value)}
                          className={`text-left rounded-xl border p-4 transition-all ${isActive ? opt.activeColor : `${opt.color} hover:border-primary/20 hover:bg-secondary/40`}`}>
                          <div className="flex items-center gap-2 mb-1">
                            {opt.icon && <opt.icon className={`h-4 w-4 ${isActive ? opt.iconColor : "text-muted-foreground"}`} />}
                            <span className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{opt.label}</span>
                            {isActive && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto"><Check className={`h-4 w-4 ${opt.iconColor}`} /></motion.div>)}
                          </div>
                          <p className="text-xs text-muted-foreground">{opt.desc}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </StepWrapper>
              )}

              {step === 6 && (
                <StepWrapper number="06" title="Want any service add-ons?" subtitle="Optional value-added services powered by our China operations partner. Select all that apply.">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search add-ons..."
                      value={addonSearch}
                      onChange={(e) => setAddonSearch(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {addonCategories.map((cat) => {
                      const allItems = serviceAddons.filter((a) => a.category === cat);
                      const items = addonSearch
                        ? allItems.filter((a) => a.label.toLowerCase().includes(addonSearch.toLowerCase()) || a.desc.toLowerCase().includes(addonSearch.toLowerCase()))
                        : allItems;
                      if (addonSearch && items.length === 0) return null;
                      const colors = categoryColors[cat] || categoryColors["Quality & Inspection"];
                      const isExpanded = addonSearch.length > 0 || expandedCategories.includes(cat);
                      const selectedCount = allItems.filter((a) => selectedAddons.includes(a.id)).length;
                      return (
                        <div key={cat} className={`rounded-xl border transition-colors ${isExpanded ? colors.border : "border-border"}`}>
                          <button
                            type="button"
                            onClick={() => {
                              if (addonSearch) return;
                              setExpandedCategories((prev) =>
                                prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                              );
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${isExpanded ? colors.bg : "hover:bg-secondary/30"}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest border ${colors.badge}`}>{cat}</span>
                              {selectedCount > 0 && (
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${colors.badge}`}>{selectedCount}</span>
                              )}
                            </div>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="flex justify-end px-3 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const itemIds = items.map((a) => a.id);
                                      const allSelected = itemIds.every((id) => selectedAddons.includes(id));
                                      if (allSelected) {
                                        setSelectedAddons((prev) => prev.filter((id) => !itemIds.includes(id)));
                                      } else {
                                        setSelectedAddons((prev) => [...new Set([...prev, ...itemIds])]);
                                      }
                                    }}
                                    className={`text-[11px] font-medium transition-colors ${colors.icon} hover:underline`}
                                  >
                                    {items.every((a) => selectedAddons.includes(a.id)) ? "Deselect all" : "Select all"}
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-3 pb-3 pt-1">
                                  {items.map((addon, i) => {
                                    const isSelected = selectedAddons.includes(addon.id);
                                    return (
                                      <motion.button
                                        key={addon.id}
                                        type="button"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => toggleAddon(addon.id)}
                                        className={`text-left rounded-lg border p-2.5 transition-all ${
                                          isSelected
                                            ? `${colors.border} ${colors.bg} ring-1 ${colors.ring}`
                                            : "border-border bg-secondary/20 hover:border-primary/20 hover:bg-secondary/40"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <addon.icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? colors.icon : "text-muted-foreground"}`} />
                                          <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>{addon.label}</span>
                                          {isSelected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                                              <Check className={`h-3.5 w-3.5 ${colors.icon}`} />
                                            </motion.div>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground/70 mt-1 ml-5.5">{addon.desc}</p>
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                  {selectedAddons.length > 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-primary mt-3">
                      {selectedAddons.length} add-on{selectedAddons.length > 1 ? "s" : ""} selected
                    </motion.p>
                  )}
                </StepWrapper>
              )}

              {step === 7 && (
                <StepWrapper number="07" title="Do you want to give us some reference photos?" subtitle="Upload product photos, spec sheets, or inspiration images. This is optional.">
                  <FileUpload folder="requests" files={attachments} onChange={setAttachments} maxFiles={5} />
                  <p className="text-xs text-muted-foreground/60 mt-3">Drag & drop or click to upload. Max 5 files.</p>
                </StepWrapper>
              )}

              {step === 8 && (
                <StepWrapper number="08" title="Review & submit your request" subtitle="Everything looks good? Hit submit and we'll start sourcing.">
                  <div className="space-y-2.5">
                    {[
                      { label: "Product", value: form.title, step: 1 },
                      { label: "Description", value: form.description, step: 2 },
                      { label: "Quantity", value: `${parseInt(form.quantity).toLocaleString()} units`, step: 3 },
                      { label: "Target Price", value: `${form.currency} ${parseFloat(form.budget_per_unit).toFixed(2)} / unit`, step: 4 },
                      { label: "Eco-friendly", value: ecoOptions.find(o => o.value === form.eco_friendly)?.label || form.eco_friendly, step: 5 },
                      { label: "Delivery Address", value: profileAddress || "Not set - update in Settings", step: 0 },
                      { label: "Add-ons", value: selectedAddons.length > 0 ? selectedAddons.map(id => serviceAddons.find(a => a.id === id)?.label).join(", ") : "None", step: 6 },
                      { label: "Attachments", value: attachments.length > 0 ? `${attachments.length} file(s)` : "None", step: 7 },
                    ].map((item, i) => (
                      <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                        <ReviewRow label={item.label} value={item.value} onEdit={item.step > 0 ? () => goTo(item.step) : undefined} />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Free to submit. No payment until you approve a quote.</span>
                  </motion.div>
                </StepWrapper>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-between pt-8 pb-4">
          <Button type="button" variant="ghost" onClick={prev} disabled={step === 1} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          {step < TOTAL_STEPS ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="button" onClick={next} disabled={!canProceed()} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-8 font-semibold shadow-[0_0_25px_-5px_hsl(239_100%_65%/0.35)] transition-shadow hover:shadow-[0_0_35px_-5px_hsl(239_100%_65%/0.5)]">
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="button" onClick={handleSubmit} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-8 font-semibold shadow-[0_0_25px_-5px_hsl(239_100%_65%/0.35)] transition-shadow hover:shadow-[0_0_35px_-5px_hsl(239_100%_65%/0.5)]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Submit Request
              </Button>
            </motion.div>
          )}
        </motion.div>

        {step < TOTAL_STEPS && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center text-xs text-muted-foreground/40 pb-2">
            Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted/50 text-[10px] font-mono">Enter ↵</kbd> to continue
          </motion.p>
        )}
      </div>
    </DashboardLayout>
  );
};

function StepWrapper({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-xs font-mono text-primary/50 tracking-widest uppercase">
          Step {number}
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="font-heading text-2xl sm:text-3xl font-bold text-foreground mt-1 leading-tight">
          {title}
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm text-muted-foreground mt-2">
          {subtitle}
        </motion.p>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        {children}
      </motion.div>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-border bg-secondary/20 px-4 py-3 hover:bg-secondary/30 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-foreground mt-0.5 truncate">{value}</p>
      </div>
      {onEdit && <button type="button" onClick={onEdit} className="text-xs text-primary hover:text-primary/80 ml-3 shrink-0 mt-1 font-medium">Edit</button>}
    </div>
  );
}

export default NewRequest;
