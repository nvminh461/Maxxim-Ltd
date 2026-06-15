import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Maxxim Ltd. | Premium Architecture & Construction",
  description:
    "Maxxim Ltd. delivers premium architecture, interiors, and construction solutions. Building Today - Creating Tomorrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorantGaramond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
