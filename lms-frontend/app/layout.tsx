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
        className={`${inter.className} relative min-h-screen bg-[#0c051a] text-white overflow-x-hidden`}
      >
        {/* Global Cinematic Glows */}
        <div className="absolute bottom-[-150px] left-[-150px] w-[800px] h-[600px] bg-purple-600/30 blur-[130px] pointer-events-none" />
        <div className="absolute top-[-150px] right-[-150px] w-[800px] h-[600px] bg-indigo-600/20 blur-[130px] pointer-events-none" />

        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}