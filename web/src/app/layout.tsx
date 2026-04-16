import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "oslife — מערכת ההפעלה של החיים",
  description: "דשבורד אישי — לוז, תקציב, השקעות, צ׳אט חכם ועוד",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#050510",
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
      <body className="min-h-full flex bg-bg-primary">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-y-auto md:mr-[72px]">
          {children}
        </main>
      </body>
    </html>
  );
}
