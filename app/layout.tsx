import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'animate.css/animate.min.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import BackToTopButton from "./components/BackToTop";

config.autoAddCss = false;

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LockWind | Accommodation Booking Platform",
  description: "LockWind is a short-term accommodation booking platform developed by Loc & Phong.",
  icons: {
    icon: "/img/icon.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}