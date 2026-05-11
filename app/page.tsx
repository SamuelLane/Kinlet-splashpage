import Link from "next/link";
import IPhoneMockup from "@/components/ui/iphone-mockup";
import { PerksCard } from "@/components/perks-card";

export default function Home() {
  return (
    <>
      <nav className="site-nav">
        <Link href="/" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Kinlet" />
          <span>Kinlet</span>
        </Link>
        <div className="nav-links">
          <Link href="/privacy">Privacy</Link>
          <a href="mailto:admin@trykinlet.com">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <span className="hero-h1-line">Family adventures,</span>{" "}
              <em>simplified</em>
            </h1>
            <p>Made for families. Built for the moments in between.</p>
            <a
              href="https://apps.apple.com/us/app/kinlet-family-activity-app/id6758401270"
              target="_blank"
              rel="noopener noreferrer"
              className="app-store-cta"
              aria-label="Download Kinlet on the App Store"
            >
              <svg
                className="app-store-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span className="app-store-text">
                <span className="app-store-eyebrow">Download on the</span>
                <span className="app-store-title">App Store</span>
              </span>
            </a>
          </div>
          <div className="hero-mockup">
            <div className="hero-mockup-scale">
              <IPhoneMockup
                model="15-pro"
                color="natural-titanium"
                wallpaper="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="perks-tease">
        <div className="perks-tease-content">
          <div className="perks-tease-text">
            <span className="perks-tease-eyebrow">Coming soon</span>
            <h2>
              Kinlet <em>Perks</em>
            </h2>
            <p>
              A pocketful of exclusive offers from the family-friendly spots
              your kids already love. One pass, every adventure.
            </p>
            <Link href="/partners" className="perks-tease-cta">
              Become a partner
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="perks-tease-card">
            <PerksCard />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Kinlet" />
            <span>Kinlet</span>
          </div>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <a href="mailto:admin@trykinlet.com">Contact</a>
          </div>
        </div>
        <div className="footer-copy">
          &copy; 2025 Kinlet. All rights reserved.
        </div>
      </footer>
    </>
  );
}
