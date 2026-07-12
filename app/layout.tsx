import type { Metadata } from "next";
import { Orbitron, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import SplashScreen from "@/components/SplashScreen";
import AssistantWidget from "@/components/AssistantWidget";
import MusicPlayer from "@/components/MusicPlayer";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carzo — Scale Models & RC Cars",
  description:
    "Carzo: India's playground for die-cast scale model cars and high-performance RC cars. Cash on delivery across India.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen antialiased">
        <SplashScreen />
        <CartProvider>{children}</CartProvider>
        <AssistantWidget />
        <MusicPlayer />
      </body>
    </html>
  );
}
