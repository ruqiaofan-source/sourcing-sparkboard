import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Building2, Globe, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type BankAccount = {
  id: string;
  flag: string;
  title: string;
  currency: string;
  fields: { label: string; value: string }[];
};

const bankAccounts: BankAccount[] = [
  {
    id: "eur",
    flag: "🇪🇺",
    title: "Equilinq Limited - Europe",
    currency: "EUR",
    fields: [
      { label: "Account Name", value: "Equilinq Limited" },
      { label: "IBAN", value: "DE49202208000047365649" },
      { label: "SWIFT Code", value: "SXPYDEHH" },
      { label: "Account Location", value: "Germany (Europe)" },
    ],
  },
  {
    id: "usd",
    flag: "🇺🇸",
    title: "Equilinq Limited - United States",
    currency: "USD",
    fields: [
      { label: "Account Name", value: "Equilinq Limited" },
      { label: "Account Number", value: "8484328871" },
      { label: "ACH Routing Number", value: "026073150" },
      { label: "Fedwire Routing Number", value: "026073008" },
      { label: "SWIFT Code", value: "CMFGUS33" },
      { label: "Account Location", value: "United States" },
    ],
  },
  {
    id: "hkd",
    flag: "🇭🇰",
    title: "Equilinq Limited - Hong Kong",
    currency: "HKD",
    fields: [
      { label: "Account Name", value: "Equilinq Limited" },
      { label: "Account Number", value: "7949875204" },
      { label: "Bank Code", value: "016" },
      { label: "Branch Code", value: "478" },
      { label: "SWIFT Code", value: "DHBKHKHH" },
      { label: "Account Location", value: "Hong Kong SAR" },
    ],
  },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast({ title: "Copied!", description: value });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function PaymentDetails({ invoiceCurrency }: { invoiceCurrency?: string }) {
  // Pre-select the account matching the invoice currency
  const defaultAccount = bankAccounts.find((a) => a.currency === invoiceCurrency?.toUpperCase())?.id || "eur";
  const [selected, setSelected] = useState(defaultAccount);
  const [expanded, setExpanded] = useState(true);

  const activeAccount = bankAccounts.find((a) => a.id === selected)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-card-foreground text-sm">Payment Details</h4>
            <p className="text-xs text-muted-foreground">Wire transfer to complete your order</p>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Currency selector tabs */}
              <div className="flex gap-2">
                {bankAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setSelected(acc.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                      selected === acc.id
                        ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <span className="text-base">{acc.flag}</span>
                    <span>{acc.currency}</span>
                  </button>
                ))}
              </div>

              {/* Account details card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-border bg-card p-4 space-y-0"
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                    <Building2 className="h-4 w-4 text-primary" />
                    <p className="font-medium text-card-foreground text-sm">{activeAccount.title}</p>
                  </div>

                  <div className="space-y-3">
                    {activeAccount.fields.map((field) => (
                      <div key={field.label} className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{field.label}</p>
                          <p className="text-sm font-medium text-card-foreground font-mono tracking-wide">{field.value}</p>
                        </div>
                        <CopyButton value={field.value} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Reference note */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/20">
                <Globe className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Please include your <span className="font-semibold text-card-foreground">invoice number</span> as the payment reference.
                  Processing typically takes 1-3 business days for international transfers.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
