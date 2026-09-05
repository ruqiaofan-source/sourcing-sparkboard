import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Link } from "react-router-dom";
import PageGlow from "@/components/PageGlow";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Terms of Service and Compliance Policy - Equilinq"
        description="The terms governing your use of Equilinq's sourcing, procurement, quality control, and logistics services."
        keywords="terms of service, terms and conditions, Equilinq, B2B sourcing"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Terms of Service", url: "https://equilinq.eu/terms" },
        ]}
      />
      <PublicNavbar />
      <PageGlow />

      <main className="pt-32 pb-24 px-4">
        <article className="max-w-3xl mx-auto prose prose-sm prose-neutral dark:prose-invert">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2"><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(239 100% 65%), hsl(280 80% 72%), hsl(239 100% 65%))" }}>Terms</span> of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: 25 May 2026</p>

          <p>These Terms of Service ("Terms") govern your access to and use of the website, dashboard, and services provided by <strong>Equilinq Limited</strong> ("Equilinq", "we", "us", or "our"), a company incorporated in Hong Kong (Company No. 79372452), with its registered office at Unit D, 11/F, Two Chinachem Plaza, 68 Connaught Rd Central, Hong Kong.</p>
          <p>By creating an account, submitting a sourcing request, placing an order, or otherwise using our services, you agree to be bound by these Terms. If you do not agree, you must not use our services.</p>
          <p>Our services are offered exclusively to businesses and individuals acting in a business or professional capacity. Equilinq does not provide services to consumers acting outside of a trade or profession.</p>

          <h2>1. Definitions</h2>
          <p>For the purposes of these Terms:</p>
          <ul>
            <li><strong>"Account"</strong> means the registered user account through which you access our services.</li>
            <li><strong>"Customer"</strong>, <strong>"you"</strong>, or <strong>"your"</strong> means the business or business representative that uses our services.</li>
            <li><strong>"Fulfilment Partner"</strong> means StarIT Group / BuckyDrop, our designated partner that handles sourcing execution, quality control, customisation, packing, and shipping from China.</li>
            <li><strong>"Order"</strong> means a confirmed purchase of goods or services placed by you through our platform.</li>
            <li><strong>"Quotation"</strong> means a written proposal we provide in response to your sourcing request, setting out specifications, pricing, lead times, and other commercial terms.</li>
            <li><strong>"Services"</strong> means the sourcing, procurement, quality control, customisation, and logistics coordination services offered by Equilinq.</li>
            <li><strong>"Sourcing Request"</strong> means a request you submit through our platform describing the goods or services you wish to source.</li>
          </ul>

          <h2>2. Our Services</h2>
          <p>Equilinq is a B2B sourcing and procurement service provider. We help businesses, primarily small and medium-sized enterprises in Europe, source goods from verified Chinese suppliers and manage end-to-end fulfilment.</p>
          <p>Our typical service flow is:</p>
          <ol>
            <li>You submit a Sourcing Request through our platform.</li>
            <li>We work with our Fulfilment Partner to identify suitable suppliers and prepare a Quotation.</li>
            <li>You review and confirm the Quotation.</li>
            <li>You make payment through our platform.</li>
            <li>Our Fulfilment Partner executes the order: sourcing, customisation, quality control, packing, and shipping.</li>
            <li>Goods are delivered to your designated address.</li>
            <li>Real-time status updates are provided through your dashboard.</li>
          </ol>
          <p>Equilinq acts as a service provider that coordinates these activities. <strong>Title in the goods passes to you upon production by the supplier, and Equilinq does not take ownership of the goods at any point.</strong> This service-provider model is designed to keep our Customers as the importer of record for European customs and compliance purposes.</p>

          <h2>3. Account Registration</h2>
          <p>To use most of our services, you must create an account. By registering, you agree that:</p>
          <ul>
            <li>You are at least 18 years old and have the legal authority to bind the business you represent.</li>
            <li>The information you provide is accurate, complete, and kept up to date.</li>
            <li>You are responsible for safeguarding your login credentials and for all activity that occurs under your account.</li>
            <li>You will notify us promptly of any unauthorised access to your account.</li>
          </ul>
          <p>We may suspend or terminate accounts found to be in violation of these Terms or applicable law, with or without notice depending on the nature of the violation.</p>

          <h2>4. Sourcing Requests and Quotations</h2>
          <h3>4.1 Sourcing Requests</h3>
          <p>You may submit a Sourcing Request through your dashboard at any time. A Sourcing Request does not constitute an order. Equilinq reserves the right to decline any Sourcing Request, including (but not limited to) requests for:</p>
          <ul>
            <li>Goods that are illegal, restricted, or prohibited under Hong Kong, Chinese, or destination-country law.</li>
            <li>Goods that infringe third-party intellectual property rights.</li>
            <li>Goods that we, in our reasonable discretion, consider unsuitable for our service model.</li>
          </ul>
          <p>This site expressly prohibits purchasing agents/services for counterfeit goods, high-quality replicas, replica products, and products that use well-known brand logos/patterns without authorization.</p>
          <h3>4.2 Quotations</h3>
          <p>Quotations we provide are valid for the period stated in the Quotation, typically 14 days unless otherwise specified. After this period, prices, lead times, and availability may change.</p>
          <p>A Quotation includes, where applicable: product specifications, unit price, minimum order quantity, customisation costs, quality control fees, shipping cost estimate, our service fee, total cost, and estimated lead time.</p>
          <p>Pricing may be subject to change due to factors outside our reasonable control, including but not limited to raw material price fluctuations, currency exchange rate changes, customs duties, and changes in supplier availability. We will notify you of any material changes before proceeding.</p>

          <h2>5. Orders and Payment</h2>
          <h3>5.1 Order Confirmation</h3>
          <p>An Order is formed when you confirm a Quotation through your dashboard and complete payment. A confirmed Order is a binding agreement subject to these Terms.</p>
          <h3>5.2 Payment Methods</h3>
          <p>We accept payments through:</p>
          <ul>
            <li><strong>Bank transfer</strong> to our designated Equilinq Limited accounts (USD, EUR, HKD), handled by our regulated payment partner Airwallex.</li>
            <li><strong>Credit card and other supported methods</strong>, where enabled, processed through Airwallex.</li>
          </ul>
          <p>All payment information is processed by Airwallex. Equilinq does not store full payment card details.</p>
          <h3>5.3 Payment Terms</h3>
          <p>Unless otherwise agreed in writing, <strong>full payment is required before production begins</strong>. For larger Orders, we may agree to split payments (for example, deposit upon Order confirmation, balance before shipping). All payment terms are set out in the Quotation.</p>
          <h3>5.4 Currency</h3>
          <p>Orders may be invoiced in USD, EUR, or HKD as agreed in the Quotation. All amounts shown on our platform are exclusive of any import duties, taxes (including VAT), and customs charges payable in your destination country, which remain your responsibility as the importer of record.</p>
          <h3>5.5 Late or Failed Payment</h3>
          <p>We reserve the right to suspend or cancel any Order for which payment is delayed, refused, or reversed. You agree to reimburse any reasonable costs we incur recovering overdue amounts.</p>

          <h2>6. Production and Lead Times</h2>
          <p>Lead times stated in the Quotation are good-faith estimates based on information from the supplier and our Fulfilment Partner. Actual lead times may vary due to factors including but not limited to:</p>
          <ul>
            <li>Supplier production capacity</li>
            <li>Raw material availability</li>
            <li>Quality control outcomes</li>
            <li>Public holidays in China (especially Chinese New Year, October Golden Week)</li>
            <li>Shipping and customs delays</li>
          </ul>
          <p>We will use reasonable efforts to keep you informed of any material delays. Equilinq is not liable for losses arising solely from delays in production or delivery, except where such delay is caused by our gross negligence or wilful misconduct.</p>

          <h2>7. Quality Control</h2>
          <p>Our Fulfilment Partner performs quality control on goods before shipping, in accordance with the specifications agreed in the Quotation. Quality control typically includes:</p>
          <ul>
            <li>Visual inspection</li>
            <li>Sample-based functional testing (where applicable)</li>
            <li>Quantity verification</li>
            <li>Packaging review</li>
          </ul>
          <p>If quality control identifies non-conforming goods, we will inform you and propose remediation (typically rework, replacement, or refund of the affected units), as described in our <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>.</p>
          <p>You may request additional quality control services (for example, third-party inspections or detailed photo reports) at additional cost, where agreed in advance.</p>

          <h2>8. Shipping, Customs, and Risk of Loss</h2>
          <h3>8.1 Shipping</h3>
          <p>Shipping is arranged by our Fulfilment Partner on your behalf. Shipping methods include air freight, sea freight, express courier, and rail freight, depending on the Quotation.</p>
          <h3>8.2 Customs and Import Duties</h3>
          <p><strong>You are the importer of record.</strong> You are responsible for:</p>
          <ul>
            <li>Paying all applicable import duties, taxes, VAT, and customs clearance fees in your destination country.</li>
            <li>Providing accurate and complete information required for customs clearance.</li>
            <li>Compliance with all applicable import regulations in your destination country.</li>
          </ul>
          <h3>8.3 Risk of Loss</h3>
          <p>Risk of loss or damage to goods passes to you in accordance with the shipping terms set out in the Quotation (typically FOB, EXW, or DAP / DDP as specified). Where goods are insured and damage occurs in transit, we will reasonably assist you in pursuing a claim with the carrier or insurer.</p>

          <h2>9. Returns and Refunds</h2>
          <p>Returns and refunds are governed by our <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>, which forms part of these Terms.</p>

          <h2>10. Intellectual Property</h2>
          <h3>10.1 Equilinq IP</h3>
          <p>All content on our platform, including the Equilinq name, logo, dashboard, website design, and source code, is owned by Equilinq or licensed to us. You may not copy, reproduce, distribute, or create derivative works from our content without our prior written consent, except as permitted by these Terms or applicable law.</p>
          <h3>10.2 Your IP</h3>
          <p>You retain all rights in the trademarks, designs, packaging artwork, and other intellectual property you provide to us in connection with custom orders. By submitting such materials, you grant Equilinq and its Fulfilment Partner a limited, non-exclusive, royalty-free licence to use, reproduce, and process those materials solely for the purpose of executing your Order.</p>
          <h3>10.3 Warranties on Your IP</h3>
          <p>You warrant that the materials you provide do not infringe any third-party intellectual property rights, and you agree to indemnify Equilinq against any third-party claim arising from our use of your materials in accordance with your instructions.</p>

          <h2>11. Confidentiality</h2>
          <p>We treat the information you share with us in the course of using our services as confidential, except where disclosure is necessary to provide our services (for example, to our Fulfilment Partner, suppliers, or logistics providers), required by law, or where you have given consent. You agree to treat as confidential any non-public commercial information we share with you, including pricing, supplier identities, and methodology.</p>

          <h2>12. Liability</h2>
          <h3>12.1 Disclaimer</h3>
          <p>To the maximum extent permitted by law, Equilinq's services are provided "as is" and "as available". We do not warrant uninterrupted or error-free service, or that defects will be corrected.</p>
          <h3>12.2 Limitation of Liability</h3>
          <p>To the maximum extent permitted by applicable law, Equilinq's total aggregate liability to you under or in connection with these Terms (whether in contract, tort, or otherwise) is limited to the total fees you paid to Equilinq for the Services giving rise to the claim, in the 12 months preceding the event giving rise to the liability.</p>
          <p>We will not be liable for any indirect, consequential, special, or punitive damages, including loss of profit, loss of business, loss of revenue, loss of goodwill, or loss of data, even if foreseeable.</p>
          <h3>12.3 Exceptions</h3>
          <p>Nothing in these Terms limits or excludes our liability for:</p>
          <ul>
            <li>Death or personal injury caused by our negligence</li>
            <li>Fraud or fraudulent misrepresentation</li>
            <li>Any liability that cannot be lawfully excluded or limited</li>
          </ul>

          <h2>13. Indemnification</h2>
          <p>You agree to indemnify and hold harmless Equilinq, its officers, employees, and agents from any third-party claim, loss, liability, or expense (including reasonable legal fees) arising from:</p>
          <ul>
            <li>Your breach of these Terms</li>
            <li>Your violation of applicable law</li>
            <li>Materials, instructions, or designs you provide that infringe third-party rights</li>
            <li>Your misuse of our services</li>
          </ul>

          <h2>14. Termination</h2>
          <p>You may close your account at any time by contacting us. We may suspend or terminate your account, with or without notice, if:</p>
          <ul>
            <li>You materially breach these Terms</li>
            <li>You engage in fraudulent, illegal, or harmful activity</li>
            <li>Required by applicable law or regulatory authority</li>
            <li>You fail to pay amounts owed to us</li>
          </ul>
          <p>Termination does not affect rights or obligations that arose before termination, or any provisions of these Terms intended to survive termination.</p>

          <h2>15. Force Majeure</h2>
          <p>Neither party is liable for failure or delay in performance caused by events outside its reasonable control, including but not limited to natural disasters, acts of war, terrorism, government action, epidemics, pandemics, strikes, power failures, or internet outages. The affected party must notify the other promptly and use reasonable efforts to mitigate.</p>

          <h2>16. Governing Law and Dispute Resolution</h2>
          <p>These Terms are governed by the laws of the <strong>Hong Kong Special Administrative Region</strong>, without regard to its conflict-of-laws principles.</p>
          <p>Any dispute arising out of or in connection with these Terms shall first be addressed by good-faith negotiation between the parties. If negotiation fails within 30 days, the dispute shall be referred to and finally resolved by arbitration administered by the <strong>Hong Kong International Arbitration Centre (HKIAC)</strong> under the HKIAC Administered Arbitration Rules in force at the time of submission. The seat of arbitration shall be Hong Kong. The language of arbitration shall be English. The tribunal shall consist of one arbitrator.</p>
          <p>Nothing in this clause prevents either party from seeking interim or injunctive relief from a court of competent jurisdiction.</p>

          <h2>17. Changes to These Terms</h2>
          <p>We may update these Terms from time to time. When we do, we will revise the "Last updated" date at the top of the page. Material changes will be communicated through your dashboard, by email, or by other appropriate means. Your continued use of our services after a change becomes effective constitutes acceptance of the updated Terms.</p>

          <h2>18. General</h2>
          <h3>18.1 Entire Agreement</h3>
          <p>These Terms, together with our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>, constitute the entire agreement between you and Equilinq regarding our services.</p>
          <h3>18.2 Severability</h3>
          <p>If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions remain in full force and effect.</p>
          <h3>18.3 No Waiver</h3>
          <p>Our failure to enforce any right or provision in these Terms does not constitute a waiver of that right or provision.</p>
          <h3>18.4 Assignment</h3>
          <p>You may not assign or transfer your rights or obligations under these Terms without our prior written consent. We may assign our rights and obligations under these Terms as part of a business transfer, merger, or reorganisation.</p>
          <h3>18.5 Language</h3>
          <p>These Terms are written in English. Any translation is provided for convenience only; the English version prevails in case of conflict.</p>

          <h2>19. Platform Compliance Policy</h2>
          <p className="text-sm text-muted-foreground">Last updated: 29 July 2026</p>
          <p>As a sourcing and procurement service platform, Equilinq is committed to providing users with a safe and reliable shopping experience. We respect intellectual property rights. Any products involving intellectual property infringement on the Equilinq platform, such as counterfeit goods or unauthorized goods, are strictly prohibited under the platform's compliance policy. Equilinq reserves the right to suspend or terminate relevant services upon discovery of any violation.</p>

          <h3>19.1 Definition of Counterfeit Goods</h3>
          <p>The following types of goods fall within restricted or prohibited categories:</p>
          <ul>
            <li><strong>Counterfeit Goods:</strong> Products that intentionally imitate genuine products without the permission of the brand owner, infringe trademarks or intellectual property rights, and are likely to cause consumer confusion.</li>
            <li><strong>Unauthorized Goods:</strong> Products sold without lawful authorization or formal permission from the intellectual property rights holder.</li>
            <li><strong>Intellectual Property Infringing Goods:</strong> Goods or services that infringe copyrights, trademarks, patents, or third-party proprietary design rights.</li>
            <li><strong>Pirated Goods:</strong> Unauthorized copying and distribution of digital media, such as music, films, videos, or software, without the permission of the copyright owner.</li>
            <li><strong>Brand Misrepresentation:</strong> Falsely claiming that products originate from a well-known brand in a manner that misleads or deceives consumers.</li>
          </ul>

          <h3>19.2 How Equilinq Prevents Counterfeit Goods</h3>
          <p>Equilinq supports users in procuring goods. However, Equilinq itself does not sell any products and only provides sourcing, procurement, and shipping-related services to users. Therefore, Equilinq cannot directly restrict the sale of counterfeit goods on third-party procurement platforms or websites, nor can it impose penalties on sellers on third-party platforms.</p>
          <p>Nevertheless, Equilinq will take the following proactive measures to filter suspected infringing goods to the greatest extent possible:</p>
          <ul>
            <li>Implement a keyword filtering system to restrict the display of search results that clearly involve counterfeit or infringing products.</li>
            <li>Apply stricter platform content controls to high-risk categories, such as luxury goods and electronics.</li>
            <li>
              Conduct regular product compliance reviews to identify and remove suspected infringing goods with the following characteristics:
              <ul>
                <li>Goods displaying brand names or logos without the permission of the intellectual property rights holder.</li>
                <li>Goods whose brands or logos are visually difficult to distinguish from genuine products, but have been slightly modified.</li>
                <li>Goods that deliberately hide or visually alter brand logos to conceal infringement.</li>
                <li>Goods that deliberately misspell well-known brand names.</li>
                <li>Product listings that contain brand names or logos, while the actual products do not bear the corresponding marks.</li>
              </ul>
            </li>
          </ul>
          <p>If you receive goods suspected of being counterfeit, you are advised to immediately stop purchasing such goods and report the matter to Equilinq's customer service department. If you are a rights holder and have any intellectual property concerns, please contact our customer service department to submit a complaint.</p>
          <p><strong>Reporting email:</strong> <a href="mailto:support@equilinq.eu" className="text-primary hover:underline">support@equilinq.eu</a></p>

          <h3>19.3 B2B Supplier Review Process</h3>
          <p>To ensure the compliance of the platform's upstream supply chain, Equilinq conducts systematic compliance reviews of all suppliers involved in B2B procurement activities. The standard review process is as follows:</p>
          <h4>19.3.1 Supplier Onboarding Review</h4>
          <p>Before establishing a business relationship with a new supplier, Equilinq will conduct the following preliminary checks:</p>
          <ul>
            <li><strong>Supplier identity verification:</strong> Verifying the business license, legal representative information, and business qualifications.</li>
            <li><strong>Product category compliance screening:</strong> Confirming that the product categories offered by the supplier do not violate the prohibited or restricted list, including but not limited to counterfeit goods, unauthorized goods, and dual-use goods.</li>
            <li><strong>Brand authorization verification:</strong> For suppliers offering products involving well-known brands, Equilinq requires a brand authorization letter or legitimate purchase invoices traceable to the brand owner.</li>
            <li><strong>Business history and reputation assessment:</strong> Evaluating the supplier's historical compliance performance through publicly available information and platform records.</li>
          </ul>
          <h4>19.3.2 Product Authenticity Due Diligence</h4>
          <p>For officially approved suppliers, Equilinq requires ongoing compliance with the following product integrity control requirements:</p>
          <ul>
            <li>Establishing and maintaining verifiable supplier qualification files, including identification documents, authorization documents, product samples, and quality inspection reports.</li>
            <li>Providing proof of product authenticity for high-risk categories, such as luxury goods, electronics, and branded apparel.</li>
            <li>Conducting regular product list reviews to proactively identify and remove goods suspected of unauthorized brand use or counterfeit risks.</li>
            <li>Where a supplier is found to be involved in counterfeit goods or intellectual property infringement, relevant records shall be retained and made available during compliance audits.</li>
          </ul>
          <h4>19.3.3 Ongoing Monitoring and Periodic Review</h4>
          <p>Equilinq will conduct regular reviews of existing suppliers, with review frequency determined based on risk level:</p>
          <ul>
            <li>High-risk suppliers (categories such as luxury goods and electronics): reviewed quarterly.</li>
            <li>Medium- and low-risk suppliers: reviewed every six months to one year.</li>
            <li>Suppliers from regions historically associated with counterfeit goods compliance risks will be subject to Enhanced Due Diligence, requiring stricter product traceability documentation.</li>
            <li>Any non-compliance identified during periodic reviews will trigger corresponding control measures, as detailed in Section 19.3.4 below.</li>
          </ul>
          <h4>19.3.4 Enforcement Actions</h4>
          <p>If a supplier is found to have engaged in any of the following conduct, Equilinq will take appropriate measures based on the severity of the circumstances:</p>
          <ul>
            <li><strong>Minor violations:</strong> Requiring the supplier to rectify the issue within a specified period and submit a corrective action report.</li>
            <li><strong>Serious violations,</strong> such as actively selling counterfeit goods or providing false authorization documents: immediately suspending cooperation with the supplier and reporting the matter to relevant payment service providers and regulatory authorities.</li>
            <li><strong>Termination of cooperation and blacklisting:</strong> In severe cases, permanently terminating the business relationship and placing the supplier on the platform blacklist.</li>
          </ul>

          <h3>19.4 Disclaimer</h3>
          <h4>19.4.1 Third-Party Liability</h4>
          <p>As a sourcing and procurement service platform, Equilinq is not directly responsible for the quality or authenticity of goods provided by third-party merchants. However, Equilinq will manage suppliers strictly in accordance with this policy and make reasonable efforts to assist users in communicating and resolving disputes arising from product quality or authenticity issues.</p>
          <h4>19.4.2 User Responsibility</h4>
          <p>Users are responsible for ensuring that the goods they purchase comply with the laws and regulations of their country or region. Equilinq shall not assume joint or several liability for any losses or legal liabilities arising from goods that violate local laws or regulations.</p>
          <h4>19.4.3 Updates to Compliance Policy</h4>
          <p>Equilinq will update this policy periodically in accordance with changes in applicable laws, regulations, and compliance requirements. Users and suppliers are advised to review the latest version regularly to avoid any risk of service interruption resulting from policy updates.</p>

          <h2>Contact Us</h2>
          <p>Questions about these Terms can be sent to:</p>
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