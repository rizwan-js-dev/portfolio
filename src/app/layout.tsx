import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rizwan Shaikh — Senior Full Stack Engineer",
  description:
    "Senior Full Stack Engineer with 10+ years of experience building multi-tenant SaaS platforms and high-concurrency systems with React, Node.js, TypeScript and AWS.",
  openGraph: {
    title: "Rizwan Shaikh — Senior Full Stack Engineer",
    description:
      "Multi-tenant SaaS, high-concurrency system design and MERN stack leadership.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
