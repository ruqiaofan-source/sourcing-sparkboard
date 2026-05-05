import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface Props {
  requestId: string;
  requestTitle: string;
}

const SourcingBriefExport = ({ requestId, requestTitle }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-sourcing-brief", {
        body: { request_id: requestId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const brief = data.brief || {};
      const req = data.request || {};

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 48;
      const maxWidth = pageWidth - margin * 2;
      let y = margin;

      const ensureSpace = (h: number) => {
        if (y + h > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
      };

      const writeHeading = (text: string, size = 14) => {
        ensureSpace(size + 12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(size);
        doc.setTextColor(30, 30, 60);
        doc.text(text, margin, y);
        y += size + 8;
      };

      const writeText = (text: string, size = 10) => {
        if (!text) return;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(size);
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(String(text), maxWidth);
        for (const line of lines) {
          ensureSpace(size + 4);
          doc.text(line, margin, y);
          y += size + 4;
        }
      };

      const writeBullets = (items: string[] | undefined) => {
        if (!items?.length) return;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        for (const it of items) {
          const lines = doc.splitTextToSize(`- ${it}`, maxWidth - 12);
          for (let i = 0; i < lines.length; i++) {
            ensureSpace(14);
            doc.text(lines[i], margin + (i === 0 ? 0 : 12), y);
            y += 14;
          }
        }
      };

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(99, 102, 241);
      doc.text("Equilinq Sourcing Brief", margin, y);
      y += 26;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Generated ${new Date().toLocaleString()}  |  Request ID: ${req.id?.slice(0, 8)}`, margin, y);
      y += 20;

      writeHeading(req.title || requestTitle, 16);

      writeHeading("Request Details", 12);
      writeText(
        `Quantity: ${req.quantity ?? "n/a"}  |  Target unit budget: ${req.budget_per_unit ?? "n/a"} ${req.currency ?? ""}  |  Delivery: ${req.delivery_country ?? "n/a"}  |  Eco-friendly: ${req.eco_friendly ? "Yes" : "No"}`,
      );
      y += 6;

      writeHeading("Summary", 12);
      writeText(brief.summary);
      y += 4;

      writeHeading("Product Specifications", 12);
      writeBullets(brief.product_specs);
      y += 4;

      writeHeading("Quantity & MOQ", 12);
      writeText(brief.quantity_moq);
      y += 4;

      writeHeading("Target Pricing", 12);
      writeText(brief.target_pricing);
      y += 4;

      writeHeading("Packaging & Branding", 12);
      writeText(brief.packaging_branding);
      y += 4;

      writeHeading("Quality & Compliance", 12);
      writeBullets(brief.quality_compliance);
      y += 4;

      writeHeading("Logistics", 12);
      writeText(brief.logistics);
      y += 4;

      writeHeading("Questions for Factory", 12);
      writeBullets(brief.questions_for_factory);
      y += 4;

      if (brief.internal_notes) {
        writeHeading("Internal Notes", 12);
        writeText(brief.internal_notes);
      }

      const safeName = (req.title || requestTitle || "sourcing-brief")
        .replace(/[^a-z0-9]+/gi, "-")
        .toLowerCase()
        .slice(0, 50);
      doc.save(`equilinq-brief-${safeName}.pdf`);

      toast({ title: "Brief generated", description: "PDF downloaded successfully." });
    } catch (err: any) {
      toast({ title: "Failed to generate brief", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={loading} variant="outline" size="sm">
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileDown className="h-4 w-4 mr-2" />}
      {loading ? "Generating..." : "Export China Brief (PDF)"}
    </Button>
  );
};

export default SourcingBriefExport;