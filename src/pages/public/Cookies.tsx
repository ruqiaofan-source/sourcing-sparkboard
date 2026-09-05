import { SEOHead } from "@/components/SEOHead";
import { PublicNavbar, PublicFooter } from "@/components/PublicLayout";
import { Link } from "react-router-dom";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Cookie Policy - How Equilinq Uses Cookies & Tracking"
        description="Learn about the cookies and similar technologies Equilinq uses on its website."
        keywords="cookie policy, cookies, tracking, website cookies, Equilinq"

        breadcrumbs={[
          { name: "Home", url: "https://equilinq.eu/" },
          { name: "Cookie Policy", url: "https://equilinq.eu/cookies" },
        ]}
      />
      <PublicNavbar />

      <main className="relative bg-card">
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <article className="prose prose-sm mx-auto max-w-3xl prose-headings:font-display prose-headings:text-primary prose-h1:text-3xl prose-p:text-body-ink prose-li:text-body-ink prose-strong:text-foreground prose-a:text-primary">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Cookie Policy</h1>
          <p className="label-mono-up mb-10 text-muted-foreground">Last updated: 28 December 2025</p>

          <p>
            This Cookie Policy explains how Equilinq ("we", "us", or "our") uses cookies and similar technologies when you visit our website at <a href="https://equilinq.eu" className="text-primary hover:underline">equilinq.eu</a>.
          </p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information.
          </p>

          <h2>How We Use Cookies</h2>
          <p>We use the following types of cookies:</p>

          <h3>Strictly Necessary Cookies</h3>
          <p>
            These cookies are essential for the website to function properly. They enable core features such as authentication, session management, and security. These cookies cannot be disabled.
          </p>
          <div className="my-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-band text-white"><th className="text-left p-3">Cookie</th><th className="text-left p-3">Purpose</th><th className="text-left p-3">Duration</th></tr></thead>
              <tbody>
                <tr className="border-t border-border"><td className="p-3">sb-*-auth-token</td><td className="p-3">Authentication session</td><td className="p-3">Session</td></tr>
                <tr className="border-t border-border"><td className="p-3">cookie_consent</td><td className="p-3">Stores your cookie preferences</td><td className="p-3">1 year</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the website experience.
          </p>

          <h3>Functional Cookies</h3>
          <p>
            These cookies enable enhanced functionality and personalization, such as remembering your theme preference (light/dark mode).
          </p>

          <h2>Managing Cookies</h2>
          <p>
            When you first visit our website, you will be shown a cookie consent banner where you can accept or decline non-essential cookies.
          </p>
          <p>
            You can also manage cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul>
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
          <p>
            Please note that blocking or deleting cookies may affect the functionality of some parts of our website.
          </p>

          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies on our website may be placed by third-party services we use (such as analytics providers or embedded content). We do not control these cookies. Please refer to the respective third-party privacy policies for more information.
          </p>

          <h2>Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. When we make changes, we will update the "Last updated" date at the top of this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at{" "}
            <a href="mailto:contact@equilinq.eu" className="text-primary hover:underline">contact@equilinq.eu</a>.
          </p>
          <p>
            For more information about how we handle your personal data, please see our{" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </article>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
