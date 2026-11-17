import { Suspense } from "react";
import TabBar from "@/components/tab-bar";

// Shell for the signed-in app: scrollable content + a bottom tab bar.
// (The store provider lives in the root layout so onboarding can use it too.)
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col">
      <div className="flex-1 pb-2">{children}</div>
      <Suspense fallback={<div className="h-16 border-t border-border" />}>
        <TabBar />
      </Suspense>
    </div>
  );
}
