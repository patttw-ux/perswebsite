import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Cursor from "@/components/Cursor";
import MagneticRoot from "@/components/MagneticRoot";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://patrick-wang.vercel.app"),
  title: { default: "Patrick Wang", template: "%s — Patrick Wang" },
  description:
    "Industrial & Operations Engineering + Entrepreneurship at University of Michigan. Building things worth building.",
  openGraph: {
    title: "Patrick Wang",
    description: "IOE + Entrepreneurship @ Michigan",
    url: "https://patrick-wang.vercel.app",
    siteName: "Patrick Wang",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrick Wang",
    description: "IOE + Entrepreneurship @ Michigan",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const noiseTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`;

  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${jetBrainsMono.variable} bg-bg text-ink cursor-none antialiased`}
        style={{ backgroundColor: "#0a0b0f", minHeight: "100%" }}
      >
        <SmoothScroll>
          <MagneticRoot />
          <ScrollProgress />
          <PageTransition>{children}</PageTransition>
        </SmoothScroll>
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[9999] opacity-5 mix-blend-overlay"
          style={{ backgroundImage: noiseTexture, backgroundRepeat: "repeat" }}
        />
        <Cursor />
      </body>
    </html>
  );
}
