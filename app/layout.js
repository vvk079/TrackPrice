import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


export const metadata = {
  title: "dealbee - never pay full again",
  description: "Track prices of your favorite products effortlessly with dealbee.",
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
