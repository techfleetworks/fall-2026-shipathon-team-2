import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { ListGroup, ListRow } from "@/components/ui/list-row";
import { AccountActions, ProfileCard } from "./account-client";
import { BookingLimitRow } from "./limit-client";

// H3 · Account. Customer support has no screen yet, so it's marked "Soon".
export default function AccountPage() {
  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">Account</h1>

        <ProfileCard />

        <ListGroup className="mt-3">
          <BookingLimitRow />
          <ListRow icon="sliders" title="Settings" href="/account/settings" />
        </ListGroup>

        <ListGroup className="mt-3">
          <ListRow icon="phone" title="Customer support" soon />
          <ListRow icon="lock" title="Privacy and your data" href="/account/privacy" />
        </ListGroup>

        <AccountActions />
      </ScreenBody>
      <NavBar active="account" />
    </Screen>
  );
}
