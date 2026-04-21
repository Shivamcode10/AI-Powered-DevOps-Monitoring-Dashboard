import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enterprise AI Dashboard",
  description: "High-Performance Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-[#020617] text-white relative overflow-hidden">
          {/* Background Blobs */}
          <div className="fixed top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
          
          <div className="flex-1 flex flex-col relative z-10">
            {/* Navbar is ONLY here */}
            <Navbar />
            
            <main className="flex-1 p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}