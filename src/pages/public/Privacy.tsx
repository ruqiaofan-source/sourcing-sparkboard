import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Privacy Policy - How Equilinq Protects Your Data"
        description="Learn how Equilinq collects, uses, discloses, and protects your personal information."
        keywords="privacy policy, data protection, GDPR, personal information, Equilinq"
        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Privacy Policy", url: "https://equilinq.eu/privacy" },
        ]}
      />
      <PublicNavbar />

      <main className="pt-32 pb-24 px-4">
        <article className="max-w-3xl mx-auto prose prose-sm prose-neutral dark:prose-invert">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2"><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(239 100% 65%), hsl(280 80% 72%), hsl(239 100% 65%))" }}>Privacy</span> Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: 28 December 2025</p>

          <p>
            Welcome to Equilinq ("Equilinq", "we", "us", or "our"). This Privacy Policy explains how we collect, use, disclose, and protect personal information when you visit our website, create an account, or use our services.
          </p>
          <p>
            We are committed to protecting your privacy and handling your personal data in a transparent and secure manner, in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR).
          </p>
          <p>
            By accessing or using our website or services, you acknowledge that you have read and understood this Privacy Policy.
          </p>

          <nav className="my-8 p-4 rounded-xl border border-border/40 bg-card/30">
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li><a href="#information-we-collect" className="text-primary hover:underline">Information We Collect</a></li>
              <li><a href="#how-we-use" className="text-primary hover:underline">How We Use Your Information</a></li>
              <li><a href="#sharing" className="text-primary hover:underline">Sharing Your Information</a></li>
              <li><a href="#cookies" className="text-primary hover:underline">Cookies and Similar Technologies</a></li>
              <li><a href="#your-choices" className="text-primary hover:underline">Your Choices</a></li>
              <li><a href="#security" className="text-primary hover:underline">Security</a></li>
              <li><a href="#childrens-privacy" className="text-primary hover:underline">Children's Privacy</a></li>
              <li><a href="#changes" className="text-primary hover:underline">Changes to This Privacy Policy</a></li>
              <li><a href="#contact-us" className="text-primary hover:underline">Contact Us</a></li>
            </ol>
          </nav>

          <h2 id="information-we-collect">1. Information We Collect</h2>
          <p>We collect personal information that you provide to us directly, as well as information that is collected automatically when you use our website or services.</p>

          <h3>1.1 Information You Provide to Us</h3>
          <p>Depending on how you interact with Equilinq, we may collect the following information:</p>
          <ul>
            <li><strong>Contact information</strong>, such as your name, email address, phone number, company name, and job title, when you contact us or submit an inquiry.</li>
            <li><strong>Account information</strong>, such as login credentials and profile details, when you create an account.</li>
            <li><strong>Service-related information</strong>, including details about products, sourcing requests, specifications, volumes, or other information you submit through the dashboard or communication channels.</li>
            <li><strong>Communications</strong>, including messages, emails, and other correspondence you send to us.</li>
          </ul>
          <p>You are responsible for ensuring that the information you provide is accurate and up to date.</p>

          <h3>1.2 Information We Collect Automatically</h3>
          <p>When you visit our website or use our services, we may automatically collect certain information, including:</p>
          <ul>
            <li><strong>Technical information</strong>, such as IP address, browser type, device type, operating system, and referring URLs.</li>
            <li><strong>Usage information</strong>, such as pages visited, features used, time spent on pages, and interactions with the website or dashboard.</li>
            <li><strong>Cookies and similar technologies</strong>, which help us operate the website, improve functionality, and understand usage patterns. More information about cookies is provided in Section 4.</li>
          </ul>

          <h3>1.3 Information from Third Parties</h3>
          <p>In limited cases, we may receive information from third parties, such as:</p>
          <ul>
            <li>Service providers that support website analytics, hosting, or communication tools.</li>
            <li>Business partners or referrals, where relevant and permitted by law.</li>
          </ul>
          <p>We only collect such information where it is necessary to provide our services or operate our business, and we handle it in accordance with this Privacy Policy.</p>

          <h3>1.4 Special Categories of Data</h3>
          <p>We do not intentionally collect special categories of personal data (such as health, biometric, or government-issued identification data). Please do not provide such information unless explicitly requested and legally required.</p>

          <h2 id="how-we-use">2. How We Use Your Information</h2>
          <p>We use the personal information we collect for the following purposes:</p>
          <ul>
            <li><strong>To provide and operate our services</strong>, including account creation, dashboard access, sourcing coordination, quality control communication, and order-related updates.</li>
            <li><strong>To respond to inquiries and communicate with you</strong>, including answering questions, providing support, and sending service-related messages.</li>
            <li><strong>To improve and maintain our website and services</strong>, including monitoring usage patterns, diagnosing technical issues, and enhancing functionality and user experience.</li>
            <li><strong>To manage business relationships</strong>, including evaluating service requests, onboarding clients, and administering contracts or agreements.</li>
            <li><strong>To send updates and insights</strong>, such as sourcing insights, operational updates, or market-related information, where you have opted in or where permitted by law.</li>
            <li><strong>To comply with legal and regulatory obligations</strong>, including record-keeping, fraud prevention, and enforcement of our terms and policies.</li>
          </ul>
          <p>We do not use your personal information for automated decision-making or profiling that produces legal or similarly significant effects.</p>

          <h2 id="sharing">3. Sharing Your Information</h2>
          <p>We do not sell your personal information.</p>
          <p>We may share your information only in the following limited circumstances:</p>

          <h3>3.1 Service Providers</h3>
          <p>We may share personal information with trusted third-party service providers who assist us in operating our website and services, such as:</p>
          <ul>
            <li>Website hosting and infrastructure providers</li>
            <li>Analytics and performance monitoring services</li>
            <li>Communication and customer support tools</li>
          </ul>
          <p>These providers are authorized to use personal information only as necessary to perform services on our behalf and are contractually obligated to protect it.</p>

          <h3>3.2 Business and Operational Purposes</h3>
          <p>Where necessary to provide our services, we may share limited information with relevant partners (such as manufacturers or logistics providers), <strong>strictly for service execution</strong>, and only to the extent required.</p>

          <h3>3.3 Legal Requirements</h3>
          <p>We may disclose personal information if required to do so by law, regulation, court order, or governmental authority, or where disclosure is necessary to protect our rights, users, or the security of our services.</p>

          <h3>3.4 Business Transfers</h3>
          <p>In the event of a merger, acquisition, restructuring, or sale of assets, personal information may be transferred as part of that transaction, subject to applicable data protection laws.</p>

          <h2 id="cookies">4. Cookies and Similar Technologies</h2>
          <p>We use cookies and similar technologies to ensure the proper functioning of our website and to improve user experience.</p>
          <p>Cookies may be used to:</p>
          <ul>
            <li>Enable core website functionality</li>
            <li>Remember user preferences</li>
            <li>Analyze website usage and performance</li>
            <li>Improve security and reliability</li>
          </ul>
          <p>You can manage or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of the website.</p>
          <p>Where required by law, we obtain your consent before placing non-essential cookies.</p>
          <p>For more details, please see our <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.</p>

          <h2 id="your-choices">5. Your Choices</h2>
          <p>You have certain rights and choices regarding your personal information, subject to applicable law.</p>
          <p>These may include the right to:</p>
          <ul>
            <li><strong>Access</strong> the personal information we hold about you</li>
            <li><strong>Request correction</strong> of inaccurate or incomplete information</li>
            <li><strong>Request deletion</strong> of your personal information, where legally permitted</li>
            <li><strong>Object to or restrict processing</strong> in certain circumstances</li>
            <li><strong>Withdraw consent</strong> where processing is based on consent</li>
          </ul>
          <p>You may also opt out of receiving non-essential communications, such as newsletters or marketing updates, by using the unsubscribe link provided in such communications or by contacting us directly.</p>
          <p>Requests relating to your personal information can be submitted using the contact details provided in Section 9.</p>

          <h2 id="security">6. Security</h2>
          <p>We take reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, misuse, alteration, or disclosure.</p>
          <p>These measures include, where appropriate:</p>
          <ul>
            <li>Secure hosting and infrastructure</li>
            <li>Access controls and authentication measures</li>
            <li>Limited access to personal information on a need-to-know basis</li>
          </ul>
          <p>While we strive to protect your information, no method of transmission or storage is completely secure. We therefore cannot guarantee absolute security, but we continuously review and improve our safeguards.</p>

          <h2 id="childrens-privacy">7. Children's Privacy</h2>
          <p>Our website and services are <strong>not intended for individuals under the age of 18</strong>.</p>
          <p>We do not knowingly collect personal information from children. If you believe that a child has provided us with personal information, please contact us, and we will take appropriate steps to delete such information in accordance with applicable law.</p>

          <h2 id="changes">8. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements.</p>
          <p>When we make changes, we will revise the "Last updated" date at the top of this page. Material changes may be communicated through the website or by other appropriate means.</p>
          <p>We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.</p>

          <h2 id="contact-us">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, our data practices, or your personal information, you may contact us at:</p>
          <p><strong>Website:</strong> <a href="https://equilinq.eu" className="text-primary hover:underline">equilinq.eu</a></p>
          <p><strong>Email:</strong> <a href="mailto:contact@equilinq.eu" className="text-primary hover:underline">contact@equilinq.eu</a></p>
          <p>We will respond to inquiries within a reasonable timeframe and in accordance with applicable data protection laws.</p>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
