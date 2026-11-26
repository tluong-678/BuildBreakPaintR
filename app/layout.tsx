import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build, Break, Paint!",
  description: "A creative block-building sandbox game."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
