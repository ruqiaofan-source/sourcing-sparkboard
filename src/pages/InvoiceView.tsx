import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";

const InvoiceView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice-view", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices" as any)
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as any;
    },
    enabled: !!id && !!user,
  });

  // Fetch customer profile for billing info
  const { data: customerProfile } = useQuery({
    queryKey: ["invoice-customer-profile", invoice?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", invoice.user_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!invoice?.user_id,
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Invoice not found.</p>
      </div>
    );
  }

  const invoiceDate = new Date(invoice.created_at).toLocaleDateString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  const currencySymbol = invoice.currency === "USD" ? "$" : invoice.currency === "EUR" ? "€" : invoice.currency + " ";

  const lineItems: Array<{description: string; unitPrice: number; qty: number; amount: number}> = [
    {
      description: `Factory Cost (${invoice.product_name})`,
      unitPrice: Number(invoice.factory_cost) / invoice.quantity,
      qty: invoice.quantity,
      amount: Number(invoice.factory_cost),
    },
    {
      description: "Equilinq Service Fee",
      unitPrice: Number(invoice.service_fee) / invoice.quantity,
      qty: invoice.quantity,
      amount: Number(invoice.service_fee),
    },
  ];

  // Add-on fees from quote
  const addonFees = (invoice as any).addon_fees as Array<{id: string; label: string; cost: number}> | null;
  if (addonFees && addonFees.length > 0) {
    addonFees.forEach((a) => {
      lineItems.push({
        description: `Add-on: ${a.label}`,
        unitPrice: a.cost,
        qty: invoice.quantity,
        amount: a.cost * invoice.quantity,
      });
    });
  }

  if (Number(invoice.logistics_cost) > 0) {
    lineItems.push({
      description: "Logistics & Customs",
      unitPrice: Number(invoice.logistics_cost),
      qty: 1,
      amount: Number(invoice.logistics_cost),
    });
  }

  // Total excludes financial costs (not shown to customer)
  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      {/* Screen controls - hidden when printing */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button size="sm" onClick={handlePrint} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" /> Save as PDF
          </Button>
        </div>
      </div>

      {/* Invoice content */}
      <div className="print:mt-0 mt-20 flex justify-center bg-muted/30 print:bg-white min-h-screen p-8 print:p-0">
        <div
          ref={printRef}
          className="bg-white text-black w-full max-w-[210mm] print:max-w-none shadow-lg print:shadow-none"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
        >
          <div className="p-12 print:p-16">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">INVOICE</h1>
                <p className="text-sm text-gray-500">Invoice Date: {invoiceDate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">{invoice.invoice_number}</p>
              </div>
            </div>

            {/* Company & Bill To */}
            <div className="grid grid-cols-2 gap-12 mb-10">
              <div>
                <p className="font-bold text-gray-900 mb-2">EQUILINQ LTD</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="text-gray-900">Address:</span> Unit D 11/F, Two Chinachem Plaza, 68 Connaught Rd Central, Hong Kong
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="text-gray-900">Email:</span> contact@equilinq.eu
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-2">BILL TO</p>
                <p className="text-sm text-gray-700">
                  <span className="text-gray-900">Name:</span>{" "}
                  {customerProfile?.full_name || customerProfile?.display_name || "Customer"}
                </p>
                {(customerProfile as any)?.company_name && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="text-gray-900">Company:</span> {(customerProfile as any).company_name}
                  </p>
                )}
                {invoice.delivery_address && (
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed whitespace-pre-line">
                    <span className="text-gray-900">Address:</span> {invoice.delivery_address}
                  </p>
                )}
              </div>
            </div>

            {/* Line items table (full grid, matches reference) */}
            <table className="w-full mb-8 border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-sm font-bold text-gray-900 p-3 border border-gray-300 w-1/2">Item &amp; Description</th>
                  <th className="text-right text-sm font-bold text-gray-900 p-3 border border-gray-300">Unit Price</th>
                  <th className="text-right text-sm font-bold text-gray-900 p-3 border border-gray-300">Qty</th>
                  <th className="text-right text-sm font-bold text-gray-900 p-3 border border-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i}>
                    <td className="p-3 text-sm text-gray-800 border border-gray-300">{item.description}</td>
                    <td className="p-3 text-sm text-gray-800 text-right border border-gray-300">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                    <td className="p-3 text-sm text-gray-800 text-right border border-gray-300">{item.qty}</td>
                    <td className="p-3 text-sm text-gray-800 text-right border border-gray-300">{currencySymbol}{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="p-3 text-sm font-bold text-gray-900 border border-gray-300">Total</td>
                  <td className="p-3 text-sm font-bold text-gray-900 text-right border border-gray-300">{currencySymbol}{total.toFixed(2)}</td>
                  <td className="p-3 text-sm font-bold text-gray-900 text-right border border-gray-300">1</td>
                  <td className="p-3 text-sm font-bold text-gray-900 text-right border border-gray-300">{currencySymbol}{total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            {/* Notes */}
            <div className="mb-10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Notes / Terms</h3>
              <div className="text-xs text-gray-600 leading-relaxed space-y-1.5">
                <p>Equilinq Limited acts solely as a sourcing and procurement service provider and does not take ownership of goods.</p>
                <p>The customer is the importer of record and is fully responsible for all customs clearance, duties, taxes, and regulatory compliance.</p>
                <p>Production will commence only after full payment has been received.</p>
                <p>Equilinq facilitates supplier payments on behalf of the customer; all goods are purchased in the name and for the account of the customer.</p>
                <p>Factory and logistics costs are pass-through costs incurred on behalf of the customer.</p>
                <p>Payment of this invoice constitutes acceptance of these terms.</p>
              </div>
            </div>

            {/* Payment method */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Payment Method</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="text-gray-500 w-40 inline-block">Account Name:</span> Equilinq Limited</p>
                <p><span className="text-gray-500 w-40 inline-block">Bank Name:</span> Community Federal Savings Bank</p>
                <p><span className="text-gray-500 w-40 inline-block">Account Number:</span> 8484328871</p>
                <p><span className="text-gray-500 w-40 inline-block">ACH Routing (ABA):</span> 026073150</p>
                <p><span className="text-gray-500 w-40 inline-block">Currency:</span> {invoice.currency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </>
  );
};

export default InvoiceView;
