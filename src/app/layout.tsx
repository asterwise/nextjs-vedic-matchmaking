import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vedic matchmaking with Asterwise",
  description: "Ashtakoot Guna Milan with Rajju and Vedha vetoes in a Next.js app, via the Asterwise TypeScript SDK.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
