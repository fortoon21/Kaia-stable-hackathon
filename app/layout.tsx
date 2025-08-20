import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
