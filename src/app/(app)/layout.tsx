import { Suspense } from "react";
import TabBar from "@/components/tab-bar";
import { AppStoreProvider } from "@/lib/store";

// Shell for the signed-in app: scrollable content + a bottom tab bar.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col">
        <div className="flex-1 pb-2">{children}</div>
        <Suspense fallback={<div className="h-16 border-t border-border" />}>
          <TabBar />
        </Suspense>
      </div>
    </AppStoreProvider>
  );
}
