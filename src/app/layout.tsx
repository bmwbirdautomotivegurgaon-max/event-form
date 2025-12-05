import type { Metadata } from "next";
import "./globals.css";
import { bmwBold, bmwLight } from "./fonts";

export const metadata: Metadata = {
  title: "PVR INOX | Bird Automotive | EO Gurgaon",
  description:
    "PVR INOX | Bird Automotive | EO Gurgaon Banner Event Registration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bmwBold.variable} ${bmwLight.variable} antialiased`}
        style={{ fontFamily: "var(--font-bmw-light)" }}
      >
        {children}
      </body>
    </html>
  );
}
