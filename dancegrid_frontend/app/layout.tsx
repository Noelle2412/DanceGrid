import type { Metadata } from "next";
import { Tomorrow, Lato, Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieProviderWrapper from "@/components/providers/CookieProviderWrapper";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const tomorrow = Tomorrow({
  weight: "500",
  variable: "--font-tomorrow",
});

const lato = Lato({ weight: "400", variable: "--font-lato" });

export const metadata: Metadata = {
  title: "DanceGrid",
  description: "Generate Choreography Pictures for Formation Dancing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        tomorrow.variable,
        lato.variable,
        "font-sans",
        geist.variable,
      )}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class">
          <CookieProviderWrapper>
            <Navbar />
            <main className="min-w-fit bg-bg p-4 grow">{children}</main>
            <Footer />
          </CookieProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
