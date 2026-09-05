import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Link } from "react-router-dom";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Refund & Cancellation Policy | Equilinq Sourcing"
        description="How refunds and cancellations work for Orders placed through Equilinq's B2B sourcing service."
        keywords="refund policy, cancellation policy, Equilinq, B2B sourcing refunds"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Refund Policy", url: "https://equilinq.eu/refund-policy" },
        ]}
      />
      <PublicNavbar />

      <main className="pt-32 pb-24 px-4">
        <article className="max-w-3xl mx-auto prose prose-sm prose-neutral dark:prose-invert">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2"><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(239 100% 65%), hsl(280 80% 72%), hsl(239 100% 65%))" }}>Refund</span> and Cancellation Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: 25 May 2026</p>

          <p>This Refund and Cancellation Policy ("Policy") explains how refunds and cancellations work for Orders placed through Equilinq Limited ("Equilinq", "we", "us", or "our"). It forms part of our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.</p>
          <p>Because Equilinq operates as a B2B sourcing service that procures custom-specified goods from third-party manufacturers, our refund framework is <strong>stage-based</strong>: the closer an Order is to completion, the more limited the refund options become. This reflects the real costs we and our Fulfilment Partner incur on your behalf at each stage.</p>
          <p>We commit to handling every refund and dispute fairly, transparently, and in good faith.</p>

          <h2>1. Order Stages</h2>
          <p>Each Order moves through the following stages:</p>
          <ol>
            <li><strong>Quotation Stage</strong> - You have received a Quotation but have not yet confirmed or paid.</li>
            <li><strong>Pre-Production Stage</strong> - You have paid, but production has not yet started at the supplier.</li>
            <li><strong>Production Stage</strong> - Goods are being manufactured.</li>
            <li><strong>Quality Control Stage</strong> - Goods are complete and undergoing inspection.</li>
            <li><strong>Pre-Shipping Stage</strong> - Goods have passed quality control and are awaiting dispatch.</li>
            <li><strong>Shipped</strong> - Goods have left our Fulfilment Partner's warehouse.</li>
            <li><strong>Delivered</strong> - Goods have arrived at your specified address.</li>
          </ol>
          <p>Your refund eligibility depends on which stage your Order is in when you request cancellation.</p>

          <h2>2. Quotation Stage - Before Payment</h2>
          <p>You may decline or ignore a Quotation at no cost. No payment is required and no obligation is created until you confirm the Order and complete payment.</p>

          <h2>3. Pre-Production Stage - After Payment, Before Production Starts</h2>
          <p>If you cancel after payment but <strong>before production starts</strong>:</p>
          <ul>
            <li>You will receive a <strong>refund of the production cost paid</strong>, minus:
              <ul>
                <li>Any non-refundable supplier deposits that have already been transferred (we will disclose these in advance where applicable).</li>
                <li>Our <strong>service fee</strong> (the coordination, sourcing, and management fee included in the Quotation), which is non-refundable in full once payment is received and work has begun on your behalf.</li>
                <li>Payment processing fees charged by our payment provider.</li>
              </ul>
            </li>
          </ul>
          <p>We will use reasonable efforts to recover any supplier deposits already paid; refundable amounts will be returned to you once recovered.</p>
          <p>To cancel at this stage, contact us at <a href="mailto:contact@equilinq.eu" className="text-primary hover:underline">contact@equilinq.eu</a> with your Order number. We will respond within 2 business days with the refundable amount.</p>

          <h2>4. Production Stage - While Goods Are Being Manufactured</h2>
          <p>Once production has started, <strong>cancellation is at the supplier's discretion</strong>. Suppliers typically do not accept cancellation of partially-produced custom goods.</p>
          <p>If cancellation is possible:</p>
          <ul>
            <li>Refunds will be limited to the proportion of the Order not yet produced, minus:
              <ul>
                <li>Costs already incurred (raw materials, labour, machine time)</li>
                <li>Supplier cancellation fees</li>
                <li>Our service fee</li>
                <li>Payment processing fees</li>
              </ul>
            </li>
          </ul>
          <p>If cancellation is not possible, the Order will be completed and shipped to you. Any partial refunds offered by the supplier will be passed on to you in full.</p>

          <h2>5. Quality Control Stage and Beyond</h2>
          <p>Once goods have passed quality control, <strong>cancellation refunds are no longer available</strong>, except in cases of:</p>
          <ul>
            <li>Quality control failure (see Section 6)</li>
            <li>Shipping damage or loss (see Section 7)</li>
            <li>Material non-conformity with the Quotation specifications (see Section 8)</li>
          </ul>

          <h2>6. Quality Control Failures</h2>
          <p>If goods fail our Fulfilment Partner's quality control inspection, we will notify you with photos and/or detailed reports, and propose one or more of the following:</p>
          <ul>
            <li><strong>Rework</strong> - the supplier corrects the defects (most common for minor issues)</li>
            <li><strong>Replacement</strong> - defective units are remanufactured at no additional cost to you</li>
            <li><strong>Partial refund</strong> - for the value of the affected units that cannot be reworked or replaced within a reasonable time</li>
            <li><strong>Full refund</strong> - where the entire Order is unworkable and cannot be remediated</li>
          </ul>
          <p>You may also choose to request a third-party inspection (at your cost) if you disagree with the quality control finding. Where the third-party inspection confirms our finding, the inspection cost is yours. Where it overturns our finding, we will reimburse it.</p>

          <h2>7. Shipping Damage or Loss</h2>
          <p>If your shipment is damaged, lost, or destroyed in transit:</p>
          <ul>
            <li>For shipments where insurance was included, we will assist you in submitting a claim to the carrier or insurer. Recovered amounts will be passed to you in full, minus any reasonable processing costs.</li>
            <li>For shipments where insurance was not included (typically lower-value sea freight without optional insurance), we will reasonably assist you but recovery may be limited by carrier policy.</li>
            <li>For shipments where the damage is caused by improper packaging on the supplier's side, we will work with the supplier to seek a partial or full refund or replacement.</li>
          </ul>
          <p>Damage claims should be reported to us within <strong>7 calendar days of delivery</strong>, with photos and a description of the damage.</p>

          <h2>8. Goods Not Matching Quotation Specifications</h2>
          <p>If the goods delivered materially differ from the specifications agreed in the Quotation (for example, wrong dimensions, wrong material, wrong colour, missing customisation):</p>
          <ul>
            <li>Report the issue to us within <strong>14 calendar days of delivery</strong> with photos and a description.</li>
            <li>We will investigate with our Fulfilment Partner and the supplier.</li>
            <li>Remediation may include rework, replacement, partial refund, or full refund depending on the severity and our findings.</li>
          </ul>
          <p>Minor variations within standard manufacturing tolerances (for example, slight colour shading, packaging dimensions &plusmn;5%) do not constitute non-conformity unless specifically agreed otherwise in writing.</p>

          <h2>9. Non-Refundable Items</h2>
          <p>The following are non-refundable except as required by applicable law:</p>
          <ul>
            <li>Service fees, once an Order has been confirmed and paid</li>
            <li>Quality control fees, once inspection has been performed</li>
            <li>Customisation and tooling fees, once production has started (since these costs are sunk once production tooling is created)</li>
            <li>Payment processing fees charged by our payment provider</li>
            <li>Any duties, taxes, or customs charges already paid in your destination country</li>
            <li>Shipping costs, once the goods have left the warehouse, except in cases of carrier-caused loss covered by insurance</li>
          </ul>

          <h2>10. How to Request a Refund</h2>
          <p>To request a refund or cancellation:</p>
          <ol>
            <li>Email <a href="mailto:contact@equilinq.eu" className="text-primary hover:underline"><strong>contact@equilinq.eu</strong></a> with the subject line: "Refund Request - Order #[your Order number]"</li>
            <li>Include:
              <ul>
                <li>Your Order number</li>
                <li>The stage of the Order (as best you can describe)</li>
                <li>The reason for the refund request</li>
                <li>Any supporting photos, videos, or documents</li>
              </ul>
            </li>
            <li>We will acknowledge your request within <strong>2 business days</strong> and provide a clear next-step plan, including expected timelines.</li>
          </ol>

          <h2>11. Refund Processing Time</h2>
          <p>Once a refund is approved:</p>
          <ul>
            <li><strong>Bank transfers</strong> are typically processed within <strong>5 to 10 business days</strong> after the supplier and our Fulfilment Partner have confirmed any applicable supplier refund.</li>
            <li><strong>Credit card refunds</strong> are typically processed within <strong>5 to 14 business days</strong> by our payment provider, plus any additional time required by your card issuer.</li>
          </ul>
          <p>Refunds will be issued to the original payment method used for the Order. We do not issue cash refunds.</p>

          <h2>12. Currency</h2>
          <p>Refunds are issued in the same currency in which the Order was paid. Where currency conversion is required and exchange rates have moved between the Order date and the refund date, refunds will reflect the converted amount at the prevailing rate at the time of refund.</p>
          <p>We are not responsible for foreign exchange losses arising from currency fluctuations between the original payment and the refund.</p>

          <h2>13. Disputes</h2>
          <p>If you disagree with our refund decision, you may escalate the matter as follows:</p>
          <ol>
            <li>Reply to our refund decision with a clear written explanation of your disagreement.</li>
            <li>We will review the matter and respond within <strong>10 business days</strong>.</li>
            <li>If we cannot agree, the dispute will be handled in accordance with the dispute resolution clause in our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> (Hong Kong-seated arbitration).</li>
          </ol>
          <p>For payment disputes raised through your card issuer or bank, please contact us first - we can almost always resolve issues directly faster than a chargeback process.</p>

          <h2>14. Changes to This Policy</h2>
          <p>We may update this Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. Material changes will be communicated through your dashboard, by email, or by other appropriate means.</p>

          <h2>Contact Us</h2>
          <p>For refund-related questions:</p>
          <p><strong>Equilinq Limited</strong></p>
          <p><strong>Email:</strong> <a href="mailto:contact@equilinq.eu" className="text-primary hover:underline">contact@equilinq.eu</a></p>
          <p><strong>Registered Address:</strong> Unit D, 11/F, Two Chinachem Plaza, 68 Connaught Rd Central, Hong Kong</p>
          <p><strong>Website:</strong> <a href="https://equilinq.eu" className="text-primary hover:underline">https://equilinq.eu</a></p>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}