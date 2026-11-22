"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Chip } from "@/components/ui/chip";
import { TextField } from "@/components/ui/text-field";
import { RadioRow, CheckboxRow } from "@/components/ui/choice";
import { Switch } from "@/components/ui/switch";
import { CategoryBadge, StatusBadge, SavePill } from "@/components/ui/badge";
import { LoadingRow } from "@/components/ui/spinner";
import { AppBar, BottomActionBar } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { Tabs } from "@/components/ui/tabs";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-headline-sm text-text-heading">{title}</h2>
      {children}
    </section>
  );
}

export default function ComponentsGallery() {
  const [cat, setCat] = useState("haircut");
  const [when, setWhen] = useState("2-3");
  const [agree, setAgree] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [tab, setTab] = useState("upcoming");

  return (
    <div className="min-h-dvh bg-bg-canvas">
      <div className="mx-auto flex max-w-[430px] flex-col gap-8 bg-surface-default px-5 py-8">
        <header>
          <p className="text-label-md text-action-primary">Phase 1 · component kit</p>
          <h1 className="mt-1 text-display text-text-heading">Components</h1>
        </header>

        <Section title="Buttons">
          <Button variant="filled" fullWidth>Book slot</Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="tonal">Get directions</Button>
            <Button variant="outlined">Change time</Button>
            <Button variant="text">Not now</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="filled" loading loadingLabel="Booking your slot…">Book slot</Button>
            <Button variant="filled" disabled>Continue</Button>
            <Button variant="destructive">Cancel booking</Button>
          </div>
        </Section>

        <Section title="Icon buttons">
          <div className="flex gap-1">
            <IconButton icon="chevron-left" label="Back" />
            <IconButton icon="search" label="Search" />
            <IconButton icon="heart" label="Save to favorites" />
            <IconButton icon="sliders" label="Settings" />
          </div>
        </Section>

        <Section title="Filter chips">
          <div className="flex gap-2 overflow-x-auto">
            {[
              ["haircut", "Haircut"],
              ["laundry", "Laundry"],
              ["care", "Clothing care"],
            ].map(([k, l]) => (
              <Chip key={k} as="tab" selected={cat === k} onClick={() => setCat(k)}>{l}</Chip>
            ))}
          </div>
        </Section>

        <Section title="Text fields">
          <TextField label="Phone number" placeholder="(213) 555-0142" helper="We text you a 6-digit code" inputMode="tel" />
          <TextField label="Verification code" defaultValue="4 8 1 9" error="Enter all 6 digits" inputMode="numeric" />
        </Section>

        <Section title="Radio — single choice">
          <div role="radiogroup">
            <RadioRow label="2–3 pm" checked={when === "2-3"} onChange={() => setWhen("2-3")} />
            <RadioRow label="3–4 pm" checked={when === "3-4"} onChange={() => setWhen("3-4")} />
          </div>
        </Section>

        <Section title="Checkbox & switch">
          <CheckboxRow label="I agree to the terms" checked={agree} onChange={() => setAgree((v) => !v)} />
          <div className="flex items-center justify-between px-4">
            <span className="text-body-lg text-text-primary">Booking reminders</span>
            <Switch label="Booking reminders" checked={reminders} onChange={setReminders} />
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category="haircut">Haircut</CategoryBadge>
            <CategoryBadge category="laundry">Laundry</CategoryBadge>
            <CategoryBadge category="care">Clothing care</CategoryBadge>
            <SavePill>Save $16</SavePill>
            <StatusBadge tone="positive">Confirmed</StatusBadge>
            <StatusBadge tone="danger">Missed</StatusBadge>
          </div>
        </Section>

        <Section title="Loading">
          <LoadingRow label="Booking your slot…" />
        </Section>

        <Section title="Secondary tabs">
          <Tabs
            tabs={[{ key: "upcoming", label: "Upcoming" }, { key: "past", label: "Past" }]}
            active={tab}
            onChange={setTab}
          />
        </Section>

        <Section title="App bar">
          <div className="overflow-hidden rounded-lg border border-border-default">
            <AppBar title="Confirm booking" onBack={() => {}} trailing={<IconButton icon="heart" label="Save" />} />
          </div>
        </Section>

        <Section title="Bottom action bar">
          <div className="overflow-hidden rounded-lg border border-border-default">
            <BottomActionBar><Button variant="filled" fullWidth>Book slot</Button></BottomActionBar>
          </div>
        </Section>

        <Section title="Bottom navigation">
          <div className="overflow-hidden rounded-lg border border-border-default">
            <NavBar active="deals" />
          </div>
        </Section>
      </div>
    </div>
  );
}
