import { Screen, ScreenBody } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { NavBar } from "@/components/ui/nav-bar";
import { ListGroup, ListRow } from "@/components/ui/list-row";
import { NotificationSettings } from "./notification-settings";

// H3s · Settings. Area and search preferences have no screen yet ("Soon");
// language and accessibility are informational for the LA County pilot.
export default function SettingsPage() {
  return (
    <Screen>
      <PageHeader title="Settings" backHref="/account" />
      <ScreenBody className="pt-2">
        <ListGroup>
          <ListRow icon="map-pin" title="Area" sub="Where we look for offers" value="Downtown LA" soon />
          <ListRow icon="sliders" title="Search preferences" sub="Service, time of day, travel" value="2 set" soon />
        </ListGroup>

        <ListGroup className="mt-3">
          <ListRow icon="globe" title="Language" value="English" soon />
          <ListRow icon="accessibility" title="Accessibility" sub="Text size follows your phone settings" />
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
