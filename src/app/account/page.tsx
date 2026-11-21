import Link from "next/link";
import type { ReactNode } from "react";
import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { Icon, type IconName } from "@/components/ui/icon";
import { bookingLimit, maskPhone, user } from "@/lib/mock-data";

// H3 · Account. Rows whose screen isn't built yet are shown but not tappable,
// marked "Soon", so nothing leads to a 404.
function Row({ icon, title, sub, href }: { icon?: IconName; title: string; sub?: string; href?: string }) {
  const body: ReactNode = (
    <>
      {icon && <Icon name={icon} size={20} className="text-text-secondary" />}
      <span className="min-w-0 flex-1">
        <span className="block text-title-sm text-text-primary">{title}</span>
        {sub && <span className="block text-body-sm text-text-secondary">{sub}</span>}
      </span>
      {href ? (
        <Icon name="chevron-right" size={20} className="text-text-secondary" />
      ) : (
        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-label-sm text-text-secondary">Soon</span>
      )}
    </>
  );
  const cls = "flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left";
  return href ? (
    <Link
      href={href}
      className={`${cls} hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring`}
    >
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function Group({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 divide-y divide-border-default overflow-hidden rounded-lg border border-border-default">
      {children}
    </div>
  );
}

export default function AccountPage() {
  const limit = bookingLimit(user);
  const limitCopy = limit === "unlimited" ? "No limit" : `${limit} at a time for now`;

  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">Account</h1>

        <div className="mt-5 flex items-center gap-3 rounded-lg border border-border-default px-4 py-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-subtle text-title-md text-on-tint-primary"
          >
            {user.firstName[0]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-title-sm text-text-primary">{user.firstName}</span>
            <span className="block text-body-md text-text-secondary">
              <span className="sr-only">Phone ending in {user.phone.slice(-2)}: </span>
              <span aria-hidden="true">{maskPhone(user.phone)}</span>
            </span>
          </span>
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-label-sm text-text-secondary">Soon</span>
        </div>

        <Group>
          <Row icon="ticket" title="Booking limit" sub={`${limitCopy} · how it works`} />
          <Row icon="sliders" title="Settings" />
        </Group>

        <Group>
          <Row icon="phone" title="Customer support" />
          <Row icon="lock" title="Privacy and your data" href="/privacy" />
        </Group>

        {/* Demo: no real session yet, so "Log out" returns to the start of sign-up. */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/welcome"
            className="inline-flex min-h-[48px] items-center rounded-full px-6 text-label-lg text-action-primary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            Log out
          </Link>
        </div>
      </ScreenBody>
      <NavBar active="account" />
    </Screen>
  );
}
