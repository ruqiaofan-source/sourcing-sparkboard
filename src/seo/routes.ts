/**
 * SEO metadata for each public route.
 * Used by both the SEOHead component (client-side) and
 * the Vite prerender plugin (build-time static HTML injection).
 */

export interface RouteMeta {
  title: string;
  description: string;
  keywords?: string;
}

export const routeSeoMap: Record<string, RouteMeta> = {
  "/": {
    title: "Equilinq - Sourcing from China for European SMEs",
    description: "End-to-end sourcing, QC, customization and logistics from China. Transparent pricing, low MOQs, and dedicated support for European SMEs.",
    keywords: "sourcing from China, European SME sourcing, China manufacturing, quality control, private label, transparent pricing, low MOQ, China logistics",
  },
  "/pricing": {
    title: "Pricing - Equilinq Sourcing Service",
    description: "Transparent, itemized pricing for every order. No hidden fees. Submit a sourcing request and receive your exact cost breakdown.",
    keywords: "sourcing pricing, China import costs, transparent pricing, sourcing service fees, no hidden fees",
  },
  "/how-it-works": {
    title: "How It Works - Equilinq Sourcing Process in 8 Steps",
    description: "From sourcing request to delivery: learn Equilinq's 8-step process for transparent, reliable manufacturing from China.",
    keywords: "sourcing process, China manufacturing steps, how sourcing works, supplier vetting, quality control process",
  },
  "/how-it-works/submit-sourcing-request": {
    title: "Step 1: Submit Your Sourcing Request - Equilinq",
    description: "Start your China sourcing journey. Submit product specs, quantity, budget, and customization needs to Equilinq.",
    keywords: "sourcing request, product sourcing, China manufacturing order",
  },
  "/how-it-works/source-and-vet-suppliers": {
    title: "Step 2: Supplier Sourcing & Vetting - Equilinq",
    description: "We find and vet reliable Chinese manufacturers. Direct factory access, compliance screening, and MOQ negotiation.",
    keywords: "supplier vetting, China factory verification, manufacturer screening",
  },
  "/how-it-works/receive-your-quote": {
    title: "Step 3: Transparent Quote & Pricing - Equilinq",
    description: "Receive a fully itemized sourcing quote. See factory cost, logistics, and service fees -- no hidden markups.",
    keywords: "sourcing quote, itemized pricing, factory cost breakdown",
  },
  "/how-it-works/accept-and-pay": {
    title: "Step 4: Accept Quote & Secure Payment - Equilinq",
    description: "Accept your sourcing quote and pay securely. Get order confirmation, timeline, and a dedicated agent.",
    keywords: "secure payment, order confirmation, sourcing payment",
  },
  "/how-it-works/production-and-monitoring": {
    title: "Step 5: Production Monitoring - Equilinq",
    description: "Track production in real-time. Get photo updates, sample validation, and in-process monitoring from China.",
    keywords: "production monitoring, factory updates, manufacturing tracking",
  },
  "/how-it-works/quality-control-inspection": {
    title: "Step 6: Quality Control Inspection - Equilinq",
    description: "Multi-stage quality control before shipment. AQL inspections, defect checks, and detailed photo QC reports.",
    keywords: "quality control, QC inspection, AQL standards, defect checking",
  },
  "/how-it-works/shipping-and-logistics": {
    title: "Step 7: Shipping & Logistics from China - Equilinq",
    description: "Consolidated shipping from China with customs handling. Standard, express, and premium options with real-time tracking.",
    keywords: "China shipping, logistics, customs handling, international freight",
  },
  "/how-it-works/delivery-and-support": {
    title: "Step 8: Delivery & Ongoing Support - Equilinq",
    description: "Products delivered to your door. Ongoing support, easy reorders, and long-term supplier relationship management.",
    keywords: "delivery, post-delivery support, reorder, supplier management",
  },
  "/customization": {
    title: "Customization Services - Equilinq Branding & Packaging",
    description: "60+ customization options: private labels, custom packaging, quality inspection, OEM/ODM manufacturing. Build your brand with Equilinq.",
    keywords: "custom packaging China, private label manufacturing, OEM ODM China, branding services, product customization",
  },
  "/insights": {
    title: "Insights - Equilinq Sourcing Trends & Market Reports",
    description: "Best-selling products, pricing trends, and supplier signals from China. Actionable sourcing insights for European SMEs.",
    keywords: "China sourcing trends, market reports, best selling products China, supplier insights",
  },
  "/contact": {
    title: "Contact Equilinq - Get in Touch",
    description: "Questions about sourcing from China? Contact Equilinq for a free consultation. Book a call or send us a message.",
    keywords: "contact Equilinq, sourcing consultation, China sourcing help",
  },
  "/privacy": {
    title: "Privacy Policy - Equilinq",
    description: "Learn how Equilinq collects, uses, discloses, and protects your personal information.",
    keywords: "privacy policy, data protection, GDPR, personal information",
  },
  "/cookies": {
    title: "Cookie Policy - Equilinq",
    description: "Learn about the cookies and similar technologies Equilinq uses on its website.",
    keywords: "cookie policy, cookies, tracking, website cookies",
  },
  "/auth": {
    title: "Sign In - Equilinq",
    description: "Sign in or create your Equilinq account to start sourcing from China.",
    keywords: "sign in, create account, Equilinq login",
  },
};