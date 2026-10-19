
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://surprises.ajmission.dev"),

  title: "My Little Surprises — A little bit of magic",
  description:
    "A tiny corner of the internet made to remind you how lovely you are.",

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },

  openGraph: {
    title: "My Little Surprises ♡",
    description:
      "A tiny corner of the internet made to remind you how lovely you are.",
    url: "https://surprises.ajmission.dev",
    siteName: "My Little Surprises",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Little Surprises — A little bit of magic",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "My Little Surprises ♡",
    description:
      "A tiny corner of the internet made to remind you how lovely you are.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
