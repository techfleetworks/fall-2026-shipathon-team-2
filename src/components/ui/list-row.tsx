import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";
import { NavLink } from "@/components/ui/nav-link";

// Grouped list rows (Figma Account / Settings / Privacy). A row is a link when it
// has `href`; otherwise it is informational, or marked "Soon" when its screen
// isn't built yet — never a dead link. `trailing` replaces the chevron (e.g. a
// Switch).
export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("divide-y divide-border-default overflow-hidden rounded-lg border border-border-default", className)}>
      {children}
    </div>
  );
}

export function ListRow({
  icon,
  title,
  sub,
  value,
  href,
  soon,
  trailing,
}: {
  icon?: IconName;
  title: string;
  sub?: string;
  value?: string;
  href?: string;
  soon?: boolean;
  trailing?: ReactNode;
}) {
  const body = (
    <>
      {icon && <Icon name={icon} size={20} className="shrink-0 text-text-secondary" />}
      <span className="min-w-0 flex-1">
        <span className="block text-title-sm text-text-primary">{title}</span>
        {sub && <span className="block text-body-sm text-text-secondary">{sub}</span>}
      </span>
      {value && <span className="shrink-0 text-body-md text-text-secondary">{value}</span>}
      {trailing}
      {soon && <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-label-sm text-text-secondary">Soon</span>}
      {href && <Icon name="chevron-right" size={20} className="shrink-0 text-text-secondary" />}
    </>
  );
  const cls = "flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left";
  return href ? (
    <NavLink
      href={href}
      dir="forward"
      className={cn(cls, "hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring")}
    >
      {body}
    </NavLink>
  ) : (
    <div className={cls}>{body}</div>
  );
}
