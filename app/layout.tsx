import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kinlet — Family Adventures, Simplified",
  description:
    "Kinlet helps families discover kid-friendly places, activities, and hidden gems nearby. Less planning, more exploring.",
  icons: { icon: "/logo.png" },
  other: {
    "facebook-domain-verification": "mch7g0zjaqtd4oyc1o4x9zkzcd6uz6",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
