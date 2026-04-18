import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#06060f",
};

export const metadata: Metadata = {
  title: "GoalGlobe — Live Football Worldwide",
  description:
    "Watch every live football match around the world on an interactive 3D globe. Real-time scores, goal scorers, and match events.",
  keywords: ["football", "soccer", "live scores", "globe", "real-time"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
