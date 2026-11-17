import type { Metadata } from "next";
import "./globals.css";
import { PageTransitionProvider } from "@/components/ui/PageTransition";
import { BackgroundSettingsProvider } from "@/components/ui/BackgroundSettings";
import { ConditionalBackground } from "@/components/ui/ConditionalBackground";
import { ConditionalHeader } from "@/components/layout/ConditionalHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: "akryst · frontend",
  description: "Public frontend layout demo.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        <BackgroundSettingsProvider>
          <PageTransitionProvider>
            <ConditionalBackground />
            <ConditionalHeader />
            {children}
          </PageTransitionProvider>
        </BackgroundSettingsProvider>
      </body>
    </html>
  );
}
