"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Screen, ScreenBody, AppBar, BottomActionBar } from "@/components/ui/screen";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { InfoBox } from "@/components/ui/info-box";
import { Icon } from "@/components/ui/icon";
import { demoBooking, getBusiness, getService, savings } from "@/lib/mock-data";

// R6 · Confirm booking. Uses the canonical demo booking (Fresh Cuts · Haircut).
export default function ConfirmPage() {
  const router = useRouter();
  const [remind, setRemind] = useState(true);
  const business = getBusiness(demoBooking.businessId)!;
  const service = getService(demoBooking.serviceId)!;
  const save = savings(service);

  return (
    <Screen>
      <AppBar title="Confirm booking" onBack={() => router.push(`/offer/${service.id}/time`)} />
      <ScreenBody>
        {/* Summary */}
        <div className="overflow-hidden rounded-lg border border-border-default">
          <div className="flex items-center gap-3 p-4">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={business.photo} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-title-sm text-text-primary">{business.name}</p>
              <p className="text-body-md text-text-secondary">{service.name}</p>
              <p className="text-body-sm text-text-secondary">1420 W 7th St, Westlake · {business.distanceMi} mi</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-4 border-t border-border-default p-4">
            <div>
              <p className="text-label-md text-text-secondary">When</p>
              <p className="text-body-lg text-text-primary">Tue 24, 2:30–3:00 pm</p>
            </div>
            <div className="text-right">
              <p className="text-label-md text-text-secondary">Total</p>
              <p className="text-body-lg text-text-primary">${service.offPeakPrice}</p>
            </div>
            <div>
              <p className="text-label-md text-text-secondary">Payment</p>
              <p className="text-body-lg text-text-primary">Cash on arrival</p>
            </div>
            <div className="text-right">
              <p className="text-label-md text-text-secondary">Booking ID</p>
              <p className="text-body-lg text-text-primary">{demoBooking.ref}</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mt-4 overflow-hidden rounded-lg border border-border-default">
          <div className="flex items-center gap-3 p-4">
            <Icon name="clock" size={22} className="text-text-secondary" />
            <div className="flex-1">
              <p className="text-title-sm text-text-primary">Remind me 1 hour before</p>
              <p className="text-body-sm text-text-secondary">At 1:30 pm, by notification</p>
            </div>
            <Switch label="Remind me 1 hour before" checked={remind} onChange={setRemind} />
          </div>
          <button className="flex w-full items-center gap-3 border-t border-border-default p-4 text-left">
            <Icon name="map-pin" size={22} className="text-text-secondary" />
            <div className="flex-1">
              <p className="text-title-sm text-text-primary">Getting there</p>
              <p className="text-body-sm text-text-secondary">4 min walk from 7th St/Metro · {business.distanceMi} mi</p>
            </div>
            <Icon name="chevron-right" size={20} className="text-text-secondary" />
          </button>
          <button className="flex w-full items-center gap-3 border-t border-border-default p-4 text-left">
            <Icon name="user" size={22} className="text-text-secondary" />
            <div className="flex-1">
              <p className="text-title-sm text-text-primary">Booking name</p>
              <p className="text-body-sm text-text-secondary">Dana · the shop sees first name only</p>
            </div>
            <Icon name="chevron-right" size={20} className="text-text-secondary" />
          </button>
        </div>

        <InfoBox className="mt-4">
          Fresh Cuts closes at 7 pm. Cancel by Tuesday, 12:30 pm. Later counts as a missed booking.
        </InfoBox>
      </ScreenBody>

      <BottomActionBar>
        <p className="mb-2 text-center text-body-sm text-accent-primary">You save ${save} · pay ${service.offPeakPrice} cash at the shop</p>
        <Button fullWidth onClick={() => router.push(`/booked/${demoBooking.id}`)}>Book slot</Button>
      </BottomActionBar>
    </Screen>
  );
}
