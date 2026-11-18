import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";
import "./pages.css";

const body = Poppins({ weight: ["300", "400", "500", "600"], subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Al Qaswa — Artificial Jewellery Store in Pakistan", template: "%s – Al Qaswa" },
  description: "Premium artificial jewellery: earrings, bangles, rings, sets, bridal sets and pendants. Cash on delivery across Pakistan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={body.variable}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
