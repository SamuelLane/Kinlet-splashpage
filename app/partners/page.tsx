"use client";

import { useState } from "react";
import Link from "next/link";
import { PassIntakeForm } from "@/components/pass-intake-form";

export default function PartnersPage() {
  const [submitted, setSubmitted] = useState(false);

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

      <main className="partners-page">
        <div className="partners-page-inner">
          <Link href="/" className="partners-back">
            ← Back
          </Link>

          <section className="partners-hero">
            <span className="partners-hero-eyebrow">Kinlet Perks</span>
            <h1>
              Get in front of <em>local families</em> — for free.
            </h1>
            <p className="partners-hero-lede">
              Kinlet Perks is a curated set of offers from family-friendly
              businesses, delivered straight to parents inside the Kinlet app.
              You design the deal, we send engaged local families your way.
            </p>
          </section>

          <div className="cta-box cta-box-form">
            {!submitted && (
              <>
                <h2>Apply to become a partner</h2>
                <p>
                  Tell us about your business and the offer you&apos;d like to
                  run. We&apos;ll be in touch within a few business days.
                </p>
              </>
            )}
            <PassIntakeForm
              onStatusChange={(status) => setSubmitted(status === "success")}
            />
          </div>
        </div>
      </main>

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
