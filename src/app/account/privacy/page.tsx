import { Screen, ScreenBody } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { NavBar } from "@/components/ui/nav-bar";
import { ListGroup, ListRow } from "@/components/ui/list-row";
import { DeleteAccount } from "./delete-account";

// H3p · Privacy and your data. Retention periods follow docs/privacy-and-retention.md.
const KEPT = [
  { title: "Phone number", why: "To sign you in and text your bookings" },
  { title: "First name", why: "So the business knows who to expect" },
  { title: "Bookings", why: "Shown in My bookings, kept for 12 months" },
  { title: "Area and preferences", why: "To show offers near you" },
];

export default function PrivacyAndDataPage() {
  return (
    <Screen>
      <PageHeader title="Privacy and your data" backHref="/account" />
      <ScreenBody className="pt-2">
        <p className="text-body-lg text-text-primary">We don&apos;t ask about your income. We don&apos;t sell your data.</p>

        <h2 className="mt-4 mb-2 text-label-md text-text-secondary">What we keep, and why</h2>
        <ListGroup>
          {KEPT.map((k) => (
            <ListRow key={k.title} title={k.title} sub={k.why} />
          ))}
        </ListGroup>

        <ListGroup className="mt-3">
          <ListRow icon="shield" title="Privacy policy" href="/privacy" />
          <ListRow icon="lock" title="Download my data" sub="We email you a copy within 30 days" soon />
        </ListGroup>

        <DeleteAccount />
      </ScreenBody>
      <NavBar active="account" />
    </Screen>
  );
}
