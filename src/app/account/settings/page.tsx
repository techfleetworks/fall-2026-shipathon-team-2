import { Screen, ScreenBody } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { NavBar } from "@/components/ui/nav-bar";
import { ListGroup, ListRow } from "@/components/ui/list-row";
import { NotificationSettings } from "./notification-settings";
import { ProfileRows } from "./profile-rows";

// H3s · Settings. Area, search preferences, language and accessibility have no
// screen yet, so they're marked "Soon" for the LA County pilot.
export default function SettingsPage() {
  return (
    <Screen>
      <PageHeader title="Settings" backHref="/account" />
      <ScreenBody className="pt-2">
        <ProfileRows />

        <ListGroup className="mt-3">
          <ListRow icon="globe" title="Language" value="English" soon />
          <ListRow icon="accessibility" title="Accessibility" sub="Text size and display options" soon />
        </ListGroup>

        <h2 className="mt-5 mb-2 text-label-md text-text-secondary">Notifications</h2>
        <NotificationSettings />

        <ListGroup className="mt-3">
          <ListRow icon="shield" title="Terms of service" href="/terms" />
        </ListGroup>

        <p className="mt-4 text-center text-body-sm text-text-secondary">Sparetime 1.0 · LA County pilot</p>
      </ScreenBody>
      <NavBar active="account" />
    </Screen>
  );
}
