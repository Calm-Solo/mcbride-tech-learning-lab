import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "McBride Tech Learning Lab - Make reading feel achievable and fun",
  description: "A modern, multisensory reading platform designed to help children learn to read through engaging games and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <body className={`${inter.variable} ${orbitron.variable} antialiased font-sans`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
