import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const bebasNeue = localFont({
  src: [
    {
      path: "../public/fonts/bebas-neue.woff2",
      weight: "400",
    },
  ],
  variable: "--font-bebas-neue",
});

const bebasNeueGoogle = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  title: "Swing Rides",
  description: "Drive your fleet. Own your data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${bebasNeueGoogle.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
