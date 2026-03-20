import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

import { LanguageProvider } from "./context/LanguageContext";

export const metadata = {
  title: "GroupsGuru",
  description: "Exam Intelligence & Predictive Preparation Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative min-h-screen bg-gradient-to-br from-[#0f051d] via-[#12081f] to-[#0a0114] text-white`}
      >
        {/* Global Purple Glow Background */}
        <div className="absolute bottom-[-150px] left-[-150px] w-[600px] h-[400px] bg-purple-700/35 blur-3xl pointer-events-none" />
        <div className="absolute top-[-150px] right-[-150px] w-[600px] h-[400px] bg-purple-700/35 blur-3xl pointer-events-none" />

        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}