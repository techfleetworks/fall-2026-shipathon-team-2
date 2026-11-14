import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display font for headings — warm, friendly serif (per DESIGN.md).
const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// UI & body font — clean, friendly humanist sans.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Monospace for prices, distances and pickup times (tabular alignment).
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Plenty · Shipathon Team 2",
    template: "%s · Plenty",
  },
  description:
    "Surplus groceries from small local stores for low-income families in LA County.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${jakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
