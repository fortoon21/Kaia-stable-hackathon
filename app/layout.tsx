import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastContainer } from "@/components/ui/Toast";
import { Web3Provider } from "@/lib/web3Provider";

export const metadata: Metadata = {
  title: "Kaia Hackathon App",
  description: "Frontend application for Kaia hackathon",
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
