import type { Metadata, Viewport } from "next";
import { Heebo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "oslife — מערכת ההפעלה של החיים",
  description: "דשבורד אישי — לוז, תקציב, השקעות, צ׳אט חכם ועוד",
};

export const viewport: Viewport = {
  themeColor: "#060a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full bg-bg-base">
        <Navigation />
        <main className="pt-16 pb-20 md:pt-20 md:pb-8 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
