import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Premium LMS",
  description: "Government Exams Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-[#0f051d] via-[#12081f] to-[#0a0114] text-white`}>
        {children}
      </body>
    </html>
  );
}