export interface HomeFaq {
  q: string;
  a: string;
}

export const homeFaqs: HomeFaq[] = [
  {
    q: "What is the Minimum Order Quantity (MOQ) and how does pricing work?",
    a: "For in-stock or standard products, Equilinq can source from as little as 10 units per SKU, ideal for product testing, pilot runs, and early-stage e-commerce brands. For custom or made-to-order products, the minimum is typically around 50 units, since the factory is producing specifically for you. Either way, we always confirm the exact minimum clearly before you commit to an order.\n\nOur pricing is built around a transparent zero-markup model:\n\n1. Factory wholesale price\nYou pay the actual product price quoted by the manufacturer.\n\n2. Equilinq service fee\nYou pay a clear service fee for sourcing, supplier coordination, quality control support, and order management.\n\nWe do not hide margins inside supplier quotes or inflate product prices. This means you always know where your costs come from and can make decisions with full transparency.",
  },
  {
    q: "How long does shipping take and what are the costs?",
    a: "Shipping times and costs depend on the shipping method, parcel count, shipment weight and volume, destination country, and delivery type.\n\nWe offer several shipping options depending on your required speed and budget:\n\n1. Standard shipping\nUsually around 15–25 days\n\n2. Express shipping\nUsually around 7–14 days\n\n3. Premium shipping\nUsually around 5–10 days\n\nShipping costs are calculated based on the total shipment weight and volume, the number of parcels, and the destination country.\n\nEquilinq works with established international logistics partners to provide competitive and transparent shipping rates. All shipments include real-time tracking, and our team supports export documentation and customs coordination to help ensure smooth delivery.\n\nBoth the estimated shipping time and the shipping cost are quoted before confirmation, so you know what to expect before production or dispatch begins.",
  },
  {
    q: "How does Equilinq handle high-value or complex products?",
    a: "For high-value, technically complex, or regulated products, Equilinq uses a more hands-on, project-based sourcing approach.\nThese products often require closer coordination with factory teams, more detailed specification reviews, sampling rounds, enhanced quality control, and additional documentation. In some cases, long-term production agreements or exclusivity arrangements may also be needed.\n\nBecause the sourcing process is more complex, pricing is assessed on a case-by-case basis. The final cost depends on factors such as product specifications, compliance requirements, production scale, sampling needs, and the level of ongoing coordination required.\nEquilinq acts as a dedicated coordination layer between you and the factory. We help align technical requirements, production feasibility, timelines, pricing, and quality expectations before mass production begins.",
  },
  {
    q: "What Quality Control (QC) measures does Equilinq have in place?",
    a: "Every order goes through a structured quality control process before shipment. We inspect products for defects, verify specifications against approved samples, and ensure proper packaging and labelling. Visual documentation is provided prior to dispatch, and our on-the-ground QC team regularly rejects products that do not meet agreed standards, preventing defective or non-compliant goods from reaching customers.",
  },
  {
    q: "How does custom branding and packaging work?",
    a: "When placing an order, you can choose from a range of customization options, including product branding, labelling, and packaging services. Our team reviews your selections to confirm feasibility, pricing, and timelines before production begins.",
  },
  {
    q: "How are VAT, customs duties, and import taxes handled?",
    a: "Equilinq acts as a sourcing and procurement service provider and does not act as the Importer of Record.\n\nThis means that VAT, customs duties, and any applicable import taxes are the responsibility of the customer, in line with the import rules of the destination country.\n\nIn practice, this means:\n\n1. The customer is listed as the Importer of Record\nThe customer is responsible for importing the goods into the destination country.\n\n2. Import VAT and customs duties are assessed at import\nThese charges are determined by the relevant customs authorities when the goods enter the destination country.\n\n3. VAT reclaim and reporting are handled by the customer\nAny VAT recovery, declaration, or reporting must be managed directly with the customer’s local tax authority.\n\nEquilinq supports the process by coordinating export and customs documentation, working with logistics partners to support smooth customs clearance, and providing cost estimates where possible so you can plan ahead.\n\nThis structure keeps pricing transparent, avoids hidden tax markups, and helps customers remain compliant with local VAT and customs regulations.",
  },
  {
    q: "What is Equilinq’s refund and cancellation policy?",
    a: "Equilinq uses a stage-based refund and cancellation policy. Because we source and coordinate goods from third-party manufacturers, refund options depend on how far your order has progressed.\n\nBefore payment, you can decline a quotation at no cost. After payment, cancellations may still be possible if production has not started, although service fees, payment processing fees, and any non-refundable supplier deposits may be deducted.\n\nOnce production has started, cancellation depends on the supplier and the costs already incurred, such as materials, labour, machine time, or customisation work. After goods have passed quality control or have been shipped, cancellation refunds are generally no longer available.\n\nRefunds may still apply in specific cases, including quality control failure, shipping damage or loss, or goods that materially differ from the agreed quotation specifications.\n\nTo request a refund or cancellation, contact us at contact@equilinq.eu with your order number, reason for the request, and any supporting photos or documents. We will review the request and respond with the next steps.\n\nFor full details, please refer to our refund policy: https://equilinq.eu/refund-policy.",
  },
  {
    q: "How do I know Equilinq is legitimate and that I won't get scammed?",
    a: "Fair question. Sourcing from China is full of horror stories. Equilinq is an EU-based company (Amsterdam) with a named EU point of contact you can actually hold accountable, not an anonymous account overseas. We vet every supplier on-site before you ever see them, run on-site quality control with photo proof before anything ships, and use staged payments so you're never sending everything upfront on trust. You deal with one bilingual EU agent from first quote to delivery.",
  },
  {
    q: "Do you handle EU compliance like GPSR and the Responsible Person requirement?",
    a: "Yes, and it's a big reason an EU-based partner matters. Since December 2024 the EU's GPSR requires an EU-based Responsible Person and correct labelling for products sold in the EU, and your Chinese supplier cannot be that person. We help make sure your products carry the right documentation, warnings and traceability before they ship, so a listing does not get blocked or pulled after the fact. This is general guidance, not legal advice, so confirm your product's specific obligations with a qualified advisor.",
  },
  {
    q: "How does the 2026 EU de-minimis change (the €3-per-parcel charge) affect me?",
    a: "From 1 July 2026 the EU removes the €150 duty-free threshold and applies a flat €3 customs charge per parcel, with stricter product-description and HS-code rules. In short, shipping individual parcels from China gets more expensive and more paperwork-heavy, while consolidated bulk import (our model) gets relatively cheaper. We handle the consolidated import and the product data so the change works in your favour instead of eating your margin.",
  },
  {
    q: "Which countries and markets does Equilinq serve?",
    a: "We are EU-first, with our strongest focus on the Netherlands, Germany and the UK, and we work with e-commerce brands across the EU. We can ship globally, but our agents, setup and compliance support are built around European brands sourcing from China.",
  },
  {
    q: "Can I get a sample before placing a bulk order?",
    a: "Yes, and we recommend it. You can get a sample to check quality, and for custom products a pre-production sample from the actual production run before you commit to the full order. Checking the real production sample against your spec is the best way to stop mass production drifting from what you approved.",
  },
  {
    q: "How is Equilinq different from Alibaba or a typical sourcing agent?",
    a: "Alibaba is a directory: you are on your own for vetting, quality control and communication. Many freelance agents are middlemen who add a markup without much accountability. Equilinq is an EU-accountable partner with verified suppliers, on-site QC with photo proof, transparent pricing and no hidden markups, low MOQs, and one bilingual EU contact. You get the control of a direct factory relationship without having to manage a factory in Mandarin across a time zone.",
  },
];
