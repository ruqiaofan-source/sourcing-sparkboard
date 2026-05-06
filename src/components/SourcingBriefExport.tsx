import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, Eye, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  requestId: string;
  requestTitle: string;
}

interface Brief {
  summary?: string;
  product_specs?: string[];
  quantity_moq?: string;
  target_pricing?: string;
  packaging_branding?: string;
  quality_compliance?: string[];
  logistics?: string;
  questions_for_factory?: string[];
  internal_notes?: string;
}

interface RequestData {
  id?: string;
  title?: string;
  description?: string;
  quantity?: number | string;
  budget_per_unit?: number | string;
  currency?: string;
  delivery_country?: string;
  eco_friendly?: boolean;
  attachment_paths?: string[];
}

interface SignedAttachment {
  path: string;
  name: string;
  url: string;
  isImage: boolean;
}

const escapeHtml = (s: any) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const isImagePath = (p: string) => /\.(png|jpe?g|gif|webp|bmp)$/i.test(p);

const toLines = (arr?: string[]) => (arr || []).join("\n");
const fromLines = (val: string) =>
  val
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const buildBriefHtml = (
  brief: Brief,
  req: RequestData,
  attachments: SignedAttachment[],
  fallbackTitle: string,
) => {
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

  return `
    <div style="border-bottom:2px solid #6366F1;padding-bottom:12px;margin-bottom:18px;">
      <h1 style="margin:0;font-size:22px;color:#6366F1;">Equilinq 采购简报 / Sourcing Brief</h1>
      <p style="margin:4px 0 0;color:#6b7280;font-size:11px;">
        生成时间 / Generated: ${new Date().toLocaleString("zh-CN")} &nbsp;|&nbsp; 请求编号 / Request ID: ${escapeHtml((req.id || "").slice(0, 8))}
      </p>
    </div>

    <h2 style="margin:0 0 10px;font-size:18px;">${escapeHtml(req.title || fallbackTitle)}</h2>

    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:14px;">
      <tr><td style="padding:4px 8px;background:#f3f4f6;width:35%;">数量 / Quantity</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${escapeHtml(req.quantity ?? "-")}</td></tr>
      <tr><td style="padding:4px 8px;background:#f3f4f6;">目标单价 / Target Unit Budget</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${escapeHtml(req.budget_per_unit ?? "-")} ${escapeHtml(req.currency ?? "")}</td></tr>
      <tr><td style="padding:4px 8px;background:#f3f4f6;">交货国家 / Delivery Country</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${escapeHtml(req.delivery_country ?? "-")}</td></tr>
      <tr><td style="padding:4px 8px;background:#f3f4f6;">环保要求 / Eco-friendly</td><td style="padding:4px 8px;border:1px solid #e5e7eb;">${req.eco_friendly ? "是 / Yes" : "否 / No"}</td></tr>
    </table>

    ${section("客户原始描述 / Customer Description", `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(req.description || "-")}</p>`)}
    ${section("概述 / Summary", `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(brief.summary || "")}</p>`)}
    ${section("产品规格 / Product Specifications", bullets(brief.product_specs))}
    ${section("数量与起订量 / Quantity & MOQ", `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(brief.quantity_moq || "")}</p>`)}
    ${section("目标价格 / Target Pricing", `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(brief.target_pricing || "")}</p>`)}
    ${section("包装与品牌 / Packaging & Branding", `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(brief.packaging_branding || "")}</p>`)}
    ${section("质量与合规 / Quality & Compliance", bullets(brief.quality_compliance))}
    ${section("物流 / Logistics", `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(brief.logistics || "")}</p>`)}
    ${section("询问工厂的问题 / Questions for Factory", bullets(brief.questions_for_factory))}
    ${brief.internal_notes ? section("内部备注 / Internal Notes", `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(brief.internal_notes)}</p>`) : ""}

    ${
      attachments.length
        ? `<h3 style="margin:18px 0 6px;font-size:15px;color:#1e3a8a;border-bottom:1px solid #e5e7eb;padding-bottom:4px;">客户附件 / Customer Attachments (${attachments.length})</h3>
           <ul style="margin:6px 0 0 20px;padding:0;font-size:12px;">
             ${attachments
               .map(
                 (a) =>
                   `<li style="margin:4px 0;word-break:break-all;">${escapeHtml(a.name)}${a.isImage ? " (见后页 / see following page)" : ""}<br/><span style="color:#6366F1;font-size:10px;">${escapeHtml(a.url)}</span></li>`,
               )
               .join("")}
           </ul>`
        : ""
    }
  `;
};

