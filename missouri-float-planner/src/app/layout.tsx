import type { Metadata } from "next";
import localFont from "next/font/local";
import { Fredoka } from "next/font/google";
import { Providers } from "@/lib/providers";
import SiteHeader from "@/components/layout/SiteHeader";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eddy.guide';

// Using local Geist fonts with CSS variables that match the design system
// In production, these can be swapped for Google Fonts (Space Grotesk, Inter, JetBrains Mono)
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-body",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

// Heading font uses body font for now - in production can use Space Grotesk
const geistHeading = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-heading",
  weight: "100 900",
});

// Fun rounded display font for Eddy branding
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const EDDY_FAVICON_URL = 'https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy_favicon.png';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: EDDY_FAVICON_URL,
    apple: EDDY_FAVICON_URL,
  },
  title: {
    default: "Missouri Float Trip Planner - Meramec, Current, Huzzah Rivers | Eddy",
    template: "%s | Eddy",
  },
  description: "Interactive Missouri float trip planner for Meramec, Current, Huzzah, and 5 more rivers. Live USGS water conditions, float time estimates, access points, and shuttle planning. Perfect for kayaking and canoeing near St. Louis and the Ozarks.",
  keywords: [
    'Missouri float trip',
    'Meramec River float',
    'Current River canoe',
    'Huzzah Creek kayak',
    'float trip planner',
    'Missouri river conditions',
    'USGS water levels',
    'Ozark float trips',
    'float trip near St. Louis',
    'Missouri river map',
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Eddy",
    title: "Missouri Float Trip Planner - Meramec, Current, Huzzah Rivers",
    description: "Interactive Missouri float trip planner with live USGS water conditions, float time estimates, and shuttle planning for 8+ Ozark rivers. Perfect for kayaking near St. Louis.",
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/api/og`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Eddy - Plan Your Missouri Float Trip",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Missouri Float Trip Planner - Live Water Conditions | Eddy",
    description: "Plan your float on Meramec, Current, Huzzah, and 5 more Missouri rivers with real-time USGS data, access points, and float time estimates.",
    images: [
      {
        url: `${BASE_URL}/api/og`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistHeading.variable} ${fredoka.variable} antialiased`}
      >
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
