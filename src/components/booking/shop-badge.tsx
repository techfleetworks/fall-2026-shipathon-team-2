import { Icon } from "@/components/ui/icon";
import type { Business } from "@/lib/mock-data";

// Round shop badge on a mint ring (Figma P5 / P6), with a check for a confirmed
// visit. Fresh Cuts' Figma logo export is lettering only, so its badge circle
// and scissors are drawn here; other shops use their photo.
export function ShopBadge({ business, check }: { business: Business; check?: boolean }) {
  return (
    <div className="relative mx-auto mt-4 flex h-40 w-40 items-center justify-center rounded-full bg-status-positive-surface">
      {business.logo ? (
        <div className="flex h-32 w-32 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-status-positive text-on-action">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={business.logo} alt="" className="w-24" />
          <Icon name="scissors" size={32} />
        </div>
      ) : (
        <div className="h-32 w-32 overflow-hidden rounded-full bg-surface-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={business.photo} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      {check && (
        <span className="absolute right-1 bottom-2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface-default bg-status-positive text-on-action">
          <Icon name="check" size={20} title="Visit confirmed" />
        </span>
      )}
    </div>
  );
}
