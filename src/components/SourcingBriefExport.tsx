import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Props {
  requestId: string;
  requestTitle: string;
}

const escapeHtml = (s: any) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const isImagePath = (p: string) => /\.(png|jpe?g|gif|webp|bmp)$/i.test(p);

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
      const attachmentPaths: string[] = req.attachment_paths || [];

      // Get signed URLs for attachments
      const signedAttachments: { path: string; name: string; url: string; isImage: boolean }[] = [];
      for (const p of attachmentPaths) {
        const { data: s } = await supabase.storage
          .from("sourcing-attachments")
          .createSignedUrl(p, 60 * 60 * 24 * 7);
        if (s?.signedUrl) {
          signedAttachments.push({
            path: p,
            name: p.split("/").pop() || p,
            url: s.signedUrl,
            isImage: isImagePath(p),
          });
        }
      }

      // Build HTML brief for html2canvas (so Chinese renders correctly)
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-10000px";
      container.style.top = "0";
      container.style.width = "794px"; // ~ A4 width @ 96dpi
      container.style.padding = "48px";
      container.style.background = "#ffffff";
      container.style.color = "#1f2937";
      container.style.fontFamily =
        '"PingFang SC","Microsoft YaHei","Noto Sans SC","Hiragino Sans GB","Source Han Sans SC",sans-serif';
      container.style.fontSize = "14px";
      container.style.lineHeight = "1.6";

      const bullets = (arr?: string[]) =>
        arr?.length
          ? `<ul style="margin:6px 0 12px 20px;padding:0;">${arr
              .map((x) => `<li style="margin:4px 0;">${escapeHtml(x)}</li>`)
              .join("")}</ul>`
          : "";

      const section = (title: string, body: string) =>
        body
          ? `<h3 style="margin:18px 0 6px;font-size:15px;color:#1e3a8a;border-bottom:1px solid #e5e7eb;padding-bottom:4px;">${title}</h3>${body}`
          : "";

      container.innerHTML = `
        <div style="border-bottom:2px solid #6366F1;padding-bottom:12px;margin-bottom:18px;">
          <h1 style="margin:0;font-size:22px;color:#6366F1;">Equilinq 采购简报 / Sourcing Brief</h1>
          <p style="margin:4px 0 0;color:#6b7280;font-size:11px;">
            生成时间 / Generated: ${new Date().toLocaleString("zh-CN")} &nbsp;|&nbsp; 请求编号 / Request ID: ${escapeHtml(req.id?.slice(0, 8))}
          </p>
        </div>

        <h2 style="margin:0 0 10px;font-size:18px;">${escapeHtml(req.title || requestTitle)}</h2>

        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:14px;">
          <tr><td style="padding:4px 8px;background:#f3f4f6;width:35%;">数量 / Quantity</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${escapeHtml(req.quantity ?? "-")}</td></tr>
          <tr><td style="padding:4px 8px;background:#f3f4f6;">目标单价 / Target Unit Budget</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${escapeHtml(req.budget_per_unit ?? "-")} ${escapeHtml(req.currency ?? "")}</td></tr>
          <tr><td style="padding:4px 8px;background:#f3f4f6;">交货国家 / Delivery Country</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${escapeHtml(req.delivery_country ?? "-")}</td></tr>
          <tr><td style="padding:4px 8px;background:#f3f4f6;">环保要求 / Eco-friendly</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${req.eco_friendly ? "是 / Yes" : "否 / No"}</td></tr>
        </table>

        ${section("客户原始描述 / Customer Description", `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(req.description || "-")}</p>`)}
        ${section("概述 / Summary", `<p style="margin:0;">${escapeHtml(brief.summary || "")}</p>`)}
        ${section("产品规格 / Product Specifications", bullets(brief.product_specs))}
        ${section("数量与起订量 / Quantity & MOQ", `<p style="margin:0;">${escapeHtml(brief.quantity_moq || "")}</p>`)}
        ${section("目标价格 / Target Pricing", `<p style="margin:0;">${escapeHtml(brief.target_pricing || "")}</p>`)}
        ${section("包装与品牌 / Packaging & Branding", `<p style="margin:0;">${escapeHtml(brief.packaging_branding || "")}</p>`)}
        ${section("质量与合规 / Quality & Compliance", bullets(brief.quality_compliance))}
        ${section("物流 / Logistics", `<p style="margin:0;">${escapeHtml(brief.logistics || "")}</p>`)}
        ${section("询问工厂的问题 / Questions for Factory", bullets(brief.questions_for_factory))}
        ${brief.internal_notes ? section("内部备注 / Internal Notes", `<p style="margin:0;">${escapeHtml(brief.internal_notes)}</p>`) : ""}

        ${
          signedAttachments.length
            ? `<h3 style="margin:18px 0 6px;font-size:15px;color:#1e3a8a;border-bottom:1px solid #e5e7eb;padding-bottom:4px;">客户附件 / Customer Attachments (${signedAttachments.length})</h3>
               <ul style="margin:6px 0 0 20px;padding:0;font-size:12px;">
                 ${signedAttachments
                   .map(
                     (a) =>
                       `<li style="margin:4px 0;word-break:break-all;">${escapeHtml(a.name)}${a.isImage ? " (见后页 / see following page)" : ""}<br/><span style="color:#6366F1;font-size:10px;">${escapeHtml(a.url)}</span></li>`,
                   )
                   .join("")}
               </ul>`
            : ""
        }
      `;

      document.body.appendChild(container);

      // Render brief content via canvas to preserve Chinese characters
      const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff" });
      document.body.removeChild(container);

      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;

      // Slice the tall canvas into multiple pages if needed
      let position = 0;
      const pageCanvasH = (canvas.width * pageH) / pageW;
      let remaining = canvas.height;
      let firstPage = true;
      while (remaining > 0) {
        const sliceH = Math.min(pageCanvasH, remaining);
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = sliceH;
        const ctx = slice.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, slice.width, slice.height);
        ctx.drawImage(canvas, 0, position, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        const dataUrl = slice.toDataURL("image/jpeg", 0.92);
        if (!firstPage) pdf.addPage();
        const sliceImgH = (sliceH * imgW) / canvas.width;
        pdf.addImage(dataUrl, "JPEG", 0, 0, imgW, sliceImgH);
        firstPage = false;
        position += sliceH;
        remaining -= sliceH;
      }

      // Embed image attachments as full pages
      for (const a of signedAttachments.filter((x) => x.isImage)) {
        try {
          const blob = await fetch(a.url).then((r) => r.blob());
          const dataUrl: string = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = dataUrl;
          });
          pdf.addPage();
          // Title
          pdf.setFontSize(11);
          pdf.setTextColor(99, 102, 241);
          pdf.text(`Attachment: ${a.name}`, 24, 28);
          // Fit image
          const maxW = pageW - 48;
          const maxH = pageH - 60;
          const ratio = Math.min(maxW / img.width, maxH / img.height);
          const w = img.width * ratio;
          const h = img.height * ratio;
          const fmt = /\.png$/i.test(a.name) ? "PNG" : "JPEG";
          pdf.addImage(dataUrl, fmt, (pageW - w) / 2, 44, w, h);
        } catch (e) {
          console.error("Failed to embed image attachment", a.name, e);
        }
      }

      const safeName = (req.title || requestTitle || "sourcing-brief")
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-")
        .toLowerCase()
        .slice(0, 50);
      pdf.save(`equilinq-brief-${safeName}.pdf`);

      toast({ title: "简报已生成", description: "PDF 已下载 / PDF downloaded successfully." });
    } catch (err: any) {
      toast({ title: "Failed to generate brief", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={loading} variant="outline" size="sm">
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileDown className="h-4 w-4 mr-2" />}
      {loading ? "生成中... / Generating..." : "导出中文采购简报 / Export China Brief (PDF)"}
    </Button>
  );
};

export default SourcingBriefExport;