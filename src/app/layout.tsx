import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { AccountBar, AccountBarPlaceholder } from "@/components/account-bar";
import "./globals.css";
import { AppStoreProvider } from "@/lib/store";

// One sans family for the whole app. On Apple devices the CSS stack prefers the
// native system font (SF Pro); Inter is the look-alike webfont for everywhere else.
// See DESIGN.md.
const inter = Inter({
  variable: "--font-body",
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={<AccountBarPlaceholder />}>
          <AccountBar />
        </Suspense>
        <AppStoreProvider>{children}</AppStoreProvider>
      </body>
    </html>
  );
}
