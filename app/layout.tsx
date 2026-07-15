import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { ChakraUIProvider } from "@/components/providers/chakraProvider";
import ReduxProvider from "@/components/providers/reduxProvider";
import { SocketProvider } from "@/components/providers/socketProvider";
import { Toaster } from 'sonner';

const bebasNeueGoogle = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={`${bebasNeueGoogle.variable} ${dmSans.variable} h-full antialiased bg-slate-100`}
    >
      <body className="flex flex-col bg-slate-100">
        <ReduxProvider>
          <ChakraUIProvider>
            <SocketProvider>{children}</SocketProvider>
          </ChakraUIProvider>
          <Toaster position="top-right" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}
