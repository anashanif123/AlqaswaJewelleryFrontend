import type { Metadata } from "next";
import { Italiana, Jost } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";
import "./pages.css";

const display = Italiana({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Jost({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Al Qaswa — Fine Jewellery", template: "%s — Al Qaswa" },
  description: "Hallmarked gold rings, necklaces, earrings and bridal sets from Lahore.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
