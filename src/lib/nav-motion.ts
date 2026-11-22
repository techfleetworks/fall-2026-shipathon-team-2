import type { useRouter } from "next/navigation";

// Page animations: the link or button that starts a navigation says which way it
// goes, and the next screen plays a matching CSS entrance (see usePageEnter and
// globals.css). forward = going deeper (slides in from the right), back =
// returning to a parent (slides in from the left), tab = switching bottom tabs
// (quick fade, no slide). Untagged navigations (browser back, swipe-back,
// redirects) don't animate.
export type NavDir = "forward" | "back" | "tab";

let pending: { dir: NavDir; at: number } | null = null;

/** For <Link onNavigate={markNav("forward")}>. */
export const markNav = (dir: NavDir) => () => {
  pending = { dir, at: Date.now() };
};

/** router.push with a direction. */
export function go(router: ReturnType<typeof useRouter>, href: string, dir: NavDir) {
  pending = { dir, at: Date.now() };
  router.push(href);
}

/** The direction of the navigation that just happened, if any (recent only). */
export function currentNav(): NavDir | null {
  return pending && Date.now() - pending.at < 1500 ? pending.dir : null;
}
