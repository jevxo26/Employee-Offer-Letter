import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEVXO — Document Automation & Offer Portal",
  description: "Automated offer letter and partnership agreement generator for JEVXO CEO and candidates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
