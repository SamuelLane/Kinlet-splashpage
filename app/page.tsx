import Link from "next/link";

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Kinlet" className="hero-icon" />
          <h1>
            Family adventures, <em>simplified</em>
          </h1>
          <p>
            Kinlet helps parents discover kid-friendly places, activities, and
            hidden gems — all tailored to your family. Less planning, more
            exploring together.
          </p>
          <div className="hero-badge">
            <span className="dot"></span>
            Coming soon to the App Store
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-header">
          <h2>Built for busy families</h2>
          <p>
            Everything you need to find great places and make the most of your
            time together.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon peach">📍</div>
            <h3>Discover nearby</h3>
            <p>
              Find family-friendly restaurants, parks, play spaces, and
              activities near you — curated for families with young kids.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon sage">🗺️</div>
            <h3>Location-aware</h3>
            <p>
              Get personalized recommendations based on where you are, so you
              always know what&apos;s great around the corner.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon sky">👨‍👩‍👧‍👦</div>
            <h3>Made for families</h3>
            <p>
              Every recommendation is vetted for kid-friendliness. No more
              guessing if a spot works for your little ones.
            </p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-box">
          <h2>Ready to explore?</h2>
          <p>
            Kinlet is coming soon. Have a question or want to get in touch?
            We&apos;d love to hear from you.
          </p>
          <a href="mailto:admin@trykinlet.com" className="cta-email">
            ✉️ admin@trykinlet.com
          </a>
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
