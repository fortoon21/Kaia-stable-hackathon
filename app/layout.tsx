import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastContainer } from "@/components/ui/Toast";
import { LAYOUT } from "@/constants/layout";
import { Web3Provider } from "@/lib/web3Provider";

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
        className={`antialiased ${LAYOUT.BACKGROUND_CLASS} w-full`}
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
