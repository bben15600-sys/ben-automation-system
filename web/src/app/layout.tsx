import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "oslife — מערכת ההפעלה של החיים",
  description: "דשבורד אישי — לוז, תקציב, השקעות, צ׳אט חכם ועוד",
};

export const viewport: Viewport = {
  themeColor: "#f0f2f5",
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
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full bg-bg-primary">
        <Navigation />
        <main className="pt-16 pb-20 md:pb-6 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
