import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


export const metadata = {
  title: "TrackPrice - Never Miss a Price Drop",
  description: "Monitor product prices and get notified on price drops",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
