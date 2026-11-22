"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { markNav, type NavDir } from "@/lib/nav-motion";

// A Link that says which way it navigates, for the page entrance animation.
// Use this from Server Components (they can't pass onNavigate themselves).
export function NavLink({ dir, ...props }: ComponentProps<typeof Link> & { dir: NavDir }) {
  return <Link {...props} onNavigate={markNav(dir)} />;
}
