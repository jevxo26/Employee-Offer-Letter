import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "@/shared/ui/ToastProvider";

export const metadata: Metadata = {
  title: "JEVXO — HR Document Engine",
  description: "Automated Documents generator for JEVXO HR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,700;1,800;1,900&family=Oswald:wght@700&family=Orbitron:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC]">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
