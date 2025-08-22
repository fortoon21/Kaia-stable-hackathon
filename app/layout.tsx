import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastContainer } from "@/components/ui/Toast";
import { Web3Provider } from "@/lib/web3Provider";

export const metadata: Metadata = {
  title: "TGIF - DeFi Lending Platform",
  description:
    "The future of DeFi lending and leveraged trading on Kaia Network",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
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
        className={`antialiased bg-[#08131f] min-h-screen w-full`}
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
