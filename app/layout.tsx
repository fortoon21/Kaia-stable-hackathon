import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastContainer } from "@/components/ui/Toast";
import { LAYOUT } from "@/constants/layout";
import { Web3Provider } from "@/lib/web3Provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TGIF - DeFi Lending Platform",
  description:
    "The future of DeFi lending and leveraged trading on Kaia Network",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased ${LAYOUT.BACKGROUND_CLASS} w-full font-body`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <Web3Provider>
            {children}
            <ToastContainer />
          </Web3Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
