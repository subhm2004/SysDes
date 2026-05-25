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

export const metadata: Metadata = {
  title: "SysDes — System Design Simulator",
  description: "Interactive system design interview simulator with real-time load testing and scoring",
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
