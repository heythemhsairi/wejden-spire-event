import type { Metadata, Viewport } from "next";
import { Manrope, Cairo } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: ["300", "400", "500", "600", "700", "800"] });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: "WejdenSpire — Workforce Wellbeing Intelligence",
  description:
    "Transform invisible psychosocial and emotional workforce signals into measurable business intelligence. Measure → Analyze → Act.",
  openGraph: {
    title: "WejdenSpire — Workforce Wellbeing Intelligence",
    description: "The signals your workforce is already sending. You're just not measuring them — yet.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${cairo.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ws-ink antialiased">{children}</body>
    </html>
  );
}
