import type { Metadata } from "next";
import AppStoreRedirect from "./AppStoreRedirect";

export const metadata: Metadata = {
  title: "Kinlet — View Place",
  openGraph: {
    title: "Check out this place on Kinlet",
    description: "Discover family-friendly places with Kinlet",
    url: "https://trykinlet.com/place/",
    images: ["https://trykinlet.com/assets/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Check out this place on Kinlet",
    description: "Discover and share amazing places with Kinlet.",
    images: ["https://trykinlet.com/assets/og-image.png"],
  },
};

export default function Place() {
  return (
    <div className="redirect-page">
      <AppStoreRedirect />
      <div className="container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Kinlet" width={80} height={80} />
        <p>Redirecting to the App Store…</p>
        <p>
          <a href="https://apps.apple.com/app/kinlet/id6758401270">
            Tap here if you&apos;re not redirected.
          </a>
        </p>
      </div>
    </div>
  );
}
