"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SparetimeLogo, BRAND_GRADIENT } from "@/components/brand/logo";

// O0 · Welcome. Leads with the everyday benefit. Get started / Sign in both begin
// the phone + one-time-code flow.
export default function Welcome() {
  const router = useRouter();
  return (
    <div className="min-h-dvh w-full bg-bg-canvas">
      <div className="relative mx-auto flex min-h-dvh max-w-[430px] flex-col">
        <div
          className="flex flex-1 flex-col items-center justify-center px-8 text-center"
          style={{ background: BRAND_GRADIENT }}
        >
          <SparetimeLogo size={72} />
          <p className="mt-4 text-title-lg text-text-heading">Sparetime</p>
          <h1 className="mt-3 text-headline-lg text-text-heading">Cheaper services at quieter times</h1>
        </div>

        <div className="rounded-t-[28px] bg-surface-default px-6 pt-7 pb-[max(24px,env(safe-area-inset-bottom))] shadow-e3">
          <h2 className="text-title-lg text-text-heading">Local shops post their slow hours at lower prices.</h2>
          <p className="mt-2 text-body-lg text-text-secondary">
            Free to book. You pay in cash at the shop. Sign up with your phone number.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Button fullWidth onClick={() => router.push("/phone")}>Get started</Button>
            <Button variant="outlined" fullWidth onClick={() => router.push("/phone")}>Sign in</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
