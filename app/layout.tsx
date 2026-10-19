import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Surprises — A little bit of magic",
  description: "A tiny corner of the internet made to remind you how lovely you are.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
