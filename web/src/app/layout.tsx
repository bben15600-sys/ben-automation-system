import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "הדשבורד שלי",
  description: "מרכז שליטה אישי — לוז, תקציב, השקעות, צ׳אט",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full flex">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-y-auto md:mr-20">
          {children}
        </main>
      </body>
    </html>
  );
}
