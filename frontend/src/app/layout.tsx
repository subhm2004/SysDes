import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sysdes.app";
const OG_TITLE = "SysDes — System Design Simulator";
const OG_DESC =
  "Practice system design interviews with an interactive canvas. Draw architectures, run traffic simulations, and get instant AI scoring — like a real FAANG interview.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: OG_TITLE,
    template: "%s | SysDes",
  },
  description: OG_DESC,
  keywords: [
    "system design",
    "interview prep",
    "distributed systems",
    "software engineering",
    "technical interview",
    "FAANG interview",
    "system design practice",
    "architecture simulator",
  ],
  authors: [{ name: "SysDes" }],
  creator: "SysDes",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    title: OG_TITLE,
    description: OG_DESC,
    siteName: "SysDes",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SysDes — System Design Simulator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESC,
    images: ["/og-image.png"],
    creator: "@sysdes_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/sysdes-icon.svg", type: "image/svg+xml" }],
    apple: "/sysdes-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInit = `(function(){try{var h=document.head;if(h&&!h.querySelector('meta[name="darkreader-lock"]')){var l=document.createElement("meta");l.name="darkreader-lock";h.appendChild(l);}}catch(e){}try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var r=document.documentElement;var t=localStorage.getItem(k);if(t==="light"){r.classList.remove("dark");r.style.colorScheme="light";r.dataset.sysdesTheme="light";}else{r.classList.add("dark");r.style.colorScheme="dark";r.dataset.sysdesTheme="dark";}}catch(e){var r=document.documentElement;r.classList.add("dark");r.style.colorScheme="dark";r.dataset.sysdesTheme="dark";}})();`;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body
        className="min-h-full overflow-x-hidden bg-background text-foreground"
        suppressHydrationWarning
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
