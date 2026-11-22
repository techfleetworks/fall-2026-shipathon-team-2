"use client";

import { ListGroup, ListRow } from "@/components/ui/list-row";
import { useHydrated, useProfile } from "@/lib/account";

// Area and Services show what this person entered at sign-up (About
// you). Editing them here isn't built yet, so the rows stay "Soon".
export function ProfileRows() {
  const hydrated = useHydrated();
  const profile = useProfile();
  const area = hydrated ? profile?.area || "Not set" : undefined;
  const needs = profile?.needs ?? [];
  const services = hydrated ? (needs.length === 0 ? "Not set" : needs.length >= 3 ? "All services" : needs.join(", ")) : undefined;

  return (
    <ListGroup>
      <ListRow icon="map-pin" title="Area" sub="Where we look for offers" value={area} soon />
      <ListRow icon="tag" title="Services" sub="Shown first in “For you”" value={services} soon />
    </ListGroup>
  );
}
