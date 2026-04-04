import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "@/app/globals.css";
import HeaderNav from "@/components/headerNav";
import Footer from "@/components/footer";

const bebasNeue = localFont({
  src: [
    {
      path: "../../public/fonts/bebas-neue.woff2",
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

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: [ "400", "500", "600", "700", "800" ],
  variable: "--font-dm-sans",
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
      className={`${bebasNeue.variable} ${bebasNeueGoogle.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex flex-col">
        <HeaderNav/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
