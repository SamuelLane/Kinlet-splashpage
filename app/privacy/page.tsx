import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Kinlet",
};

export default function Privacy() {
  return (
    <>
      <nav className="site-nav">
        <Link href="/" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Kinlet" />
          <span>Kinlet</span>
        </Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <a href="mailto:admin@trykinlet.com">Contact</a>
        </div>
      </nav>

      <main className="legal">
        <h1>Privacy Policy</h1>
        <p className="updated">Last updated: April 28, 2026</p>

        <p>
          Kinlet (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you use
          our mobile application (&quot;the App&quot;). Please read this policy
          carefully. By using the App, you agree to the collection and use of
          information in accordance with this policy.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Location Data:</strong> With your permission, we collect
            your device&apos;s location to provide location-based recommendations
            and features. You can disable location access through your device
            settings at any time.
          </li>
          <li>
            <strong>Account Information:</strong> If you create an account, we
            may collect your name, email address, and profile information.
          </li>
          <li>
            <strong>Content You Save:</strong> When you share links from other
            apps (such as Instagram, TikTok, or websites), the App saves the
            URL, page title, description, and image URL. Activities and recipes
            extracted from those links are also stored, including name,
            description, materials, steps, notes, and category.
          </li>
          <li>
            <strong>Preferences:</strong> During onboarding, you select your
            goals, engagement frequency, children&apos;s age ranges, and
            activity interests. These preferences are stored with your account.
          </li>
          <li>
            <strong>Device Information:</strong> We may collect information
            about your device, including device type, operating system, and
            unique device identifiers.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve the App and its features</li>
          <li>Deliver personalized, location-based recommendations</li>
          <li>
            Process shared links using AI to extract activity, recipe, and
            location information
          </li>
          <li>
            Communicate with you about updates, support, and new features
          </li>
          <li>
            Protect against fraud, unauthorized access, and other illegal
            activity
          </li>
        </ul>

        <h2>3. Sharing of Information</h2>
        <p>
          We do not sell your personal information. We may share your
          information only in the following circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> We share information with the
            following trusted third-party service providers who assist us in
            operating the App:
            <ul>
              <li>
                <strong>Supabase</strong> — cloud database and authentication.
                Hosts all user data.
              </li>
              <li>
                <strong>Perplexity AI</strong> — processes shared URLs to
                extract activity, recipe, and location information. Receives
                the URL and page metadata (title, description, caption text).
                Does not receive your account information.
              </li>
              <li>
                <strong>RevenueCat</strong> — manages subscriptions and in-app
                purchases. Receives an anonymous user identifier.
              </li>
              <li>
                <strong>PostHog</strong> — product analytics. Receives event
                data about how you use the App (such as screens viewed and
                features used), your Kinlet user ID (a UUID — not your name or
                email), and standard device and session metadata (device type,
                operating system, app version, IP address, timestamps). See{" "}
                <a href="https://posthog.com/privacy">posthog.com/privacy</a>.
              </li>
              <li>
                <strong>Apple</strong> — provides Sign in with Apple
                authentication.
              </li>
            </ul>
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose information if
            required to do so by law or in response to valid requests by public
            authorities.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger,
            acquisition, or sale of assets, your information may be transferred
            as part of that transaction.
          </li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. However, no method of
          transmission over the internet or electronic storage is completely
          secure, and we cannot guarantee absolute security.
        </p>

        <h2>5. Children&apos;s Privacy</h2>
        <p>
          Kinlet is designed for use by parents and families. We do not
          knowingly collect or store personal information from anyone under the
          age of 18. The App is intended to be used by adults, including
          parents and guardians, to discover family-friendly activities and
          places. If you believe we have inadvertently collected information
          from someone under 18, please contact us immediately and we will take
          steps to delete it.
        </p>

        <h2>6. Third-Party Services</h2>
        <p>The App integrates with the following third-party services:</p>
        <ul>
          <li>
            Supabase (<a href="https://supabase.com">supabase.com</a>) —
            database and authentication
          </li>
          <li>
            Perplexity AI (<a href="https://perplexity.ai">perplexity.ai</a>) —
            AI-powered content extraction
          </li>
          <li>
            RevenueCat (<a href="https://revenuecat.com">revenuecat.com</a>) —
            subscription management
          </li>
          <li>
            PostHog (<a href="https://posthog.com">posthog.com</a>) — product
            analytics
          </li>
          <li>Apple Sign-In — authentication</li>
        </ul>
        <p>
          Shared URLs and AI extraction results may be cached on our servers
          for up to 7 days to improve performance. We are not responsible for
          the privacy practices of these third-party services. We encourage you
          to read the privacy policies of any third-party services you interact
          with.
        </p>

        <h2>7. Your Choices</h2>
        <p>You have the following choices regarding your information:</p>
        <ul>
          <li>
            <strong>Location:</strong> You can enable or disable location
            services through your device settings.
          </li>
          <li>
            <strong>Account:</strong> You can delete your account directly
            within the App by going to Profile &gt; Delete Account. This
            permanently removes your personal data. You can also update your
            account information within the App or by contacting us.
          </li>
          <li>
            <strong>Notifications:</strong> You can enable or disable push
            notifications through your device settings.
          </li>
          <li>
            <strong>Communications:</strong> You can opt out of promotional
            communications by following the unsubscribe instructions in those
            messages.
          </li>
        </ul>

        <h2>8. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy. Account data is
          retained until you delete your account. Shared URLs and AI extraction
          results are cached for up to 7 days. Product analytics data is
          retained in accordance with our analytics provider&apos;s retention
          settings.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new policy on this page and
          updating the &quot;Last updated&quot; date. Your continued use of the
          App after changes are posted constitutes your acceptance of the
          updated policy.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us at:
        </p>
        <p>
          <a href="mailto:admin@trykinlet.com">admin@trykinlet.com</a>
        </p>
      </main>

      <footer className="legal-footer">
        &copy; 2025 Kinlet. All rights reserved.
      </footer>
    </>
  );
}
