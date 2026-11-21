"use client";

import type { ReactNode } from "react";
import { Screen, ScreenBody, BottomActionBar } from "@/components/ui/screen";
import { IconButton } from "@/components/ui/icon-button";
import { StepBar } from "@/components/ui/step-bar";

// Shared layout for the sign-up steps (O1–O5): back button + step progress,
// scrollable body, and a sticky primary action.
export function StepShell({
  step,
  onBack,
  action,
  children,
}: {
  step: number;
  onBack: () => void;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <Screen>
      <div className="sticky top-0 z-10 bg-surface-default px-2 pt-2 pb-1">
        <div className="flex items-center gap-1">
          <IconButton icon="chevron-left" label="Go back" onClick={onBack} />
          <StepBar step={step} />
        </div>
      </div>
      <ScreenBody className="pt-2">{children}</ScreenBody>
      <BottomActionBar>{action}</BottomActionBar>
    </Screen>
  );
}
