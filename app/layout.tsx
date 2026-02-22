import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Registration",
  description: "Register as an agent and start your journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

