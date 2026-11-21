import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { AccountBar, AccountBarPlaceholder } from "@/components/account-bar";
import "./globals.css";
import { AppStoreProvider } from "@/lib/store";

// Sparetime type system (see globals.css / Figma):
//   Bricolage Grotesque — display & headlines (Bold)
//   Plus Jakarta Sans    — titles, body, labels, buttons
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sparetime · Shipathon Team 2",
    template: "%s · Sparetime",
  },
  description:
    "Discounted off-peak services from small local businesses for low-income individuals and families in LA County.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={<AccountBarPlaceholder />}>
          <AccountBar />
        </Suspense>
        <AppStoreProvider>{children}</AppStoreProvider>
      </body>
    </html>
  );
}
