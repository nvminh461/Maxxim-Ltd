import type { Metadata } from "next";
import { Cormorant_Garamond, Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "300", "400", "500", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Maxxim Ltd. | UK Property Services",
  description:
    "Maxxim Ltd. helps overseas families buy, renovate, and let UK property — trusted end-to-end support near top universities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${cormorantGaramond.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
