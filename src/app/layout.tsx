import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "WejdenSpire — Intelligence du bien-être au travail",
  description:
    "Transformez les signaux psychosociaux et émotionnels invisibles de vos effectifs en intelligence d'affaires mesurable. Mesurer → Analyser → Agir.",
  openGraph: {
    title: "WejdenSpire — Intelligence du bien-être au travail",
    description: "Les signaux que votre personnel envoie déjà. Vous ne les mesurez juste pas — encore.",
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
    <html lang="fr" className={manrope.variable}>
      <body className="min-h-screen bg-white font-sans text-ws-ink antialiased">{children}</body>
    </html>
  );
}
