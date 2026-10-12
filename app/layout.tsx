import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Shell } from "@/components/layout/Shell";
import { JsonLd, personJsonLd, siteDescription, siteTitle, siteUrl } from "@/lib/seo";
import { profile } from "@/content/profile";
import "./globals.css";

// Fonts are subset to the characters the site uses (Latin + a few symbols): ~47 KB in total.
// Geist Sans keeps only the 400–500 weight range; Geist Mono is a static 400.
const geistSans = localFont({
  src: "../assets/fonts/Geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "400 500",
  display: "swap",
});
const geistMono = localFont({
  src: "../assets/fonts/GeistMono-400-latin.woff2",
  variable: "--font-geist-mono",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
const instrument = localFont({
  src: [
    { path: "../assets/fonts/InstrumentSerif-normal.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/InstrumentSerif-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
  fallback: ["Times New Roman", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s · ${profile.name}` },
  description: siteDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: [
    "Utkarsh Khanna",
    "Generative AI",
    "Data Engineer",
    "LLM fine-tuning",
    "LoRA",
    "RAG",
    "Azure",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: profile.name,
    title: siteTitle,
    description: siteDescription,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080b" },
    { media: "(prefers-color-scheme: light)", color: "#f5f3ee" },
  ],
  colorScheme: "dark light",
};

// Runs before first paint: theme, motion flags, and whether the once-per-session preloader shows.
const bootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme');d.dataset.theme=t==='light'?'light':'dark';d.classList.add('motion');var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=sessionStorage.getItem('uk-preloaded');if(!rm&&!seen&&location.pathname==='/'){d.classList.add('preload')}else if(!rm){d.classList.add('reveal')}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <JsonLd data={personJsonLd()} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Shell />
        <Header />
        <div className="relative z-10">{children}</div>
        <Footer />
        <div aria-hidden className="grain" />
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
