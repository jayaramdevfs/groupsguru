import { Metadata } from "next";
import "./globals.css";
import { Instrument_Serif, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-serif",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "GroupsGuru — APPSC, TSPSC & UPSC Exam Preparation",
    template: "%s | GroupsGuru",
  },
  description: "Exam Intelligence & Predictive Preparation Engine for APPSC, TSPSC, and UPSC competitive exams. Smart test series, question bank, and study materials.",
  keywords: ["APPSC", "TSPSC", "UPSC", "exam preparation", "GroupsGuru", "test series", "question bank"],
  openGraph: {
    title: "GroupsGuru — Exam Intelligence Platform",
    description: "Smart exam preparation for APPSC, TSPSC & UPSC",
    url: "https://groupsguru.in",
    siteName: "GroupsGuru",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-[family-name:var(--font-sans)] min-h-screen bg-[#191919] text-[#E8E8E8]">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