const SourcingBriefExport = ({ requestId, requestTitle }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [open, setOpen] = useState(false);
  const [brief, setBrief] = useState<Brief>({});
  const [request, setRequest] = useState<RequestData>({});
  const [attachments, setAttachments] = useState<SignedAttachment[]>([]);

  const previewHtml = useMemo(
    () => buildBriefHtml(brief, request, attachments, requestTitle),
    [brief, request, attachments, requestTitle],
  );

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-sourcing-brief", {
        body: { request_id: requestId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const b: Brief = data.brief || {};
      const req: RequestData = data.request || {};
      const paths: string[] = req.attachment_paths || [];

      const signed: SignedAttachment[] = [];
      for (const p of paths) {
        const { data: s } = await supabase.storage
          .from("sourcing-attachments")
          .createSignedUrl(p, 60 * 60 * 24 * 7);
        if (s?.signedUrl) {
          signed.push({
            path: p,
            name: p.split("/").pop() || p,
            url: s.signedUrl,
            isImage: isImagePath(p),
          });
        }
      }

      setBrief(b);
      setRequest(req);
      setAttachments(signed);
      setOpen(true);
    } catch (err: any) {
      toast({
        title: "Failed to generate brief",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-10000px";
      container.style.top = "0";
      container.style.width = "794px";
      container.style.padding = "48px";
      container.style.background = "#ffffff";
      container.style.color = "#1f2937";
      container.style.fontFamily =
        '"PingFang SC","Microsoft YaHei","Noto Sans SC","Hiragino Sans GB","Source Han Sans SC",sans-serif';
      container.style.fontSize = "14px";
      container.style.lineHeight = "1.6";
      container.innerHTML = previewHtml;
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff" });
      document.body.removeChild(container);

      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;

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

      for (const a of attachments.filter((x) => x.isImage)) {
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
          pdf.setFontSize(11);
          pdf.setTextColor(99, 102, 241);
          pdf.text(`Attachment: ${a.name}`, 24, 28);
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

      const safeName = (request.title || requestTitle || "sourcing-brief")
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-")
        .toLowerCase()
        .slice(0, 50);
      pdf.save(`equilinq-brief-${safeName}.pdf`);

      toast({ title: "简报已下载 / PDF downloaded" });
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Failed to download PDF",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Button onClick={handleGenerate} disabled={loading} variant="outline" size="sm">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Eye className="h-4 w-4 mr-2" />
        )}
        {loading ? "生成中... / Generating..." : "预览中文简报 / Preview China Brief"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>预览与编辑采购简报 / Preview & Edit Brief</DialogTitle>
            <DialogDescription>
              查看 AI 生成的内容,根据需要编辑后再导出 PDF。 Review the AI-generated brief, edit as needed, then export.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="preview" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="self-start">
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-1.5" /> 预览 / Preview
              </TabsTrigger>
              <TabsTrigger value="edit">
                <Pencil className="h-4 w-4 mr-1.5" /> 编辑 / Edit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 overflow-hidden mt-3">
              <ScrollArea className="h-[60vh] rounded-md border bg-white">
                <div
                  className="p-6 text-foreground"
                  style={{
                    fontFamily:
                      '"PingFang SC","Microsoft YaHei","Noto Sans SC","Hiragino Sans GB","Source Han Sans SC",sans-serif',
                    color: "#1f2937",
                  }}
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
                {attachments.filter((a) => a.isImage).length > 0 && (
                  <div className="p-6 pt-0 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      附件预览 / Attachment previews (will be appended as full pages):
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {attachments
                        .filter((a) => a.isImage)
                        .map((a) => (
                          <div key={a.path} className="border rounded p-2 bg-muted/30">
                            <img
                              src={a.url}
                              alt={a.name}
                              className="w-full h-40 object-contain bg-white rounded"
                            />
                            <p className="text-xs mt-1 truncate" title={a.name}>
                              {a.name}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="edit" className="flex-1 overflow-hidden mt-3">
              <ScrollArea className="h-[60vh] rounded-md border p-4">
                <div className="space-y-4">
                  <div>
                    <Label>标题 / Title</Label>
                    <Input
                      value={request.title || ""}
                      onChange={(e) => setRequest({ ...request, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>概述 / Summary</Label>
                    <Textarea
                      rows={3}
                      value={brief.summary || ""}
                      onChange={(e) => setBrief({ ...brief, summary: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>产品规格 / Product Specs (one per line)</Label>
                    <Textarea
                      rows={5}
                      value={toLines(brief.product_specs)}
                      onChange={(e) =>
                        setBrief({ ...brief, product_specs: fromLines(e.target.value) })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>数量与起订量 / Quantity & MOQ</Label>
                      <Textarea
                        rows={2}
                        value={brief.quantity_moq || ""}
                        onChange={(e) => setBrief({ ...brief, quantity_moq: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>目标价格 / Target Pricing</Label>
                      <Textarea
                        rows={2}
                        value={brief.target_pricing || ""}
                        onChange={(e) => setBrief({ ...brief, target_pricing: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>包装与品牌 / Packaging & Branding</Label>
                    <Textarea
                      rows={3}
                      value={brief.packaging_branding || ""}
                      onChange={(e) =>
                        setBrief({ ...brief, packaging_branding: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>质量与合规 / Quality & Compliance (one per line)</Label>
                    <Textarea
                      rows={4}
                      value={toLines(brief.quality_compliance)}
                      onChange={(e) =>
                        setBrief({ ...brief, quality_compliance: fromLines(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>物流 / Logistics</Label>
                    <Textarea
                      rows={2}
                      value={brief.logistics || ""}
                      onChange={(e) => setBrief({ ...brief, logistics: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>询问工厂的问题 / Questions for Factory (one per line)</Label>
                    <Textarea
                      rows={5}
                      value={toLines(brief.questions_for_factory)}
                      onChange={(e) =>
                        setBrief({
                          ...brief,
                          questions_for_factory: fromLines(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>内部备注 / Internal Notes</Label>
                    <Textarea
                      rows={3}
                      value={brief.internal_notes || ""}
                      onChange={(e) => setBrief({ ...brief, internal_notes: e.target.value })}
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={downloading}>
              取消 / Cancel
            </Button>
            <Button variant="outline" onClick={handleGenerate} disabled={loading || downloading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              重新生成 / Regenerate
            </Button>
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              下载 PDF / Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SourcingBriefExport;