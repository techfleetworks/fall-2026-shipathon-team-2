"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SparetimeLogo, BRAND_GRADIENT } from "@/components/brand/logo";

// O0a · Splash. Brief brand moment, then advances to Welcome.
export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/welcome"), 1400);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-dvh w-full" style={{ background: BRAND_GRADIENT }}>
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col items-center justify-center px-8 text-center">
        <SparetimeLogo size={96} />
        <h1 className="mt-5 text-headline-lg text-text-heading">Sparetime</h1>
        <p className="mt-2 text-body-lg text-text-secondary">Cheaper services at quieter times in LA County</p>
      </div>
    </div>
  );
}
